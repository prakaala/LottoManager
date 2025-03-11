using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LottoManager.Models;

namespace LottoManager.Models{
    public class User{  
        [Required]
        public int UserID { get; set; }

        [ForeignKey("GasStation")]
        public int? GasStationID { get; set; }

        [Required]
        public string Name{get; set;} = string.Empty;

        [EmailAddress]
        [MaxLength(255)]
        [Required]
        public string Email { get; set; } = string.Empty;

        public string?  PasswordHash { get; set; }

        [Required]
        [MaxLength(20)]
        public string  Role { get; set; } = "GasStation";

        public DateTime CreatedAt {get;set;} = DateTime.UtcNow;


        //one-to-many relation
        public GasStation? GasStation { get; set; }

    }
}