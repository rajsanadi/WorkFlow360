using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EmployeeDepartmentWebApi.Core.Domain.Models;
using EmployeeDepartmentWebApi.Core.Domain.ViewModels;
using EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Context;
using Microsoft.EntityFrameworkCore;

namespace EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Services.CustomService.EmployeeService
{
    public class EmployeeService : IEmployeeService
    {
        private readonly ApplicationDbContext _context;

        public EmployeeService(ApplicationDbContext context)
        {
            _context = context;
        }

        
        public async Task<IEnumerable<EmployeeViewModel>> GetAllEmployeesAsync()
        {
            var employees = await _context.Employees
                .Include(e => e.Department)
                .Select(e => new EmployeeViewModel
                {
                    Id = e.Id,
                    Name = e.Name,
                    Email = e.Email,
                    Phone = e.Phone,
                    Gender = e.Gender,
                    DOB = e.DOB,
                    DeptId = e.DeptId,
                    DepartmentName = e.Department.Name
                })
                .ToListAsync();

            return employees;
        }

        // Get a specific employee by ID
        public async Task<EmployeeViewModel> GetEmployeeByIdAsync(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.Department)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (employee == null)
                return null;

            return new EmployeeViewModel
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Phone = employee.Phone,
                Gender = employee.Gender,
                DOB = employee.DOB,
                DeptId = employee.DeptId,
                DepartmentName = employee.Department.Name
            };
        }

        // Create a new employee
        public async Task<EmployeeViewModel> CreateEmployeeAsync(Employee employee)
        {
            // Basic validations can be added here if needed

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return await GetEmployeeByIdAsync(employee.Id);
        }

        // Update an existing employee
        public async Task<EmployeeViewModel> UpdateEmployeeAsync(Employee employee)
        {
            // Basic validations can be added here if needed

            _context.Entry(employee).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return await GetEmployeeByIdAsync(employee.Id);
        }

        // Delete an employee by ID
        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return false;

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return true;
        }

        // Search employees based on a search term (case-insensitive)
        public async Task<IEnumerable<EmployeeViewModel>> SearchEmployeesAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return await GetAllEmployeesAsync();
            }

            searchTerm = searchTerm.ToLower();

            var employees = await _context.Employees
                .Include(e => e.Department)
                .Where(e =>
                    e.Name.ToLower().Contains(searchTerm) ||
                    e.Email.ToLower().Contains(searchTerm) ||
                    e.Phone.ToLower().Contains(searchTerm) ||
                    e.Gender.ToLower().Contains(searchTerm) ||
                    e.Department.Name.ToLower().Contains(searchTerm)
                )
                .Select(e => new EmployeeViewModel
                {
                    Id = e.Id,
                    Name = e.Name,
                    Email = e.Email,
                    Phone = e.Phone,
                    Gender = e.Gender,
                    DOB = e.DOB,
                    DeptId = e.DeptId,
                    DepartmentName = e.Department.Name
                })
                .ToListAsync();

            return employees;
        }
    }
}
