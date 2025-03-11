
using LottoManager.DTO;
using LottoManager.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiVersion("1.0")]
[Route("/api/v{version:ApiVersion}/Lottery")]
[ApiController]
public class LotteryController: ControllerBase{ 

    private readonly ApplicationDbContext _context;


    public LotteryController(ApplicationDbContext context){
        _context = context;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<LotteryDTO>>> GetAllLottery(){
        

        var lotteryInfo = await _context.Lotterys.ToListAsync();
        return lotteryInfo.Select(l => new LotteryDTO{
            Id = l.LotteryID,
            Name = l.LotteryName,
            GameNumber = l.GameNumber,
            URL = l.ImageURL
        }).ToList();
        
    }

    

    
    



}