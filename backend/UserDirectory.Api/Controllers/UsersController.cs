
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserDirectory.Api.Data;
using UserDirectory.Api.DTOs;
using UserDirectory.Api.Models;

namespace UserDirectory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        var users = await _context.Users
            .AsNoTracking()
            .ToListAsync();

        return Ok(users);
    }

    // GET: api/users/5
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound(new { message = "User not found." });

        return Ok(user);
    }

    // POST: api/users
    [Authorize]
    [HttpPost]
public async Task<ActionResult<User>> CreateUser(
    [FromBody] CreateUserDto request)
{
    var user = new User
    {
        Name = request.Name.Trim(),
        Age = request.Age.Value,
        City = request.City.Trim(),
        State = request.State.Trim(),
        Pincode = request.Pincode.Trim()
    };

    _context.Users.Add(user);

    await _context.SaveChangesAsync();

    return CreatedAtAction(
        nameof(GetUser),
        new { id = user.Id },
        user
    );
}

    // PUT: api/users/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(
        int id,
        UpdateUserDto request)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound(new { message = "User not found." });

        user.Name = request.Name.Trim();
        user.Age = request.Age.Value;
        user.City = request.City.Trim();
        user.State = request.State.Trim();
        user.Pincode = request.Pincode.Trim();

        await _context.SaveChangesAsync();

        return Ok(user);
    }

    // DELETE: api/users/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound(new { message = "User not found." });

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
