using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Food", Icon = "Utensils" },
                new Category { Id = 2, Name = "Entertainment", Icon = "Ticket" },
                new Category { Id = 3, Name = "Electronics", Icon = "Laptop" }
            );

            modelBuilder.Entity<Discount>().HasData(
                new Discount { Id = 1, Title = "50% off Lviv Croissants", Description = "Amazing deal right in Rynok Square", OriginalPrice = 100, DiscountPrice = 50, Latitude = 49.8419, Longitude = 24.0315, CategoryId = 1, DateAdded = DateTime.UtcNow },
                new Discount { Id = 2, Title = "Cinema City Multiplex", Description = "2 for 1 movie tickets", OriginalPrice = 300, DiscountPrice = 150, Latitude = 49.8093, Longitude = 24.0089, CategoryId = 2, DateAdded = DateTime.UtcNow },
                new Discount { Id = 3, Title = "Comfy Outlet", Description = "Laptops on Sale", OriginalPrice = 20000, DiscountPrice = 18000, Latitude = 49.8252, Longitude = 23.9743, CategoryId = 3, DateAdded = DateTime.UtcNow }
            );

            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "demouser", SavedDiscountIds = new List<int> { 1 }, FavoriteCategoryIds = new List<int> { 1, 2 } }
            );
        }
    }
}
