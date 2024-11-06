using System.Collections.Generic;
using System.Threading.Tasks;

namespace EmployeeDepartmentWebApi.Infrastructure.RepositoryAndServices.Service.GenericService
{
    public interface IService<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task<T> AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
    }
}
