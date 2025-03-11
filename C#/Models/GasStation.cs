using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LottoManager.Models{
    public class GasStation{

        [Key]
        public int GasStationID { get; set; }

        [Required]     
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<TicketInventory> TicketInventorys {get; set;} = new();
    }
}