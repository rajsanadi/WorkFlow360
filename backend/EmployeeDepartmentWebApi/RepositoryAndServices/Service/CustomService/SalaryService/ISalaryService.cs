using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EmployeeDepartmentWebApi.Core.Domain.Models;
using EmployeeDepartmentWebApi.Core.Domain.ViewModels;

namespace EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Services.CustomService.SalaryService
{
    public interface ISalaryService
    {
       
        Task<IEnumerable<SalaryViewModel>> GetAllSalariesAsync();
        Task<SalaryViewModel> GetSalaryByIdAsync(int id);
        Task<SalaryViewModel> CreateSalaryAsync(Salary salary);
        Task<SalaryViewModel> UpdateSalaryAsync(Salary salary);
        Task<bool> DeleteSalaryAsync(int id);

        
        Task<IEnumerable<EmployeeSalaryRangeViewModel>> GetEmployeesBySalaryRangeAsync(decimal minSalary, decimal maxSalary);
        Task<IEnumerable<DepartmentSalaryReportViewModel>> GetDepartmentSalaryReportAsync(int year);
        Task<IEnumerable<DepartmentMonthlySalaryReportViewModel>> GetDepartmentMonthlySalaryReportAsync(int departmentId, int month, int year);
    }
}
