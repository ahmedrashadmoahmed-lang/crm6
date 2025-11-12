// ==================== نظام الخزينة والعهد المصري ====================
const APP_EGYPT_CASHBOX = (function() {
    'use strict';

    // ==================== Real Cashbox Data ====================
    const REAL_CASHBOX_DATA = {
        main: {
            name: 'خزنة منة',
            balance: -3210.5,
            deposits: 833891.5,
            withdrawals: 837102
        },
        custody: {
            november: {
                doa: 1395,
                hossam: 82,
                total: -15803
            }
        }
    };

    // ==================== Initialize ====================
    function initialize() {
        console.log('💵 تهيئة نظام الخزينة والعهد المصري...');
        
        // Load existing cashbox data or create sample data
        let cashbox = APP_EGYPT_CORE.getData('cashbox');
        if (!cashbox || cashbox.length === 0) {
            console.log('📥 تحميل البيانات النموذجية للخزينة');
            cashbox = generateSampleCashboxData();
            APP_EGYPT_CORE.saveData('cashbox', cashbox);
        }
        
        // Load custody data
        let custody = APP_EGYPT_CORE.getData('custody');
        if (!custody || custody.length === 0) {
            console.log('📥 تحميل البيانات النموذجية للعهد');
            custody = generateSampleCustodyData();
            APP_EGYPT_CORE.saveData('custody', custody);
        }
        
        return {
            initialized: true,
            cashboxBalance: calculateCashboxBalance(),
            custodyBalance: calculateTotalCustody()
        };
    }

    // ==================== Generate Sample Cashbox Data ====================
    function generateSampleCashboxData() {
        const transactions = [];
        const year = 2025;
        
        // Create realistic transactions for "خزنة منة"
        // Starting with deposits
        const depositDates = [
            { month: 1, day: 5, amount: 150000, desc: 'إيداع من المبيعات' },
            { month: 1, day: 15, amount: 85000, desc: 'تحصيل من عملاء' },
            { month: 2, day: 3, amount: 120000, desc: 'إيداع من المبيعات' },
            { month: 2, day: 20, amount: 95000, desc: 'تحصيل من عملاء' },
            { month: 3, day: 10, amount: 110000, desc: 'إيداع من المبيعات' },
            { month: 3, day: 25, amount: 78000, desc: 'تحصيل من عملاء' },
            { month: 4, day: 5, amount: 98891.5, desc: 'إيداع من المبيعات' },
            { month: 4, day: 18, amount: 97000, desc: 'تحصيل من عملاء' }
        ];
        
        depositDates.forEach((dep, index) => {
            const date = new Date(year, dep.month - 1, dep.day);
            transactions.push({
                id: APP_EGYPT_CORE.generateId('CB-D-'),
                date: date.toISOString().split('T')[0],
                type: 'deposit',
                amount: dep.amount,
                description: dep.desc,
                cashbox: 'خزنة منة',
                reference: `DEP-${year}-${String(index + 1).padStart(4, '0')}`,
                createdBy: 'منة',
                createdAt: date.toISOString(),
                updatedAt: date.toISOString()
            });
        });
        
        // Create withdrawals
        const withdrawalDates = [
            { month: 1, day: 8, amount: 120000, desc: 'دفع للموردين' },
            { month: 1, day: 20, amount: 95000, desc: 'مصروفات تشغيلية' },
            { month: 2, day: 5, amount: 110000, desc: 'دفع رواتب' },
            { month: 2, day: 22, amount: 88000, desc: 'دفع للموردين' },
            { month: 3, day: 12, amount: 125000, desc: 'مصروفات تشغيلية' },
            { month: 3, day: 28, amount: 102000, desc: 'دفع رواتب' },
            { month: 4, day: 7, amount: 98102, desc: 'دفع للموردين' },
            { month: 4, day: 21, amount: 99000, desc: 'مصروفات تشغيلية' }
        ];
        
        withdrawalDates.forEach((wit, index) => {
            const date = new Date(year, wit.month - 1, wit.day);
            transactions.push({
                id: APP_EGYPT_CORE.generateId('CB-W-'),
                date: date.toISOString().split('T')[0],
                type: 'withdrawal',
                amount: wit.amount,
                description: wit.desc,
                cashbox: 'خزنة منة',
                reference: `WIT-${year}-${String(index + 1).padStart(4, '0')}`,
                createdBy: 'منة',
                createdAt: date.toISOString(),
                updatedAt: date.toISOString()
            });
        });
        
        return transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // ==================== Generate Sample Custody Data ====================
    function generateSampleCustodyData() {
        const custody = [];
        const year = 2025;
        const month = 11; // November
        
        // Custody for دعاء
        custody.push({
            id: APP_EGYPT_CORE.generateId('CUS-'),
            employeeName: 'دعاء',
            amount: 1395,
            date: new Date(year, month - 1, 1).toISOString().split('T')[0],
            purpose: 'عهدة نثريات',
            status: 'active',
            notes: 'عهدة نوفمبر',
            createdAt: new Date(year, month - 1, 1).toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        // Custody for حسام
        custody.push({
            id: APP_EGYPT_CORE.generateId('CUS-'),
            employeeName: 'حسام',
            amount: 82,
            date: new Date(year, month - 1, 1).toISOString().split('T')[0],
            purpose: 'عهدة نثريات',
            status: 'active',
            notes: 'عهدة نوفمبر',
            createdAt: new Date(year, month - 1, 1).toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        return custody;
    }

    // ==================== Create Cashbox Transaction ====================
    function createTransaction(data) {
        const transactions = APP_EGYPT_CORE.getData('cashbox');
        
        const transaction = {
            id: APP_EGYPT_CORE.generateId(data.type === 'deposit' ? 'CB-D-' : 'CB-W-'),
            date: data.date || new Date().toISOString().split('T')[0],
            type: data.type, // deposit or withdrawal
            amount: Number(data.amount),
            description: data.description || '',
            cashbox: data.cashbox || 'خزنة منة',
            reference: data.reference || '',
            createdBy: data.createdBy || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        transactions.push(transaction);
        APP_EGYPT_CORE.saveData('cashbox', transactions);
        
        return transaction;
    }

    // ==================== Create Custody ====================
    function createCustody(data) {
        const custodyList = APP_EGYPT_CORE.getData('custody');
        
        const custody = {
            id: APP_EGYPT_CORE.generateId('CUS-'),
            employeeName: data.employeeName,
            amount: Number(data.amount),
            date: data.date || new Date().toISOString().split('T')[0],
            purpose: data.purpose || '',
            status: 'active',
            notes: data.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        custodyList.push(custody);
        APP_EGYPT_CORE.saveData('custody', custodyList);
        
        return custody;
    }

    // ==================== Settle Custody ====================
    function settleCustody(id, settlementAmount) {
        const custodyList = APP_EGYPT_CORE.getData('custody');
        const index = custodyList.findIndex(c => c.id === id);
        
        if (index === -1) {
            return { success: false, message: 'العهدة غير موجودة' };
        }
        
        custodyList[index].status = 'settled';
        custodyList[index].settlementAmount = settlementAmount;
        custodyList[index].settlementDate = new Date().toISOString().split('T')[0];
        custodyList[index].updatedAt = new Date().toISOString();
        
        APP_EGYPT_CORE.saveData('custody', custodyList);
        
        return { success: true, custody: custodyList[index] };
    }

    // ==================== Get Transactions ====================
    function getAllTransactions(filters = {}) {
        let transactions = APP_EGYPT_CORE.getData('cashbox');
        
        if (filters.type) {
            transactions = transactions.filter(t => t.type === filters.type);
        }
        
        if (filters.cashbox) {
            transactions = transactions.filter(t => t.cashbox === filters.cashbox);
        }
        
        if (filters.dateFrom) {
            transactions = transactions.filter(t => t.date >= filters.dateFrom);
        }
        
        if (filters.dateTo) {
            transactions = transactions.filter(t => t.date <= filters.dateTo);
        }
        
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return transactions;
    }

    function getAllCustody(filters = {}) {
        let custody = APP_EGYPT_CORE.getData('custody');
        
        if (filters.status) {
            custody = custody.filter(c => c.status === filters.status);
        }
        
        if (filters.employeeName) {
            custody = custody.filter(c => c.employeeName === filters.employeeName);
        }
        
        custody.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return custody;
    }

    // ==================== Calculate Balances ====================
    function calculateCashboxBalance(cashbox = null) {
        const transactions = getAllTransactions(cashbox ? { cashbox } : {});
        
        let balance = 0;
        transactions.forEach(t => {
            if (t.type === 'deposit') {
                balance += t.amount;
            } else {
                balance -= t.amount;
            }
        });
        
        return Number(balance.toFixed(2));
    }

    function calculateTotalCustody(status = 'active') {
        const custody = getAllCustody({ status });
        return custody.reduce((sum, c) => sum + c.amount, 0);
    }

    function getCashboxStatistics() {
        const transactions = getAllTransactions();
        const deposits = transactions.filter(t => t.type === 'deposit');
        const withdrawals = transactions.filter(t => t.type === 'withdrawal');
        
        const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
        const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);
        const balance = totalDeposits - totalWithdrawals;
        
        const activeCustody = calculateTotalCustody('active');
        const settledCustody = calculateTotalCustody('settled');
        
        return {
            balance: Number(balance.toFixed(2)),
            totalDeposits: Number(totalDeposits.toFixed(2)),
            totalWithdrawals: Number(totalWithdrawals.toFixed(2)),
            depositCount: deposits.length,
            withdrawalCount: withdrawals.length,
            custody: {
                active: Number(activeCustody.toFixed(2)),
                settled: Number(settledCustody.toFixed(2)),
                total: Number((activeCustody + settledCustody).toFixed(2))
            }
        };
    }

    // ==================== Render Cashbox Transactions ====================
    function renderTransactionsList(containerId = 'cashbox-list', filters = {}) {
        const transactions = getAllTransactions(filters);
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="bi bi-wallet2 text-6xl text-gray-300"></i>
                    <p class="mt-4 text-gray-500">لا توجد معاملات</p>
                </div>
            `;
            return;
        }
        
        let runningBalance = 0;
        const html = transactions.map(transaction => {
            if (transaction.type === 'deposit') {
                runningBalance += transaction.amount;
            } else {
                runningBalance -= transaction.amount;
            }
            
            return `
                <tr>
                    <td>${APP_EGYPT_CORE.formatDate(transaction.date, 'short')}</td>
                    <td>
                        ${transaction.type === 'deposit' 
                            ? '<span class="badge badge-success">إيداع</span>' 
                            : '<span class="badge badge-error">سحب</span>'}
                    </td>
                    <td>${transaction.description}</td>
                    <td class="${transaction.type === 'deposit' ? 'text-success' : 'text-error'} font-bold">
                        ${transaction.type === 'deposit' ? '+' : '-'}${APP_EGYPT_CORE.formatCurrency(transaction.amount)}
                    </td>
                    <td class="font-bold">${APP_EGYPT_CORE.formatCurrency(runningBalance)}</td>
                    <td>${transaction.reference || '-'}</td>
                </tr>
            `;
        }).reverse().join('');
        
        container.innerHTML = html;
    }

    // ==================== Public API ====================
    return {
        initialize,
        REAL_CASHBOX_DATA,
        createTransaction,
        createCustody,
        settleCustody,
        getAllTransactions,
        getAllCustody,
        calculateCashboxBalance,
        calculateTotalCustody,
        getCashboxStatistics,
        renderTransactionsList
    };
})();

// Log when loaded
if (typeof window !== 'undefined') {
    console.log('🇪🇬 نظام الخزينة والعهد المصري جاهز');
}
