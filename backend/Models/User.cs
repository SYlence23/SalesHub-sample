namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public string PasswordHash { get; set; } = string.Empty;
        
        public List<int> SavedDiscountIds { get; set; } = new List<int>();
        public List<int> FavoriteCategoryIds { get; set; } = new List<int>();
    }
}
