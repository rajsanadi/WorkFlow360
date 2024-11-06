CREATE PROCEDURE GetDepartmentSalaryReport
    @Year INT
AS
BEGIN
    SELECT
        d.Name AS DepartmentName,
        MONTH(s.Date) AS [Month],
        SUM(s.Amount) AS TotalSalary
    FROM Salaries s
    INNER JOIN Employees e ON s.EmpId = e.Id
    INNER JOIN Departments d ON e.DeptId = d.Id
    WHERE YEAR(s.Date) = @Year
    GROUP BY d.Name, MONTH(s.Date)
    ORDER BY d.Name, [Month]
END
