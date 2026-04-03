using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Setup JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

// ----------------------
// Auth Endpoints
// ----------------------


app.MapPost("/api/auth/register", async (AuthRequest req, AppDbContext db) =>
{
    if (await db.Users.AnyAsync(u => u.Username == req.Username)) return Results.BadRequest("User already exists.");
    
    var user = new User
    {
        Username = req.Username,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
    };
    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Registered successfully" });
});

app.MapPost("/api/auth/login", async (AuthRequest req, AppDbContext db, IConfiguration config) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == req.Username);
    if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
        return Results.Unauthorized();

    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.UTF8.GetBytes(config["Jwt:Key"]!);
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity([
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        ]),
        Expires = DateTime.UtcNow.AddDays(7),
        Issuer = config["Jwt:Issuer"],
        Audience = config["Jwt:Audience"],
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    return Results.Ok(new { token = tokenHandler.WriteToken(token), user = new { user.Id, user.Username } });
});

// ----------------------
// Existing Endpoints
// ----------------------
app.MapGet("/api/categories", async (AppDbContext db) =>
{
    return await db.Categories.ToListAsync();
});

app.MapGet("/api/discounts", async (AppDbContext db, string? query, int? categoryId) =>
{
    var ds = db.Discounts.Include(d => d.Category).AsQueryable();
    if (!string.IsNullOrWhiteSpace(query))
    {
        ds = ds.Where(d => d.Title.ToLower().Contains(query.ToLower()) || (d.Description != null && d.Description.ToLower().Contains(query.ToLower())));
    }
    if (categoryId.HasValue)
    {
        ds = ds.Where(d => d.CategoryId == categoryId.Value);
    }
    return await ds.OrderByDescending(d => d.DateAdded).ToListAsync();
});

app.MapGet("/api/discounts/{id}", async (int id, AppDbContext db) =>
{
    return await db.Discounts.Include(d => d.Category).FirstOrDefaultAsync(d => d.Id == id) is Discount discount
        ? Results.Ok(discount)
        : Results.NotFound();
});

// Secure Profile Endpoints
app.MapGet("/api/users/profile", async (ClaimsPrincipal cp, AppDbContext db) =>
{
    var idClaim = cp.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (idClaim == null || !int.TryParse(idClaim, out int id)) return Results.Unauthorized();

    return await db.Users.FindAsync(id) is User user
        ? Results.Ok(user)
        : Results.NotFound();
}).RequireAuthorization();

app.MapPost("/api/users/save-discount", async (int discountId, ClaimsPrincipal cp, AppDbContext db) =>
{
    var idClaim = cp.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (idClaim == null || !int.TryParse(idClaim, out int id)) return Results.Unauthorized();

    var user = await db.Users.FindAsync(id);
    if (user == null) return Results.NotFound();

    if (!user.SavedDiscountIds.Contains(discountId))
    {
        user.SavedDiscountIds.Add(discountId);
        await db.SaveChangesAsync();
    }
    else
    {
        user.SavedDiscountIds.Remove(discountId);
        await db.SaveChangesAsync();
    }
    return Results.Ok(user);
}).RequireAuthorization();

app.MapPost("/api/users/favorite-category", async (int categoryId, ClaimsPrincipal cp, AppDbContext db) =>
{
    var idClaim = cp.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (idClaim == null || !int.TryParse(idClaim, out int id)) return Results.Unauthorized();

    var user = await db.Users.FindAsync(id);
    if (user == null) return Results.NotFound();

    if (!user.FavoriteCategoryIds.Contains(categoryId))
    {
        user.FavoriteCategoryIds.Add(categoryId);
        await db.SaveChangesAsync();
    }
    else
    {
        user.FavoriteCategoryIds.Remove(categoryId);
        await db.SaveChangesAsync();
    }
    return Results.Ok(user);
}).RequireAuthorization();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try {
        db.Database.Migrate();
    } catch {
    }
}

app.Run();

public record AuthRequest(string Username, string Password);
