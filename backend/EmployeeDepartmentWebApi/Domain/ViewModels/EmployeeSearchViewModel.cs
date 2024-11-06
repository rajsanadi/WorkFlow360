using System;

namespace EmployeeDepartmentWebApi.Core.Domain.ViewModels
{
    public class EmployeeSearchViewModel
    {
        public int Id { get; set; }               
        public string Name { get; set; }          
        public string Email { get; set; }         
        public string Phone { get; set; }          
        public string Gender { get; set; }         
        public DateTime DOB { get; set; }          
        public string DepartmentName { get; set; } 
    }
}
