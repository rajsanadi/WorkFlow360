using System.ComponentModel.DataAnnotations;

namespace EmployeeDepartmentWebApi.Core.Domain.ViewModels
{
    public class DepartmentViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Department Name is required.")]
        [StringLength(100, ErrorMessage = "Department Name can't be longer than 100 characters.")]
        public string Name { get; set; }
    }
}
