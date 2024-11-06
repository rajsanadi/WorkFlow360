using System;
using System.ComponentModel.DataAnnotations;

namespace EmployeeDepartmentWebApi.Core.Domain.ViewModels
{
    public class SalaryViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Employee ID is required.")]
        public int EmpId { get; set; }

        [Required(ErrorMessage = "Salary Amount is required.")]
        [Range(0, double.MaxValue, ErrorMessage = "Amount must be a positive value.")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Date is required.")]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        public string? EmployeeName { get; set; }
    }
}
