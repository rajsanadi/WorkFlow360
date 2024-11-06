namespace EmployeeDepartmentWebApi.Core.Domain.ViewModels
{
    public class DepartmentSalaryReportViewModel
    {
        public string DepartmentName { get; set; } 
        public int Month { get; set; }             
        public decimal TotalSalary { get; set; }   
    }
}
