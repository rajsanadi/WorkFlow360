using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EmployeeDepartmentWebApi.Core.Domain.Models
{
    public class Department
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Department Name is required.")]
        [StringLength(100, ErrorMessage = "Department Name can't be longer than 100 characters.")]
        public string Name { get; set; }

       
        public ICollection<Employee> Employees { get; set; }
    }
}
