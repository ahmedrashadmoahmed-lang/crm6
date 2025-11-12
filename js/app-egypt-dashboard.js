// ==================== لوحة التحكم المصرية ====================
const APP_EGYPT_DASHBOARD = (function() {
    'use strict';

    let charts = {};

    // ==================== Initialize Dashboard ====================
    function initialize() {
        console.log('📊 تهيئة لوحة التحكم المصرية...');
        
        // Initialize all Egyptian modules
        if (window.APP_EGYPT_CORE) APP_EGYPT_CORE.initialize();
        if (window.APP_EGYPT_SALES) APP_EGYPT_SALES.initialize();
        if (window.APP_EGYPT_PURCHASES) APP_EGYPT_PURCHASES.initialize();
        if (window.APP_EGYPT_CUSTOMERS) APP_EGYPT_CUSTOMERS.initialize();
        if (window.APP_EGYPT_SUPPLIERS) APP_EGYPT_SUPPLIERS.initialize();
        if (window.APP_EGYPT_EXPENSES) APP_EGYPT_EXPENSES.initialize();
        if (window.APP_EGYPT_GUARANTEES) APP_EGYPT_GUARANTEES.initialize();
        if (window.APP_EGYPT_CASHBOX) APP_EGYPT_CASHBOX.initialize();
        if (window.APP_EGYPT_PAYROLL) APP_EGYPT_PAYROLL.initialize();
        
        return {
            initialized: true,
            message: 'تم تهيئة لوحة التحكم بنجاح'
        };
    }

    // ==================== Get Dashboard KPIs ====================
    function getDashboardKPIs(year = 2025) {
        const stats = APP_EGYPT_CORE.calculateStatistics();
        const incomeStatement = window.APP_EGYPT_REPORTS?.generateIncomeStatement(year);
        const cashbox = window.APP_EGYPT_CASHBOX?.getCashboxStatistics();
        const guarantees = window.APP_EGYPT_GUARANTEES?.getGuaranteeStatistics();
        const payroll = window.APP_EGYPT_PAYROLL?.getPayrollStatistics();
        
        return {
            sales: {
                total: stats.sales.total,
                count: stats.sales.count,
                vat: stats.sales.vat,
                incomeTax: stats.sales.incomeTax
            },
            purchases: {
                total: stats.purchases.total,
                count: stats.purchases.count,
                vat: stats.purchases.vat
            },
            profit: {
                gross: incomeStatement?.grossProfit || stats.profit.gross,
                net: incomeStatement?.netProfit || stats.profit.net,
                grossMargin: incomeStatement?.grossProfitMargin || 0,
                netMargin: incomeStatement?.netProfitMargin || 0
            },
            expenses: {
                total: stats.expenses.total,
                count: stats.expenses.count
            },
            customers: {
                count: stats.customers.count,
                receivables: stats.customers.receivables
            },
            suppliers: {
                count: stats.suppliers.count,
                payables: stats.suppliers.payables
            },
            cashbox: {
                balance: cashbox?.balance || 0,
                deposits: cashbox?.totalDeposits || 0,
                withdrawals: cashbox?.totalWithdrawals || 0
            },
            guarantees: {
                total: guarantees?.total.amount || 0,
                active: guarantees?.active.amount || 0,
                returned: guarantees?.returned.amount || 0,
                expiringSoon: guarantees?.expiringSoon.count || 0
            },
            payroll: {
                employees: payroll?.activeEmployees || 0,
                monthlySalaries: payroll?.totalMonthlySalaries || 0
            }
        };
    }

    // ==================== Render Dashboard ====================
    function renderDashboard(containerId = 'dashboard-content') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        const kpis = getDashboardKPIs();
        
        const html = `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold">🇪🇬 لوحة التحكم المصرية</h1>
                        <p class="text-gray-600 mt-1">نظام محاسبي متكامل - CRM6</p>
                    </div>
                    <div class="text-left">
                        <p class="text-sm text-gray-500">التاريخ</p>
                        <p class="font-bold">${APP_EGYPT_CORE.formatDate(new Date())}</p>
                    </div>
                </div>

                <!-- KPI Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Sales Card -->
                    <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl">
                        <div class="card-body">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm opacity-90">إجمالي المبيعات</p>
                                    <p class="text-2xl font-bold">${APP_EGYPT_CORE.formatCurrency(kpis.sales.total, false)}</p>
                                    <p class="text-xs opacity-75">${kpis.sales.count} فاتورة</p>
                                </div>
                                <i class="bi bi-cart-check text-4xl opacity-30"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Purchases Card -->
                    <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
                        <div class="card-body">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm opacity-90">إجمالي المشتريات</p>
                                    <p class="text-2xl font-bold">${APP_EGYPT_CORE.formatCurrency(kpis.purchases.total, false)}</p>
                                    <p class="text-xs opacity-75">${kpis.purchases.count} فاتورة</p>
                                </div>
                                <i class="bi bi-bag text-4xl opacity-30"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Profit Card -->
                    <div class="card bg-gradient-to-br ${kpis.profit.net >= 0 ? 'from-purple-500 to-purple-600' : 'from-red-500 to-red-600'} text-white shadow-xl">
                        <div class="card-body">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm opacity-90">${kpis.profit.net >= 0 ? 'صافي الربح' : 'صافي الخسارة'}</p>
                                    <p class="text-2xl font-bold">${APP_EGYPT_CORE.formatCurrency(Math.abs(kpis.profit.net), false)}</p>
                                    <p class="text-xs opacity-75">هامش ${kpis.profit.netMargin}%</p>
                                </div>
                                <i class="bi bi-graph-${kpis.profit.net >= 0 ? 'up' : 'down'}-arrow text-4xl opacity-30"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Expenses Card -->
                    <div class="card bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
                        <div class="card-body">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm opacity-90">إجمالي المصروفات</p>
                                    <p class="text-2xl font-bold">${APP_EGYPT_CORE.formatCurrency(kpis.expenses.total, false)}</p>
                                    <p class="text-xs opacity-75">${kpis.expenses.count} مصروف</p>
                                </div>
                                <i class="bi bi-cash-coin text-4xl opacity-30"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Secondary KPIs -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Customers -->
                    <div class="card bg-white dark:bg-gray-800 shadow-lg">
                        <div class="card-body">
                            <h3 class="card-title text-lg">العملاء</h3>
                            <div class="flex justify-between items-center mt-2">
                                <div>
                                    <p class="text-sm text-gray-600">عدد العملاء</p>
                                    <p class="text-2xl font-bold text-primary">${kpis.customers.count}</p>
                                </div>
                                <div class="text-left">
                                    <p class="text-sm text-gray-600">المبالغ المستحقة</p>
                                    <p class="text-xl font-bold text-error">${APP_EGYPT_CORE.formatCurrency(kpis.customers.receivables, false)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Suppliers -->
                    <div class="card bg-white dark:bg-gray-800 shadow-lg">
                        <div class="card-body">
                            <h3 class="card-title text-lg">الموردين</h3>
                            <div class="flex justify-between items-center mt-2">
                                <div>
                                    <p class="text-sm text-gray-600">عدد الموردين</p>
                                    <p class="text-2xl font-bold text-primary">${kpis.suppliers.count}</p>
                                </div>
                                <div class="text-left">
                                    <p class="text-sm text-gray-600">المبالغ المستحقة</p>
                                    <p class="text-xl font-bold text-error">${APP_EGYPT_CORE.formatCurrency(kpis.suppliers.payables, false)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Cashbox -->
                    <div class="card bg-white dark:bg-gray-800 shadow-lg">
                        <div class="card-body">
                            <h3 class="card-title text-lg">الخزينة</h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-600">الرصيد الحالي</p>
                                <p class="text-2xl font-bold ${kpis.cashbox.balance >= 0 ? 'text-success' : 'text-error'}">
                                    ${APP_EGYPT_CORE.formatCurrency(kpis.cashbox.balance, false)}
                                </p>
                                <div class="flex justify-between mt-2 text-sm">
                                    <span class="text-success">إيداعات: ${APP_EGYPT_CORE.formatCurrency(kpis.cashbox.deposits, false)}</span>
                                    <span class="text-error">سحوبات: ${APP_EGYPT_CORE.formatCurrency(kpis.cashbox.withdrawals, false)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Sales vs Purchases Chart -->
                    <div class="card bg-white dark:bg-gray-800 shadow-xl">
                        <div class="card-body">
                            <h3 class="card-title">المبيعات مقابل المشتريات (شهري)</h3>
                            <canvas id="sales-purchases-chart" height="300"></canvas>
                        </div>
                    </div>

                    <!-- Expenses by Category Chart -->
                    <div class="card bg-white dark:bg-gray-800 shadow-xl">
                        <div class="card-body">
                            <h3 class="card-title">المصروفات حسب الفئة</h3>
                            <canvas id="expenses-chart" height="300"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Alerts & Notifications -->
                <div class="card bg-white dark:bg-gray-800 shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title mb-4">التنبيهات والإشعارات</h3>
                        <div class="space-y-2" id="dashboard-alerts">
                            ${generateAlerts(kpis)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Render charts after DOM update
        setTimeout(() => {
            renderSalesPurchasesChart();
            renderExpensesChart();
        }, 100);
    }

    // ==================== Generate Alerts ====================
    function generateAlerts(kpis) {
        const alerts = [];
        
        // Loss alert
        if (kpis.profit.net < 0) {
            alerts.push(`
                <div class="alert alert-error">
                    <i class="bi bi-exclamation-triangle"></i>
                    <span>تحذير: الشركة تحقق خسارة صافية قدرها ${APP_EGYPT_CORE.formatCurrency(Math.abs(kpis.profit.net))}</span>
                </div>
            `);
        }
        
        // Cashbox alert
        if (kpis.cashbox.balance < 0) {
            alerts.push(`
                <div class="alert alert-warning">
                    <i class="bi bi-wallet"></i>
                    <span>تنبيه: رصيد الخزينة سالب ${APP_EGYPT_CORE.formatCurrency(Math.abs(kpis.cashbox.balance))}</span>
                </div>
            `);
        }
        
        // Guarantees expiring soon
        if (kpis.guarantees.expiringSoon > 0) {
            alerts.push(`
                <div class="alert alert-info">
                    <i class="bi bi-shield-check"></i>
                    <span>يوجد ${kpis.guarantees.expiringSoon} خطاب ضمان قريب الانتهاء</span>
                </div>
            `);
        }
        
        // High receivables
        if (kpis.customers.receivables > 50000) {
            alerts.push(`
                <div class="alert alert-warning">
                    <i class="bi bi-people"></i>
                    <span>تنبيه: مبالغ مستحقة من العملاء ${APP_EGYPT_CORE.formatCurrency(kpis.customers.receivables)}</span>
                </div>
            `);
        }
        
        if (alerts.length === 0) {
            alerts.push(`
                <div class="alert alert-success">
                    <i class="bi bi-check-circle"></i>
                    <span>لا توجد تنبيهات حالياً - كل شيء على ما يرام! ✨</span>
                </div>
            `);
        }
        
        return alerts.join('');
    }

    // ==================== Render Sales vs Purchases Chart ====================
    function renderSalesPurchasesChart() {
        const canvas = document.getElementById('sales-purchases-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Get monthly data
        const salesMonthly = window.APP_EGYPT_SALES?.calculateSalesStatistics(2025);
        const purchasesMonthly = window.APP_EGYPT_PURCHASES?.calculatePurchasesStatistics(2025);
        
        // Sample monthly data (would need to be calculated from actual data)
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const salesData = [120000, 95000, 110000, 98891.5, 105000, 89000, 115000, 102000, 125000, 108000, 93000, 87000];
        const purchasesData = [110000, 88000, 105000, 95000, 98000, 82000, 108000, 95000, 118000, 101000, 87000, 80000];
        
        if (charts.salesPurchases) {
            charts.salesPurchases.destroy();
        }
        
        charts.salesPurchases = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'المبيعات',
                        data: salesData,
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'المشتريات',
                        data: purchasesData,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return APP_EGYPT_CORE.formatCurrency(value, false);
                            }
                        }
                    }
                }
            }
        });
    }

    // ==================== Render Expenses Chart ====================
    function renderExpensesChart() {
        const canvas = document.getElementById('expenses-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        const expensesByCategory = window.APP_EGYPT_EXPENSES?.getExpensesByCategory(2025) || [];
        
        if (charts.expenses) {
            charts.expenses.destroy();
        }
        
        charts.expenses = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: expensesByCategory.map(c => c.name),
                datasets: [{
                    data: expensesByCategory.map(c => c.total),
                    backgroundColor: [
                        'rgb(239, 68, 68)',
                        'rgb(249, 115, 22)',
                        'rgb(234, 179, 8)',
                        'rgb(34, 197, 94)',
                        'rgb(59, 130, 246)',
                        'rgb(147, 51, 234)',
                        'rgb(236, 72, 153)',
                        'rgb(20, 184, 166)',
                        'rgb(251, 146, 60)',
                        'rgb(168, 85, 247)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + APP_EGYPT_CORE.formatCurrency(context.parsed);
                            }
                        }
                    }
                }
            }
        });
    }

    // ==================== Public API ====================
    return {
        initialize,
        getDashboardKPIs,
        renderDashboard,
        renderSalesPurchasesChart,
        renderExpensesChart
    };
})();

// Log when loaded
if (typeof window !== 'undefined') {
    console.log('🇪🇬 لوحة التحكم المصرية جاهزة');
}
