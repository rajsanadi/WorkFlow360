CREATE PROCEDURE GetDepartmentMonthlySalaryReport
    @DepartmentId INT,
    @Month INT,
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Validate input parameters
    IF @Month < 1 OR @Month > 12
    BEGIN
        RAISERROR('Invalid month. Please enter a value between 1 and 12.', 16, 1);
        RETURN;
    END

    -- Optional: Validate DepartmentId exists
    IF NOT EXISTS (SELECT 1 FROM Departments WHERE Id = @DepartmentId)
    BEGIN
        RAISERROR('DepartmentId does not exist.', 16, 1);
        RETURN;
    END

    -- Fetch total salaries for the specified department, month, and year
    SELECT
        d.Name AS DepartmentName,
        SUM(s.Amount) AS TotalSalary
    FROM Salaries s
    INNER JOIN Employees e ON s.EmpId = e.Id
    INNER JOIN Departments d ON e.DeptId = d.Id
    WHERE d.Id = @DepartmentId
      AND MONTH(s.Date) = @Month
      AND YEAR(s.Date) = @Year
    GROUP BY d.Name
    ORDER BY d.Name;
END
