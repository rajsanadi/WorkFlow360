using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using EmployeeDepartmentWebApi.Core.Domain.Models;
using EmployeeDepartmentWebApi.Core.Domain.ViewModels;

namespace EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Context
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Salary> Salaries { get; set; }
        public DbSet<DepartmentSalaryReportViewModel> DepartmentSalaryReports { get; set; }
        public DbSet<DepartmentMonthlySalaryReportViewModel> DepartmentMonthlySalaryReports { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Department)
                .WithMany(d => d.Employees)
                .HasForeignKey(e => e.DeptId)
                .OnDelete(DeleteBehavior.Restrict);

           
            modelBuilder.Entity<Salary>()
                .HasOne(s => s.Employee)
                .WithMany(e => e.Salaries)
                .HasForeignKey(s => s.EmpId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DepartmentSalaryReportViewModel>().HasNoKey();
            modelBuilder.Entity<DepartmentMonthlySalaryReportViewModel>().HasNoKey().ToView(null);
        }
    }
}
