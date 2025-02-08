using Microsoft.EntityFrameworkCore;
using LottoManager.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
    );

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        dbContext.Database.OpenConnection(); 
        Console.WriteLine("Successfully connected to the database!");
        dbContext.Database.CloseConnection(); 
    }
    catch (Exception ex)
    {
        Console.WriteLine("PRinting Here");
        //Console.WriteLine($" Database connection failed: {ex.Message}");
    }
}
app.UseAuthorization();
app.MapControllers();
app.Run();

