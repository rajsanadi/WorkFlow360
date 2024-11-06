using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeDepartmentWebApi.Core.Domain.Models
{
    public class Salary
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Employee ID is required.")]
        public int EmpId { get; set; }

        [Required(ErrorMessage = "Salary Amount is required.")]
        [Range(0, double.MaxValue, ErrorMessage = "Salary Amount must be a positive number.")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Salary Date is required.")]
        [DataType(DataType.Date)]
        [CustomValidation(typeof(Salary), nameof(ValidateDate))]
        public DateTime Date { get; set; }

       
        [ForeignKey("EmpId")]
        public Employee Employee { get; set; }

       
        public static ValidationResult ValidateDate(DateTime date, ValidationContext context)
        {
            if (date > DateTime.Today)
            {
                return new ValidationResult("Salary Date cannot be in the future.");
            }
            return ValidationResult.Success;
        }
    }
}
