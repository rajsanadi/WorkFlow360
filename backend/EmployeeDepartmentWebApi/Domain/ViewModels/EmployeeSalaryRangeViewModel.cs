using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeDepartmentWebApi.Core.Domain.ViewModels
{
    public class EmployeeSalaryRangeViewModel
    {
        public string EmployeeName { get; set; }   
        public decimal SalaryAmount { get; set; }  
        public string DepartmentName { get; set; } 
    }
}

