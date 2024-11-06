using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeDepartmentWebApi.Core.Domain.ViewModels
{
    public class DepartmentMonthlySalaryReportViewModel
    {
        public string DepartmentName { get; set; }
        public decimal TotalSalary { get; set; }
    }
}
