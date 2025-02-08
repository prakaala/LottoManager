using LottoManager.Models;
using Microsoft.EntityFrameworkCore;

namespace LottoManager.Data{

    public class ApplicationDbContext:DbContext{

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): 
        base(options){}


        public DbSet<GasStation> GasStations { get; set; }
    }
}