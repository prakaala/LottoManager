using LottoManager.Models;
using Microsoft.EntityFrameworkCore;
using Models.User;

namespace LottoManager.Data{

    public class ApplicationDbContext:DbContext{

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): 
        base(options){}


        public DbSet<GasStation> GasStations { get; set; }
        public DbSet<User> Users{get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().
            HasOne(u =>u.GasStation).
            WithMany().
            HasForeignKey(u=>u.GasStationID).
            OnDelete(DeleteBehavior.SetNull);

        }

    }
}