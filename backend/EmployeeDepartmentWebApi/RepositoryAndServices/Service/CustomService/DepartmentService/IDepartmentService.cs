using System.Collections.Generic;
using System.Threading.Tasks;
using EmployeeDepartmentWebApi.Core.Domain.Models;
using EmployeeDepartmentWebApi.Core.Domain.ViewModels;

namespace EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Services.CustomService.DepartmentService
{
    public interface IDepartmentService
    {
        
        Task<IEnumerable<DepartmentViewModel>> GetAllDepartmentsAsync();
        Task<DepartmentViewModel> GetDepartmentByIdAsync(int id);
        Task<DepartmentViewModel> CreateDepartmentAsync(Department department);
        Task<DepartmentViewModel> UpdateDepartmentAsync(Department department);
        Task<bool> DeleteDepartmentAsync(int id);
    }
}
