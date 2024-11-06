using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EmployeeDepartmentWebApi.Core.Domain.Models;
using EmployeeDepartmentWebApi.Core.Domain.ViewModels;
using EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Context;
using Microsoft.EntityFrameworkCore;

namespace EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Services.CustomService.DepartmentService
{
    public class DepartmentService : IDepartmentService
    {
        private readonly ApplicationDbContext _context;

        public DepartmentService(ApplicationDbContext context)
        {
            _context = context;
        }

       
        public async Task<IEnumerable<DepartmentViewModel>> GetAllDepartmentsAsync()
        {
            var departments = await _context.Departments
                .Select(d => new DepartmentViewModel
                {
                    Id = d.Id,
                    Name = d.Name
                })
                .ToListAsync();

            return departments;
        }

        
        public async Task<DepartmentViewModel> GetDepartmentByIdAsync(int id)
        {
            var department = await _context.Departments.FindAsync(id);

            if (department == null)
                return null;

            return new DepartmentViewModel
            {
                Id = department.Id,
                Name = department.Name
            };
        }

        
        public async Task<DepartmentViewModel> CreateDepartmentAsync(Department department)
        {
            

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();

            return await GetDepartmentByIdAsync(department.Id);
        }

        
        public async Task<DepartmentViewModel> UpdateDepartmentAsync(Department department)
        {
            

            _context.Entry(department).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return await GetDepartmentByIdAsync(department.Id);
        }

        
        public async Task<bool> DeleteDepartmentAsync(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
                return false;

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
