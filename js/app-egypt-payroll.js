// ==================== نظام الرواتب المصري ====================
const APP_EGYPT_PAYROLL = (function() {
    'use strict';

    // ==================== Real Employees Data ====================
    const REAL_EMPLOYEES_DATA = [
        {
            id: 'EMP-001',
            name: 'منة',
            position: 'مبيعات',
            department: 'المبيعات',
            monthlySalary: 7000,
            totalPaid: 34820,
            monthsPaid: 5,
            hireDate: '2024-08-01',
            status: 'active'
        },
        {
            id: 'EMP-002',
            name: 'دعاء',
            position: 'محاسب',
            department: 'المحاسبة',
            monthlySalary: 8000,
            totalPaid: 40000,
            monthsPaid: 5,
            hireDate: '2024-08-01',
            status: 'active'
        },
        {
            id: 'EMP-003',
            name: 'حسام',
            position: 'مدير مبيعات',
            department: 'المبيعات',
            monthlySalary: 12000,
            totalPaid: 60000,
            monthsPaid: 5,
            hireDate: '2024-08-01',
            status: 'active'
        },
        {
            id: 'EMP-004',
            name: 'الحفناوي',
            position: 'مدير عام',
            department: 'الإدارة',
            monthlySalary: 15000,
            totalPaid: 75000,
            monthsPaid: 5,
            hireDate: '2024-08-01',
            status: 'active'
        }
    ];

    // ==================== Initialize ====================
    function initialize() {
        console.log('👔 تهيئة نظام الرواتب المصري...');
        
        // Load existing employees or use sample data
        let employees = APP_EGYPT_CORE.getData('payroll');
        if (!employees || employees.length === 0) {
            console.log('📥 تحميل البيانات النموذجية للموظفين');
            employees = REAL_EMPLOYEES_DATA;
            APP_EGYPT_CORE.saveData('payroll', employees);
        }
        
        return {
            initialized: true,
            employeeCount: employees.length,
            totalMonthlySalaries: calculateTotalMonthlySalaries()
        };
    }

    // ==================== Create Employee ====================
    function createEmployee(data) {
        const employees = APP_EGYPT_CORE.getData('payroll');
        
        const employee = {
            id: APP_EGYPT_CORE.generateId('EMP-'),
            name: data.name,
            position: data.position || '',
            department: data.department || '',
            monthlySalary: Number(data.monthlySalary),
            totalPaid: 0,
            monthsPaid: 0,
            hireDate: data.hireDate || new Date().toISOString().split('T')[0],
            status: 'active',
            bankAccount: data.bankAccount || '',
            nationalId: data.nationalId || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            notes: data.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        employees.push(employee);
        APP_EGYPT_CORE.saveData('payroll', employees);
        
        return employee;
    }

    // ==================== Update Employee ====================
    function updateEmployee(id, updates) {
        const employees = APP_EGYPT_CORE.getData('payroll');
        const index = employees.findIndex(e => e.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الموظف غير موجود' };
        }
        
        employees[index] = {
            ...employees[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        APP_EGYPT_CORE.saveData('payroll', employees);
        
        return { success: true, employee: employees[index] };
    }

    // ==================== Delete Employee ====================
    function deleteEmployee(id) {
        const employees = APP_EGYPT_CORE.getData('payroll');
        const index = employees.findIndex(e => e.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الموظف غير موجود' };
        }
        
        // Mark as terminated instead of deleting
        employees[index].status = 'terminated';
        employees[index].terminationDate = new Date().toISOString().split('T')[0];
        employees[index].updatedAt = new Date().toISOString();
        
        APP_EGYPT_CORE.saveData('payroll', employees);
        
        return { success: true, message: 'تم إنهاء عمل الموظف' };
    }

    // ==================== Pay Salary ====================
    function paySalary(employeeId, amount, month, year, paymentMethod = 'bank') {
        const employees = APP_EGYPT_CORE.getData('payroll');
        const employee = employees.find(e => e.id === employeeId);
        
        if (!employee) {
            return { success: false, message: 'الموظف غير موجود' };
        }
        
        // Update employee totals
        employee.totalPaid = (employee.totalPaid || 0) + amount;
        employee.monthsPaid = (employee.monthsPaid || 0) + 1;
        employee.lastPaymentDate = new Date().toISOString().split('T')[0];
        employee.updatedAt = new Date().toISOString();
        
        APP_EGYPT_CORE.saveData('payroll', employees);
        
        // Create expense record
        if (window.APP_EGYPT_EXPENSES) {
            APP_EGYPT_EXPENSES.createExpense({
                date: new Date(year, month - 1, 28).toISOString().split('T')[0],
                category: 'SALARIES',
                amount: amount,
                description: `راتب ${employee.name} - ${month}/${year}`,
                paymentMethod: paymentMethod,
                status: 'paid',
                reference: `SAL-${employeeId}-${year}${String(month).padStart(2, '0')}`
            });
        }
        
        return { 
            success: true, 
            message: 'تم صرف الراتب بنجاح',
            employee: employee
        };
    }

    // ==================== Get Employees ====================
    function getAllEmployees(filters = {}) {
        let employees = APP_EGYPT_CORE.getData('payroll');
        
        if (filters.status) {
            employees = employees.filter(e => e.status === filters.status);
        }
        
        if (filters.department) {
            employees = employees.filter(e => e.department === filters.department);
        }
        
        if (filters.search) {
            const search = filters.search.toLowerCase();
            employees = employees.filter(e => 
                e.name.toLowerCase().includes(search) ||
                e.position.toLowerCase().includes(search)
            );
        }
        
        employees.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        
        return employees;
    }

    function getEmployeeById(id) {
        const employees = APP_EGYPT_CORE.getData('payroll');
        return employees.find(e => e.id === id);
    }

    // ==================== Statistics ====================
    function calculateTotalMonthlySalaries(status = 'active') {
        const employees = getAllEmployees({ status });
        return employees.reduce((sum, e) => sum + (e.monthlySalary || 0), 0);
    }

    function calculateTotalPaid() {
        const employees = getAllEmployees();
        return employees.reduce((sum, e) => sum + (e.totalPaid || 0), 0);
    }

    function getPayrollStatistics() {
        const allEmployees = getAllEmployees();
        const activeEmployees = getAllEmployees({ status: 'active' });
        const terminatedEmployees = getAllEmployees({ status: 'terminated' });
        
        const totalMonthlySalaries = calculateTotalMonthlySalaries('active');
        const totalPaid = calculateTotalPaid();
        
        // Department breakdown
        const departments = {};
        activeEmployees.forEach(emp => {
            if (!departments[emp.department]) {
                departments[emp.department] = {
                    count: 0,
                    totalSalary: 0
                };
            }
            departments[emp.department].count += 1;
            departments[emp.department].totalSalary += emp.monthlySalary;
        });
        
        return {
            totalEmployees: allEmployees.length,
            activeEmployees: activeEmployees.length,
            terminatedEmployees: terminatedEmployees.length,
            totalMonthlySalaries,
            totalPaid,
            departments: Object.entries(departments).map(([name, data]) => ({
                name,
                count: data.count,
                totalSalary: data.totalSalary
            }))
        };
    }

    // ==================== Payroll Report ====================
    function generatePayrollReport(month, year) {
        const employees = getAllEmployees({ status: 'active' });
        
        const report = {
            month,
            year,
            generatedAt: new Date().toISOString(),
            employees: employees.map(emp => ({
                id: emp.id,
                name: emp.name,
                position: emp.position,
                department: emp.department,
                salary: emp.monthlySalary,
                deductions: 0, // Can be extended for insurance, taxes, etc.
                netSalary: emp.monthlySalary
            })),
            summary: {
                totalEmployees: employees.length,
                totalGrossSalary: employees.reduce((sum, e) => sum + e.monthlySalary, 0),
                totalDeductions: 0,
                totalNetSalary: employees.reduce((sum, e) => sum + e.monthlySalary, 0)
            }
        };
        
        return report;
    }

    // ==================== Render Employees List ====================
    function renderEmployeesList(containerId = 'employees-list', filters = {}) {
        const employees = getAllEmployees(filters);
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        if (employees.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="bi bi-people text-6xl text-gray-300"></i>
                    <p class="mt-4 text-gray-500">لا يوجد موظفين</p>
                </div>
            `;
            return;
        }
        
        const html = employees.map(employee => `
            <tr>
                <td>${employee.name}</td>
                <td>${employee.position}</td>
                <td>${employee.department}</td>
                <td class="font-bold">${APP_EGYPT_CORE.formatCurrency(employee.monthlySalary)}</td>
                <td>${employee.monthsPaid || 0} شهر</td>
                <td>${APP_EGYPT_CORE.formatCurrency(employee.totalPaid || 0)}</td>
                <td>
                    ${employee.status === 'active' 
                        ? '<span class="badge badge-success">نشط</span>' 
                        : '<span class="badge badge-ghost">منتهي</span>'}
                </td>
                <td>
                    ${employee.status === 'active' 
                        ? `<button class="btn btn-sm btn-primary" onclick="APP_EGYPT_PAYROLL.paySalary('${employee.id}', ${employee.monthlySalary}, ${new Date().getMonth() + 1}, ${new Date().getFullYear()})">
                            <i class="bi bi-cash"></i> صرف راتب
                        </button>`
                        : '-'}
                </td>
            </tr>
        `).join('');
        
        container.innerHTML = html;
    }

    // ==================== Export to Excel ====================
    function exportPayrollToExcel(month, year) {
        const report = generatePayrollReport(month, year);
        
        if (typeof XLSX === 'undefined') {
            alert('مكتبة Excel غير محملة');
            return;
        }
        
        const data = report.employees.map(emp => ({
            'الاسم': emp.name,
            'الوظيفة': emp.position,
            'القسم': emp.department,
            'الراتب الأساسي': emp.salary,
            'الخصومات': emp.deductions,
            'الصافي': emp.netSalary
        }));
        
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `رواتب ${month}-${year}`);
        
        XLSX.writeFile(wb, `رواتب-${month}-${year}.xlsx`);
    }

    // ==================== Public API ====================
    return {
        initialize,
        REAL_EMPLOYEES_DATA,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        paySalary,
        getAllEmployees,
        getEmployeeById,
        calculateTotalMonthlySalaries,
        calculateTotalPaid,
        getPayrollStatistics,
        generatePayrollReport,
        renderEmployeesList,
        exportPayrollToExcel
    };
})();

// Log when loaded
if (typeof window !== 'undefined') {
    console.log('🇪🇬 نظام الرواتب المصري جاهز (4 موظفين)');
}
