namespace Backend.Models
{
    public class Discount
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal DiscountPrice { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public DateTime DateAdded { get; set; }

        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
