using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Services.CustomService.EmployeeService;
using EmployeeDepartmentWebApi.Core.Domain.Models;
using EmployeeDepartmentWebApi.Core.Domain.ViewModels;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace EmployeeDepartmentWebApi.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly ILogger<EmployeesController> _logger;

        public EmployeesController(IEmployeeService employeeService, ILogger<EmployeesController> logger)
        {
            _employeeService = employeeService;
            _logger = logger;
        }

        // GET: api/Employees
        [HttpGet]
        public async Task<IActionResult> GetEmployees()
        {
            _logger.LogInformation("Fetching all employees.");
            try
            {
                var employees = await _employeeService.GetAllEmployeesAsync();
                _logger.LogInformation($"Fetched employees successfully.");
                return Ok(employees);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all employees.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // GET: api/Employees/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            _logger.LogInformation($"Fetching employee with ID: {id}.");
            try
            {
                var employee = await _employeeService.GetEmployeeByIdAsync(id);
                if (employee == null)
                {
                    _logger.LogWarning($"Employee with ID: {id} not found.");
                    return NotFound(new { message = "Employee not found." });
                }

                _logger.LogInformation($"Employee with ID: {id} fetched successfully.");
                return Ok(employee);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while fetching employee with ID: {id}.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // POST: api/Employees
        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] EmployeeCreateModel model)
        {
            _logger.LogInformation("Creating a new employee.");
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid employee data received.");
                return BadRequest(ModelState);
            }

            try
            {
                var employee = new Employee
                {
                    Name = model.Name,
                    Email = model.Email,
                    Phone = model.Phone,
                    Gender = model.Gender,
                    DOB = model.DOB,
                    DeptId = model.DeptId
                };

                var createdEmployee = await _employeeService.CreateEmployeeAsync(employee);
                _logger.LogInformation($"Employee created successfully with ID: {createdEmployee.Id}.");

                // Assuming that CreateEmployeeAsync returns EmployeeViewModel
                return CreatedAtAction(nameof(GetEmployee), new { id = createdEmployee.Id }, createdEmployee);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a new employee.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // PUT: api/Employees/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeUpdateModel model)
        {
            _logger.LogInformation($"Updating employee with ID: {id}.");
            if (id != model.Id)
            {
                _logger.LogWarning($"Employee ID mismatch: Route ID {id} does not match Model ID {model.Id}.");
                return BadRequest(new { message = "Employee ID mismatch." });
            }

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid employee data received for update.");
                return BadRequest(ModelState);
            }

            try
            {
                var employee = new Employee
                {
                    Id = model.Id,
                    Name = model.Name,
                    Email = model.Email,
                    Phone = model.Phone,
                    Gender = model.Gender,
                    DOB = model.DOB,
                    DeptId = model.DeptId
                };

                var updatedEmployee = await _employeeService.UpdateEmployeeAsync(employee);

                if (updatedEmployee == null)
                {
                    _logger.LogWarning($"Employee with ID: {id} not found for update.");
                    return NotFound(new { message = "Employee not found." });
                }

                _logger.LogInformation($"Employee with ID: {id} updated successfully.");
                return Ok(updatedEmployee);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while updating employee with ID: {id}.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // DELETE: api/Employees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            _logger.LogInformation($"Deleting employee with ID: {id}.");
            try
            {
                var result = await _employeeService.DeleteEmployeeAsync(id);
                if (!result)
                {
                    _logger.LogWarning($"Employee with ID: {id} not found for deletion.");
                    return NotFound(new { message = "Employee not found." });
                }

                _logger.LogInformation($"Employee with ID: {id} deleted successfully.");
                return NoContent();
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while deleting employee with ID: {id}.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // Search Employees
        [HttpGet("Search")]
        public async Task<IActionResult> SearchEmployees([FromQuery] string searchTerm)
        {
            _logger.LogInformation($"Searching employees with term: '{searchTerm}'.");
            try
            {
                var employees = await _employeeService.SearchEmployeesAsync(searchTerm);
                _logger.LogInformation($"Found employees matching the search term '{searchTerm}'.");
                return Ok(employees);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while searching employees with term: '{searchTerm}'.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }
    }
}
