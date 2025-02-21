namespace LottoManager.DTO{
    public class GasStationDTO{
        public int GasStationID{get; set;}

        public string Name { get; set; }  = string.Empty;

        public string  Location { get; set; } = string.Empty;

        public string Email { get; set; }  = string.Empty;
    }


    public class LotteryDTO{

        public int Id { get; set; }
        
        public string Name { get; set; }

        public string GameNumber { get; set; }


        public string URL { get; set; }


    }
}