using LottoManager.Data;
using LottoManager.Models;
using LottoManager.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;




[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:ApiVersion}/gasStations")]
public class GasStationController: ControllerBase{

    private readonly ApplicationDbContext _context;

    public GasStationController(ApplicationDbContext context){
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GasStationDTO>>> GetGasStations(){
        var gasStations = await _context.GasStations.ToListAsync();

        return gasStations.Select(g => new GasStationDTO{
            GasStationID = g.GasStationID,
            Name = g.Name,
            Location = g.Location,
            Email = g.Email
        }).ToList();
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<GasStationDTO>> GetGasStation(int id){

        var gasStation = await _context.GasStations.FindAsync(id);

        
        if (gasStation == null){
            return NotFound("Does Not exist");
        }


       return new GasStationDTO{
            GasStationID = gasStation.GasStationID,
            Name = gasStation.Name,
            Location = gasStation.Location, 
            Email = gasStation.Email
        };
    }


    [HttpPost]
    public async Task<ActionResult<GasStationDTO>> CreateGasStation(GasStationDTO gasStationDTO){
        var gasStation = new GasStation{
            Name = gasStationDTO.Name,
            Location = gasStationDTO.Location,
            Email = gasStationDTO.Email,
            CreatedAt = DateTime.UtcNow
        };

        _context.GasStations.Add(gasStation);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGasStation), new {id= gasStation.GasStationID}, gasStationDTO);
    }

}