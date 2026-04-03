namespace Backend.Models
{
    public class Category
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Icon { get; set; }

        public ICollection<Discount> Discounts { get; set; } = new List<Discount>();
    }
}
