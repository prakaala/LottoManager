using System.ComponentModel.DataAnnotations;

namespace Models.Lottery{

    public class Lottery{

        [Key]
        public int LotteryID { get; set; }

        [Required]
        [MaxLength(100)]
        public string  LotteryName { get; set; } = string.Empty;

        [Required]
        public int Price { get; set; }

        [Required]
        [MaxLength(10)]
        public string GameNumber { get; set; } = string.Empty;

        [Required]
        public int PackSize { get; set; }
        
        public int? SlotNumber{ get; set; }

        [MaxLength(255)]
        public String? ImageURL { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }



}