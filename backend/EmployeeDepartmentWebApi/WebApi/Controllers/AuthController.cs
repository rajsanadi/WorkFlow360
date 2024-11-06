using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using EmployeeDepartmentWebApi.Core.Domain.Models;
using EmployeeDepartmentWebApi.Core.Domain.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace EmployeeDepartmentWebApi.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(UserManager<ApplicationUser> userManager,
                              IConfiguration configuration,
                              ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
        }

        // POST: api/Auth/Register
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            _logger.LogInformation($"Register attempt for Email: {model.Email}");
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid registration data received.");
                return BadRequest(ModelState);
            }

            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
            {
                _logger.LogWarning($"User already exists with Email: {model.Email}");
                return BadRequest(new { message = "User already exists" });
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                _logger.LogWarning($"User registration failed for Email: {model.Email}. Errors: {errors}");
                return BadRequest(new { message = errors });
            }

            _logger.LogInformation($"User registered successfully with Email: {model.Email}");
            return Ok(new { message = "User registered successfully" });
        }

        // POST: api/Auth/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            _logger.LogInformation($"Login attempt for Email: {model.Email}");
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid login data received.");
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                _logger.LogWarning($"Login failed. User not found with Email: {model.Email}");
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var result = await _userManager.CheckPasswordAsync(user, model.Password);

            if (!result)
            {
                _logger.LogWarning($"Login failed. Invalid password for Email: {model.Email}");
                return Unauthorized(new { message = "Invalid credentials" });
            }

            
            var token = GenerateJwtToken(user);
            _logger.LogInformation($"User logged in successfully with Email: {model.Email}");

            return Ok(new { token });
        }

        

        // Helper 
        private string GenerateJwtToken(ApplicationUser user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(jwtSettings.GetValue<string>("Key"));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Email, user.Email)
                    
                }),
                Expires = DateTime.UtcNow.AddMinutes(jwtSettings.GetValue<int>("ExpiresInMinutes")),
                Issuer = jwtSettings.GetValue<string>("Issuer"),
                Audience = jwtSettings.GetValue<string>("Audience"),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            _logger.LogInformation($"JWT token generated for User ID: {user.Id}, Email: {user.Email}");
            return tokenHandler.WriteToken(token);
        }
    }
}
