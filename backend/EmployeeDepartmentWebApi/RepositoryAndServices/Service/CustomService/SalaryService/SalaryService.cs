using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EmployeeDepartmentWebApi.Core.Domain.Models;
using EmployeeDepartmentWebApi.Core.Domain.ViewModels;
using EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Context;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Services.CustomService.SalaryService
{
    public class SalaryService : ISalaryService
    {
        private readonly ApplicationDbContext _context;

        public SalaryService(ApplicationDbContext context)
        {
            _context = context;
        }

        
        public async Task<IEnumerable<SalaryViewModel>> GetAllSalariesAsync()
        {
            var salaries = await _context.Salaries
                .Include(s => s.Employee)
                .ThenInclude(e => e.Department)
                .Select(s => new SalaryViewModel
                {
                    Id = s.Id,
                    EmpId = s.EmpId,
                    Amount = s.Amount,
                    Date = s.Date,
                    EmployeeName = s.Employee.Name
                })
                .ToListAsync();

            return salaries;
        }

        
        public async Task<SalaryViewModel> GetSalaryByIdAsync(int id)
        {
            var salary = await _context.Salaries
                .Include(s => s.Employee)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (salary == null)
                return null;

            return new SalaryViewModel
            {
                Id = salary.Id,
                EmpId = salary.EmpId,
                Amount = salary.Amount,
                Date = salary.Date,
                EmployeeName = salary.Employee.Name
            };
        }

        
        public async Task<SalaryViewModel> CreateSalaryAsync(Salary salary)
        {
            

            _context.Salaries.Add(salary);
            await _context.SaveChangesAsync();

            return await GetSalaryByIdAsync(salary.Id);
        }

        
        public async Task<SalaryViewModel> UpdateSalaryAsync(Salary salary)
        {
            

            _context.Entry(salary).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return await GetSalaryByIdAsync(salary.Id);
        }

        
        public async Task<bool> DeleteSalaryAsync(int id)
        {
            var salary = await _context.Salaries.FindAsync(id);
            if (salary == null)
                return false;

            _context.Salaries.Remove(salary);
            await _context.SaveChangesAsync();
            return true;
        }

        
        public async Task<IEnumerable<EmployeeSalaryRangeViewModel>> GetEmployeesBySalaryRangeAsync(decimal minSalary, decimal maxSalary)
        {
            var employeesInRange = await _context.Salaries
                .Include(s => s.Employee)
                .ThenInclude(e => e.Department)
                .Where(s => s.Amount >= minSalary && s.Amount <= maxSalary)
                .Select(s => new EmployeeSalaryRangeViewModel
                {
                    EmployeeName = s.Employee.Name,
                    SalaryAmount = s.Amount,
                    DepartmentName = s.Employee.Department.Name
                })
                .Distinct()
                .ToListAsync();

            return employeesInRange;
        }

        //stored Procedure
        public async Task<IEnumerable<DepartmentSalaryReportViewModel>> GetDepartmentSalaryReportAsync(int year)
        {
            

            var yearParam = new SqlParameter("@Year", year);

            var result = await _context.DepartmentSalaryReports
                .FromSqlRaw("EXEC GetDepartmentSalaryReport @Year", yearParam)
                .ToListAsync();

            return result;
        }
        public async Task<IEnumerable<DepartmentMonthlySalaryReportViewModel>> GetDepartmentMonthlySalaryReportAsync(int departmentId, int month, int year)
        {
            var departmentIdParam = new SqlParameter("@DepartmentId", departmentId);
            var monthParam = new SqlParameter("@Month", month);
            var yearParam = new SqlParameter("@Year", year);

            var result = await _context.DepartmentMonthlySalaryReports
                .FromSqlRaw("EXEC dbo.GetDepartmentMonthlySalaryReport @DepartmentId, @Month, @Year", departmentIdParam, monthParam, yearParam)
                .ToListAsync();

            return result;
        }
    }
}
