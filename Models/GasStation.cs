using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LottoManager.Models{
    public class GasStation{

        [Key]
        public int gasStationID { get; set; }

        [Required]     
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        public DateTime createdAt { get; set; } = DateTime.UtcNow;
    }
}