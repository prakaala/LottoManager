using Microsoft.EntityFrameworkCore;
using LottoManager.Data;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddApiVersioning(
    options =>{
        options.ReportApiVersions= true;
        options.AssumeDefaultVersionWhenUnspecified=true;
        options.DefaultApiVersion = new ApiVersion(1,0);
    }
);


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
    );

var app = builder.Build();



app.UseAuthorization();
app.MapControllers();
app.Run();

