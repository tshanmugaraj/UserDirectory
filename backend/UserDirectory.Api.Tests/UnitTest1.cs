
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using UserDirectory.Api.Controllers;
using UserDirectory.Api.Data;
using UserDirectory.Api.DTOs;
using UserDirectory.Api.Models;
using Xunit;

namespace UserDirectory.Api.Tests;

public class UnitTest1 : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly AppDbContext _context;
    private readonly UsersController _controller;

    public UnitTest1()
    {
        // Create a separate in-memory SQLite database for testing
        _connection = new SqliteConnection("Data Source=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(_connection)
            .Options;

        _context = new AppDbContext(options);

        _context.Database.EnsureCreated();

        _controller = new UsersController(_context);
    }

    // 1. Test: Get all users
    [Fact]
    public async Task GetUsers_ReturnsAllUsers()
    {
        _context.Users.AddRange(
            new User
            {
                Name = "Raj",
                Age = 30,
                City = "Chennai",
                State = "Tamil Nadu",
                Pincode = "600001"
            },
            new User
            {
                Name = "Kumar",
                Age = 28,
                City = "Bangalore",
                State = "Karnataka",
                Pincode = "560001"
            });

        await _context.SaveChangesAsync();

        var result = await _controller.GetUsers();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var users = Assert.IsAssignableFrom<IEnumerable<User>>(
            okResult.Value);

        Assert.Equal(2, users.Count());
    }

    // 2. Test: Get user by valid ID
    [Fact]
    public async Task GetUser_WithValidId_ReturnsUser()
    {
        var user = await AddTestUser();

        var result = await _controller.GetUser(user.Id);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedUser = Assert.IsType<User>(okResult.Value);

        Assert.Equal(user.Id, returnedUser.Id);
        Assert.Equal("Raj", returnedUser.Name);
    }

    // 3. Test: Get user by invalid ID
    [Fact]
    public async Task GetUser_WithInvalidId_ReturnsNotFound()
    {
        var result = await _controller.GetUser(999);

        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    // 4. Test: Create a new user
    [Fact]
    public async Task CreateUser_WithValidData_CreatesUser()
    {
        var request = new CreateUserDto
        {
            Name = "Raj",
            Age = 30,
            City = "Chennai",
            State = "Tamil Nadu",
            Pincode = "600001"
        };

        var result = await _controller.CreateUser(request);

        var createdResult =
            Assert.IsType<CreatedAtActionResult>(result.Result);

        var createdUser = Assert.IsType<User>(createdResult.Value);

        Assert.True(createdUser.Id > 0);
        Assert.Equal("Raj", createdUser.Name);

        Assert.Equal(1, await _context.Users.CountAsync());
    }

    // 5. Test: Update an existing user
    [Fact]
    public async Task UpdateUser_WithValidId_UpdatesUser()
    {
        var user = await AddTestUser();

        var request = new UpdateUserDto
        {
            Name = "Raj Updated",
            Age = 35,
            City = "Coimbatore",
            State = "Tamil Nadu",
            Pincode = "641001"
        };

        var result = await _controller.UpdateUser(user.Id, request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var updatedUser = Assert.IsType<User>(okResult.Value);

        Assert.Equal("Raj Updated", updatedUser.Name);
        Assert.Equal(35, updatedUser.Age);
        Assert.Equal("Coimbatore", updatedUser.City);
    }

    // 6. Test: Update a non-existing user
    [Fact]
    public async Task UpdateUser_WithInvalidId_ReturnsNotFound()
    {
        var request = new UpdateUserDto
        {
            Name = "Raj",
            Age = 30,
            City = "Chennai",
            State = "Tamil Nadu",
            Pincode = "600001"
        };

        var result = await _controller.UpdateUser(999, request);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    // 7. Test: Delete an existing user
    [Fact]
    public async Task DeleteUser_WithValidId_DeletesUser()
    {
        var user = await AddTestUser();

        var result = await _controller.DeleteUser(user.Id);

        Assert.IsType<NoContentResult>(result);

        Assert.Equal(0, await _context.Users.CountAsync());
    }

    // 8. Test: Delete a non-existing user
    [Fact]
    public async Task DeleteUser_WithInvalidId_ReturnsNotFound()
    {
        var result = await _controller.DeleteUser(999);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    // Helper method to create a test user
    private async Task<User> AddTestUser()
    {
        var user = new User
        {
            Name = "Raj",
            Age = 30,
            City = "Chennai",
            State = "Tamil Nadu",
            Pincode = "600001"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public void Dispose()
    {
        _context.Dispose();
        _connection.Dispose();
    }
}
