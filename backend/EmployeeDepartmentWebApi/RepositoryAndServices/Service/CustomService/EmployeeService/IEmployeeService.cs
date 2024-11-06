using System.Collections.Generic;
using System.Threading.Tasks;
using EmployeeDepartmentWebApi.Core.Domain.Models;
using EmployeeDepartmentWebApi.Core.Domain.ViewModels;

namespace EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Services.CustomService.EmployeeService
{
    public interface IEmployeeService
    {
        
        Task<IEnumerable<EmployeeViewModel>> GetAllEmployeesAsync();
        Task<EmployeeViewModel> GetEmployeeByIdAsync(int id);
        Task<EmployeeViewModel> CreateEmployeeAsync(Employee employee);
        Task<EmployeeViewModel> UpdateEmployeeAsync(Employee employee);
        Task<bool> DeleteEmployeeAsync(int id);

        
        Task<IEnumerable<EmployeeViewModel>> SearchEmployeesAsync(string searchTerm);
    }
}
