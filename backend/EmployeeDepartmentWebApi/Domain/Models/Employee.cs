using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeDepartmentWebApi.Core.Domain.Models
{
    public class Employee
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Employee Name is required.")]
        [StringLength(100, ErrorMessage = "Employee Name can't be longer than 100 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email Address is required.")]
        [EmailAddress(ErrorMessage = "Invalid Email Address format.")]
        [StringLength(100, ErrorMessage = "Email Address can't be longer than 100 characters.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Phone Number is required.")]
        [Phone(ErrorMessage = "Invalid Phone Number format.")]
        [StringLength(15, ErrorMessage = "Phone Number can't be longer than 15 characters.")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Gender is required.")]
        [StringLength(10, ErrorMessage = "Gender can't be longer than 10 characters.")]
        public string Gender { get; set; }

        [Required(ErrorMessage = "Date of Birth is required.")]
        [DataType(DataType.Date)]
        [CustomValidation(typeof(Employee), nameof(ValidateDOB))]
        public DateTime DOB { get; set; }

        [Required(ErrorMessage = "Department ID is required.")]
        public int DeptId { get; set; }

        
        [ForeignKey("DeptId")]
        public Department Department { get; set; }

        public ICollection<Salary> Salaries { get; set; }

       
        public static ValidationResult ValidateDOB(DateTime dob, ValidationContext context)
        {
            if (dob >= DateTime.Today)
            {
                return new ValidationResult("Date of Birth must be in the past.");
            }
            return ValidationResult.Success;
        }
    }
}
