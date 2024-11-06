using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Services.CustomService.DepartmentService;
using EmployeeDepartmentWebApi.Core.Domain.Models;
using EmployeeDepartmentWebApi.Core.Domain.ViewModels;
using Microsoft.Extensions.Logging;

namespace EmployeeDepartmentWebApi.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;
        private readonly ILogger<DepartmentsController> _logger;

        public DepartmentsController(IDepartmentService departmentService, ILogger<DepartmentsController> logger)
        {
            _departmentService = departmentService;
            _logger = logger;
        }

        // GET: api/Departments
        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            _logger.LogInformation("Fetching all departments.");
            try
            {
                var departments = await _departmentService.GetAllDepartmentsAsync();
                _logger.LogInformation($"Fetched departments successfully.");
                return Ok(departments);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all departments.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // GET: api/Departments/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartment(int id)
        {
            _logger.LogInformation($"Fetching department with ID: {id}.");
            try
            {
                var department = await _departmentService.GetDepartmentByIdAsync(id);
                if (department == null)
                {
                    _logger.LogWarning($"Department with ID: {id} not found.");
                    return NotFound(new { message = "Department not found." });
                }

                _logger.LogInformation($"Department with ID: {id} fetched successfully.");
                return Ok(department);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while fetching department with ID: {id}.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // POST: api/Departments
        [HttpPost]
        public async Task<IActionResult> CreateDepartment([FromBody] DepartmentViewModel model)
        {
            _logger.LogInformation("Creating a new department.");
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid department data received.");
                return BadRequest(ModelState);
            }

            try
            {
                
                var department = new Department
                {
                    Name = model.Name
                };

                var createdDepartment = await _departmentService.CreateDepartmentAsync(department);
                _logger.LogInformation($"Department created successfully with ID: {createdDepartment.Id}.");

                return CreatedAtAction(nameof(GetDepartment), new { id = createdDepartment.Id }, createdDepartment);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a new department.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // PUT: api/Departments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] DepartmentViewModel model)
        {
            _logger.LogInformation($"Updating department with ID: {id}.");
            if (id != model.Id)
            {
                _logger.LogWarning($"Department ID mismatch: Route ID {id} does not match Model ID {model.Id}.");
                return BadRequest(new { message = "Department ID mismatch." });
            }

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid department data received for update.");
                return BadRequest(ModelState);
            }

            try
            {
               
                var department = new Department
                {
                    Id = model.Id,
                    Name = model.Name
                };

                var updatedDepartment = await _departmentService.UpdateDepartmentAsync(department);

                if (updatedDepartment == null)
                {
                    _logger.LogWarning($"Department with ID: {id} not found for update.");
                    return NotFound(new { message = "Department not found." });
                }

                _logger.LogInformation($"Department with ID: {id} updated successfully.");
                return Ok(updatedDepartment);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while updating department with ID: {id}.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // DELETE: api/Departments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            _logger.LogInformation($"Deleting department with ID: {id}.");
            try
            {
                var result = await _departmentService.DeleteDepartmentAsync(id);
                if (!result)
                {
                    _logger.LogWarning($"Department with ID: {id} not found for deletion.");
                    return NotFound(new { message = "Department not found." });
                }

                _logger.LogInformation($"Department with ID: {id} deleted successfully.");
                return NoContent();
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while deleting department with ID: {id}.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }
    }
}
