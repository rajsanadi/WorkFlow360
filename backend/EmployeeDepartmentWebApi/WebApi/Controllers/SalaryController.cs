using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Services.CustomService.SalaryService;
using EmployeeDepartmentWebApi.Core.Domain.Models;
using EmployeeDepartmentWebApi.Core.Domain.ViewModels;
using Microsoft.Extensions.Logging;

namespace EmployeeDepartmentWebApi.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SalariesController : ControllerBase
    {
        private readonly ISalaryService _salaryService;
        private readonly ILogger<SalariesController> _logger;

        public SalariesController(ISalaryService salaryService, ILogger<SalariesController> logger)
        {
            _salaryService = salaryService;
            _logger = logger;
        }

        // GET: api/Salaries
        [HttpGet]
        public async Task<IActionResult> GetSalaries()
        {
            _logger.LogInformation("Fetching all salaries.");
            try
            {
                var salaries = await _salaryService.GetAllSalariesAsync();
                _logger.LogInformation($"Fetched employees successfully.");
                return Ok(salaries);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all salaries.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // GET: api/Salaries/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSalary(int id)
        {
            _logger.LogInformation($"Fetching salary record with ID: {id}.");
            try
            {
                var salary = await _salaryService.GetSalaryByIdAsync(id);
                if (salary == null)
                {
                    _logger.LogWarning($"Salary record with ID: {id} not found.");
                    return NotFound(new { message = "Salary record not found." });
                }

                _logger.LogInformation($"Salary record with ID: {id} fetched successfully.");
                return Ok(salary);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while fetching salary record with ID: {id}.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // POST: api/Salaries
        [HttpPost]
        public async Task<IActionResult> CreateSalary([FromBody] SalaryViewModel model)
        {
            _logger.LogInformation("Creating a new salary record.");
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid salary data received.");
                return BadRequest(ModelState);
            }

            try
            {
               
                var salary = new Salary
                {
                    EmpId = model.EmpId,
                    Amount = model.Amount,
                    Date = model.Date
                };

                var createdSalary = await _salaryService.CreateSalaryAsync(salary);
                _logger.LogInformation($"Salary record created successfully with ID: {createdSalary.Id}.");

                return CreatedAtAction(nameof(GetSalary), new { id = createdSalary.Id }, createdSalary);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a new salary record.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // PUT: api/Salaries/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSalary(int id, [FromBody] SalaryViewModel model)
        {
            _logger.LogInformation($"Updating salary record with ID: {id}.");
            if (id != model.Id)
            {
                _logger.LogWarning($"Salary ID mismatch: Route ID {id} does not match Model ID {model.Id}.");
                return BadRequest(new { message = "Salary ID mismatch." });
            }

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid salary data received for update.");
                return BadRequest(ModelState);
            }

            try
            {
                
                var salary = new Salary
                {
                    Id = model.Id,
                    EmpId = model.EmpId,
                    Amount = model.Amount,
                    Date = model.Date
                };

                var updatedSalary = await _salaryService.UpdateSalaryAsync(salary);

                if (updatedSalary == null)
                {
                    _logger.LogWarning($"Salary record with ID: {id} not found for update.");
                    return NotFound(new { message = "Salary record not found." });
                }

                _logger.LogInformation($"Salary record with ID: {id} updated successfully.");
                return Ok(updatedSalary);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while updating salary record with ID: {id}.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // DELETE: api/Salaries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSalary(int id)
        {
            _logger.LogInformation($"Deleting salary record with ID: {id}.");
            try
            {
                var result = await _salaryService.DeleteSalaryAsync(id);
                if (!result)
                {
                    _logger.LogWarning($"Salary record with ID: {id} not found for deletion.");
                    return NotFound(new { message = "Salary record not found." });
                }

                _logger.LogInformation($"Salary record with ID: {id} deleted successfully.");
                return NoContent();
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while deleting salary record with ID: {id}.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        
        [HttpGet("EmployeesBySalaryRange")]
        public async Task<IActionResult> GetEmployeesBySalaryRange([FromQuery] decimal minSalary, [FromQuery] decimal maxSalary)
        {
            _logger.LogInformation($"Fetching employees with salaries between {minSalary} and {maxSalary}.");
            try
            {
                var employees = await _salaryService.GetEmployeesBySalaryRangeAsync(minSalary, maxSalary);
                _logger.LogInformation($"Found employees within the salary range {minSalary}-{maxSalary}.");
                return Ok(employees);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while fetching employees by salary range {minSalary}-{maxSalary}.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // salary report as per department
        [HttpGet("DepartmentSalaryReport")]
        public async Task<IActionResult> GetDepartmentSalaryReport([FromQuery] int year)
        {
            _logger.LogInformation($"Generating department salary report for the year {year}.");
            try
            {
                var report = await _salaryService.GetDepartmentSalaryReportAsync(year);
                _logger.LogInformation($"Department salary report for the year {year} generated successfully.");
                return Ok(report);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while generating department salary report for the year {year}.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }


        [HttpGet("DepartmentMonthlySalaryReport")]
        public async Task<IActionResult> GetDepartmentMonthlySalaryReport([FromQuery] int departmentId, [FromQuery] int month, [FromQuery] int year)
        {
            _logger.LogInformation($"Generating Department Monthly Salary Report: DepartmentId={departmentId}, Month={month}, Year={year}.");

            try
            {
                var report = await _salaryService.GetDepartmentMonthlySalaryReportAsync(departmentId, month, year);

                if (report == null || !report.Any())
                {
                    _logger.LogWarning($"No data found for DepartmentId={departmentId}, Month={month}, Year={year}.");
                    return NotFound(new { message = "No data found for the specified DepartmentId, Month, and Year." });
                }

                _logger.LogInformation($"Department Monthly Salary Report generated successfully for DepartmentId={departmentId}, Month={month}, Year={year}.");
                return Ok(report);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while generating Department Monthly Salary Report for DepartmentId={departmentId}, Month={month}, Year={year}.");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }


    }
}
