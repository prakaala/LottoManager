using LottoManager.Models;
using Microsoft.EntityFrameworkCore;


namespace LottoManager.Data{

    public class ApplicationDbContext:DbContext{

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): 
        base(options){}


        public DbSet<GasStation> GasStations { get; set; }
        public DbSet<User> Users{get; set;}
        public DbSet<Lottery> Lotterys{get; set;}

        public DbSet<TicketInventory> TicketInventorys{get;set;}

        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().
            HasOne(u =>u.GasStation).
            WithMany().
            HasForeignKey(u=>u.GasStationID).
            OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<TicketInventory>().
            HasOne(t => t.Lottery).
            WithMany().
            HasForeignKey(t=>t.LotteryID).
            OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TicketInventory>().
            HasOne(t => t.GasStation).
            WithMany(g=>g.TicketInventorys).
            HasForeignKey(t=>t.GasStationID).
            OnDelete(DeleteBehavior.Cascade);



            modelBuilder.Entity<TicketInventory>().
            HasIndex(t => new{t.GasStationID, t.LotteryID}).IsUnique();


        }

    }
}