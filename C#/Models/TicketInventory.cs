using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LottoManager.Models;

namespace LottoManager.Models{



    public class TicketInventory{


        [Key]
        public int InventoryID { get; set; }

        [ForeignKey("GasStation")]
        public int GasStationID { get; set; }


        [ForeignKey("Lottery")]
        public int LotteryID { get; set; }


        [Required]
        [MaxLength(255)]
        public string LotteryName { get; set; } = string.Empty;


        [Required]
        [MaxLength(10)]
        public string GameNumber { get; set; } = string.Empty;


        [Required]
        [MaxLength(20)]
        public string PackNumber { get; set; } = string.Empty;

        [Required]
        public int PackSize { get; set; }

        public int? SlotNumber { get; set; }

        public int CurrentNumber { get; set; } = 0;

        [Required]
        public int StartNumber { get; set; } = 0;

        [Required]
        public int EndNumber { get; set; }

        public int TotalSold { get; set; }

        public int ValueAmount { get; set; }


        public DateTime? ConfirmDate { get; set; }

        public DateTime? ActivateDate { get; set; }


        public DateTime? SoldOutDate {get; set;}

        public DateTime CreateAt {get;set;} = DateTime.UtcNow;



        //Navigation Properties

        public GasStation? GasStation{get; set;}
        public Lottery? Lottery{get; set;}


    }
}