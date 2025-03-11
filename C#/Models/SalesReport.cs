using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LottoManager.Models{



    public class SalesReport{



        [Key]
        public int ReportID { get; set; }

        [Required]
        public DateOnly Date { get; set; }

        [ForeignKey("GasStation")]
        public int GasStationID { get; set; }

        public int TotalSales { get; set; }


        public int TotalTicketsSold { get; set; }


        public int ActivatedTickets { get; set; }

        public int ConfirmedTickets {get; set;}
        public int SoldOutPacks { get; set; }

        public bool EmailSent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        public GasStation? GasStation { get; set; }
    }
}