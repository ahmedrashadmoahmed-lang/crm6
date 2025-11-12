// ==================== نظام المصروفات المصري ====================
const APP_EGYPT_EXPENSES = (function() {
    'use strict';

    // ==================== Expense Categories ====================
    const EXPENSE_CATEGORIES = {
        SALARIES: 'أجور ومرتبات',
        RENT: 'إيجار',
        COMMISSION: 'كوميشيون',
        UTILITIES: 'مرافق',
        TRANSPORTATION: 'مواصلات',
        MAINTENANCE: 'صيانة',
        SUPPLIES: 'مستلزمات',
        MARKETING: 'تسويق',
        INSURANCE: 'تأمينات',
        TAXES: 'ضرائب',
        COMMUNICATIONS: 'اتصالات',
        LEGAL: 'رسوم قانونية',
        OFFICE: 'مصروفات إدارية',
        OTHER: 'أخرى'
    };

    // ==================== Real Expenses Data 2025 ====================
    const REAL_EXPENSES_2025 = {
        totalAnnual: 339891,
        categories: [
            { category: 'SALARIES', name: 'أجور ومرتبات', amount: 85295, percentage: 25.1 },
            { category: 'RENT', name: 'إيجار', amount: 80500, percentage: 23.7 },
            { category: 'COMMISSION', name: 'كوميشيون', amount: 67216, percentage: 19.8 },
            { category: 'UTILITIES', name: 'مرافق', amount: 28000, percentage: 8.2 },
            { category: 'TRANSPORTATION', name: 'مواصلات', amount: 22500, percentage: 6.6 },
            { category: 'MAINTENANCE', name: 'صيانة', amount: 15800, percentage: 4.6 },
            { category: 'SUPPLIES', name: 'مستلزمات', amount: 12400, percentage: 3.6 },
            { category: 'MARKETING', name: 'تسويق', amount: 9500, percentage: 2.8 },
            { category: 'INSURANCE', name: 'تأمينات', amount: 6700, percentage: 2.0 },
            { category: 'COMMUNICATIONS', name: 'اتصالات', amount: 4500, percentage: 1.3 },
            { category: 'OFFICE', name: 'مصروفات إدارية', amount: 3800, percentage: 1.1 },
            { category: 'LEGAL', name: 'رسوم قانونية', amount: 2100, percentage: 0.6 },
            { category: 'OTHER', name: 'أخرى', amount: 1580, percentage: 0.5 }
        ]
    };

    // ==================== Initialize ====================
    function initialize() {
        console.log('💰 تهيئة نظام المصروفات المصري...');
        
        // Load existing expenses or create sample data
        let expenses = APP_EGYPT_CORE.getData('expenses');
        if (!expenses || expenses.length === 0) {
            console.log('📥 تحميل البيانات النموذجية للمصروفات');
            expenses = generateSampleExpenses();
            APP_EGYPT_CORE.saveData('expenses', expenses);
        }
        
        return {
            initialized: true,
            count: expenses.length,
            total: calculateTotalExpenses()
        };
    }

    // ==================== Generate Sample Expenses ====================
    function generateSampleExpenses() {
        const expenses = [];
        const year = 2025;
        
        // Create monthly expenses for each category
        REAL_EXPENSES_2025.categories.forEach(cat => {
            const monthlyAmount = cat.amount / 12;
            
            for (let month = 1; month <= 12; month++) {
                const date = new Date(year, month - 1, 15);
                
                expenses.push({
                    id: APP_EGYPT_CORE.generateId('EXP-'),
                    date: date.toISOString().split('T')[0],
                    category: cat.category,
                    categoryName: cat.name,
                    amount: Number(monthlyAmount.toFixed(2)),
                    description: `${cat.name} - شهر ${month}/${year}`,
                    paymentMethod: month % 2 === 0 ? 'bank' : 'cash',
                    status: month < new Date().getMonth() + 1 ? 'paid' : 'pending',
                    reference: `REF-${year}-${month}-${cat.category}`,
                    notes: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }
        });
        
        return expenses;
    }

    // ==================== Create Expense ====================
    function createExpense(data) {
        const expenses = APP_EGYPT_CORE.getData('expenses');
        
        const expense = {
            id: APP_EGYPT_CORE.generateId('EXP-'),
            date: data.date || new Date().toISOString().split('T')[0],
            category: data.category,
            categoryName: EXPENSE_CATEGORIES[data.category] || data.category,
            amount: Number(data.amount),
            description: data.description || '',
            paymentMethod: data.paymentMethod || 'cash',
            status: data.status || 'pending',
            reference: data.reference || '',
            notes: data.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        expenses.push(expense);
        APP_EGYPT_CORE.saveData('expenses', expenses);
        
        return expense;
    }

    // ==================== Update Expense ====================
    function updateExpense(id, updates) {
        const expenses = APP_EGYPT_CORE.getData('expenses');
        const index = expenses.findIndex(e => e.id === id);
        
        if (index === -1) {
            return { success: false, message: 'المصروف غير موجود' };
        }
        
        expenses[index] = {
            ...expenses[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        APP_EGYPT_CORE.saveData('expenses', expenses);
        
        return { success: true, expense: expenses[index] };
    }

    // ==================== Delete Expense ====================
    function deleteExpense(id) {
        const expenses = APP_EGYPT_CORE.getData('expenses');
        const index = expenses.findIndex(e => e.id === id);
        
        if (index === -1) {
            return { success: false, message: 'المصروف غير موجود' };
        }
        
        expenses.splice(index, 1);
        APP_EGYPT_CORE.saveData('expenses', expenses);
        
        return { success: true, message: 'تم حذف المصروف' };
    }

    // ==================== Get Expenses ====================
    function getAllExpenses(filters = {}) {
        let expenses = APP_EGYPT_CORE.getData('expenses');
        
        // Apply filters
        if (filters.category) {
            expenses = expenses.filter(e => e.category === filters.category);
        }
        
        if (filters.status) {
            expenses = expenses.filter(e => e.status === filters.status);
        }
        
        if (filters.dateFrom) {
            expenses = expenses.filter(e => e.date >= filters.dateFrom);
        }
        
        if (filters.dateTo) {
            expenses = expenses.filter(e => e.date <= filters.dateTo);
        }
        
        if (filters.year) {
            expenses = expenses.filter(e => {
                const expYear = new Date(e.date).getFullYear();
                return expYear === filters.year;
            });
        }
        
        if (filters.month) {
            expenses = expenses.filter(e => {
                const expMonth = new Date(e.date).getMonth() + 1;
                return expMonth === filters.month;
            });
        }
        
        // Sort by date descending
        expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return expenses;
    }

    function getExpenseById(id) {
        const expenses = APP_EGYPT_CORE.getData('expenses');
        return expenses.find(e => e.id === id);
    }

    // ==================== Statistics ====================
    function calculateTotalExpenses(filters = {}) {
        const expenses = getAllExpenses(filters);
        return expenses.reduce((sum, e) => sum + e.amount, 0);
    }

    function getExpensesByCategory(year = new Date().getFullYear()) {
        const expenses = getAllExpenses({ year });
        
        const categoryTotals = {};
        
        expenses.forEach(exp => {
            if (!categoryTotals[exp.category]) {
                categoryTotals[exp.category] = {
                    category: exp.category,
                    name: exp.categoryName,
                    total: 0,
                    count: 0
                };
            }
            
            categoryTotals[exp.category].total += exp.amount;
            categoryTotals[exp.category].count += 1;
        });
        
        return Object.values(categoryTotals).sort((a, b) => b.total - a.total);
    }

    function getMonthlyExpenses(year = new Date().getFullYear()) {
        const monthlyData = Array(12).fill(0);
        const expenses = getAllExpenses({ year });
        
        expenses.forEach(exp => {
            const month = new Date(exp.date).getMonth();
            monthlyData[month] += exp.amount;
        });
        
        return monthlyData;
    }

    function getExpenseStatistics(year = new Date().getFullYear()) {
        const expenses = getAllExpenses({ year });
        const totalExpenses = calculateTotalExpenses({ year });
        const paidExpenses = expenses.filter(e => e.status === 'paid');
        const pendingExpenses = expenses.filter(e => e.status === 'pending');
        
        return {
            year,
            totalExpenses,
            totalCount: expenses.length,
            paidAmount: paidExpenses.reduce((sum, e) => sum + e.amount, 0),
            paidCount: paidExpenses.length,
            pendingAmount: pendingExpenses.reduce((sum, e) => sum + e.amount, 0),
            pendingCount: pendingExpenses.length,
            byCategory: getExpensesByCategory(year),
            monthly: getMonthlyExpenses(year)
        };
    }

    // ==================== Render Expenses List ====================
    function renderExpensesList(containerId = 'expenses-list', filters = {}) {
        const expenses = getAllExpenses(filters);
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        if (expenses.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="bi bi-cash-coin text-6xl text-gray-300"></i>
                    <p class="mt-4 text-gray-500">لا توجد مصروفات</p>
                </div>
            `;
            return;
        }
        
        const html = expenses.map(expense => `
            <tr>
                <td>${APP_EGYPT_CORE.formatDate(expense.date, 'short')}</td>
                <td>${expense.categoryName}</td>
                <td>${expense.description}</td>
                <td class="font-bold text-error">${APP_EGYPT_CORE.formatCurrency(expense.amount)}</td>
                <td>
                    ${expense.paymentMethod === 'cash' 
                        ? '<span class="badge badge-info">نقدي</span>' 
                        : '<span class="badge badge-primary">بنك</span>'}
                </td>
                <td>
                    ${expense.status === 'paid' 
                        ? '<span class="badge badge-success">مدفوع</span>' 
                        : '<span class="badge badge-warning">معلق</span>'}
                </td>
                <td>
                    <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_EXPENSES.editExpense('${expense.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_EXPENSES.deleteExpense('${expense.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        container.innerHTML = html;
    }

    // ==================== Export to Excel ====================
    function exportToExcel(year = new Date().getFullYear()) {
        const expenses = getAllExpenses({ year });
        
        if (typeof XLSX === 'undefined') {
            alert('مكتبة Excel غير محملة');
            return;
        }
        
        const data = expenses.map(exp => ({
            'التاريخ': exp.date,
            'الفئة': exp.categoryName,
            'الوصف': exp.description,
            'المبلغ': exp.amount,
            'طريقة الدفع': exp.paymentMethod === 'cash' ? 'نقدي' : 'بنك',
            'الحالة': exp.status === 'paid' ? 'مدفوع' : 'معلق',
            'المرجع': exp.reference
        }));
        
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `مصروفات ${year}`);
        
        XLSX.writeFile(wb, `مصروفات-${year}.xlsx`);
    }

    // ==================== Public API ====================
    return {
        initialize,
        EXPENSE_CATEGORIES,
        REAL_EXPENSES_2025,
        createExpense,
        updateExpense,
        deleteExpense,
        getAllExpenses,
        getExpenseById,
        calculateTotalExpenses,
        getExpensesByCategory,
        getMonthlyExpenses,
        getExpenseStatistics,
        renderExpensesList,
        exportToExcel
    };
})();

// Log when loaded
if (typeof window !== 'undefined') {
    console.log('🇪🇬 نظام المصروفات المصري جاهز (339,891 ج.م سنوياً)');
}
