// ==================== نظام التقارير المالية المتقدمة 🇪🇬 ====================
console.log('📊 تحميل نظام التقارير المالية...');

const APP_REPORTS = (function() {
    'use strict';

    // ==================== عرض صفحة التقارير الرئيسية ====================
    function renderReportsPage() {
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 class="text-3xl font-bold flex items-center gap-3">
                            <i class="bi bi-graph-up text-primary"></i>
                            التقارير المالية
                        </h2>
                        <p class="text-gray-600 dark:text-gray-400 mt-1">
                            تقارير شاملة ومفصلة عن أداء الأعمال
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-success" onclick="APP_REPORTS.exportAllToExcel()">
                            <i class="bi bi-file-earmark-excel"></i>
                            تصدير Excel
                        </button>
                        <button class="btn btn-primary" onclick="window.print()">
                            <i class="bi bi-printer"></i>
                            طباعة
                        </button>
                    </div>
                </div>

                <!-- Quick Stats -->
                ${renderQuickStats()}

                <!-- Report Tabs -->
                <div class="card bg-white dark:bg-gray-800 shadow-lg">
                    <div class="card-body">
                        <div role="tablist" class="tabs tabs-boxed mb-6">
                            <a role="tab" class="tab tab-active" onclick="APP_REPORTS.switchTab('sales')">
                                <i class="bi bi-cart-check ml-2"></i>
                                تقرير المبيعات
                            </a>
                            <a role="tab" class="tab" onclick="APP_REPORTS.switchTab('profit')">
                                <i class="bi bi-cash-coin ml-2"></i>
                                الأرباح والخسائر
                            </a>
                            <a role="tab" class="tab" onclick="APP_REPORTS.switchTab('customers')">
                                <i class="bi bi-people ml-2"></i>
                                تقرير العملاء
                            </a>
                            <a role="tab" class="tab" onclick="APP_REPORTS.switchTab('products')">
                                <i class="bi bi-box-seam ml-2"></i>
                                تقرير المنتجات
                            </a>
                        </div>

                        <div id="report-content">
                            ${renderSalesReport()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== الإحصائيات السريعة ====================
    function renderQuickStats() {
        const stats = calculateComprehensiveStats();

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- إجمالي المبيعات -->
                <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div class="card-body">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <p class="text-sm opacity-90 mb-1">إجمالي المبيعات</p>
                                <p class="text-3xl font-bold">${formatMoney(stats.totalSales)}</p>
                                <p class="text-xs opacity-75 mt-1">
                                    <i class="bi bi-arrow-up"></i>
                                    +${stats.salesGrowth}% عن الشهر الماضي
                                </p>
                            </div>
                            <div class="text-5xl opacity-20">
                                <i class="bi bi-cart-check"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- صافي الربح -->
                <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div class="card-body">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <p class="text-sm opacity-90 mb-1">صافي الربح</p>
                                <p class="text-3xl font-bold">${formatMoney(stats.netProfit)}</p>
                                <p class="text-xs opacity-75 mt-1">
                                    هامش ${stats.profitMargin.toFixed(1)}%
                                </p>
                            </div>
                            <div class="text-5xl opacity-20">
                                <i class="bi bi-cash-coin"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- عدد الفواتير -->
                <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div class="card-body">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <p class="text-sm opacity-90 mb-1">عدد الفواتير</p>
                                <p class="text-3xl font-bold">${stats.invoiceCount}</p>
                                <p class="text-xs opacity-75 mt-1">
                                    متوسط ${formatMoney(stats.averageInvoice)} للفاتورة
                                </p>
                            </div>
                            <div class="text-5xl opacity-20">
                                <i class="bi bi-receipt"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- العملاء النشطين -->
                <div class="card bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div class="card-body">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <p class="text-sm opacity-90 mb-1">العملاء النشطين</p>
                                <p class="text-3xl font-bold">${stats.activeCustomers}</p>
                                <p class="text-xs opacity-75 mt-1">
                                    من إجمالي ${stats.totalCustomers} عميل
                                </p>
                            </div>
                            <div class="text-5xl opacity-20">
                                <i class="bi bi-people"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== تقرير المبيعات ====================
    function renderSalesReport() {
        const invoices = APP_CORE.getData('invoices') || [];
        const quotations = APP_CORE.getData('quotations') || [];
        
        // تجميع المبيعات حسب الشهر
        const salesByMonth = groupSalesByMonth(invoices);
        
        return `
            <div class="space-y-6">
                <!-- فلاتر التاريخ -->
                <div class="flex flex-wrap gap-4 items-end">
                    <div class="form-control">
                        <label class="label"><span class="label-text">من تاريخ</span></label>
                        <input type="date" class="input input-bordered" id="sales-date-from" onchange="APP_REPORTS.filterSalesReport()" />
                    </div>
                    <div class="form-control">
                        <label class="label"><span class="label-text">إلى تاريخ</span></label>
                        <input type="date" class="input input-bordered" id="sales-date-to" onchange="APP_REPORTS.filterSalesReport()" />
                    </div>
                    <button class="btn btn-primary" onclick="APP_REPORTS.resetSalesFilter()">
                        <i class="bi bi-arrow-clockwise"></i>
                        إعادة تعيين
                    </button>
                </div>

                <!-- رسم بياني للمبيعات -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">
                            <i class="bi bi-bar-chart-line text-primary"></i>
                            المبيعات الشهرية
                        </h3>
                        <canvas id="salesMonthlyChart" style="height: 300px;"></canvas>
                    </div>
                </div>

                <!-- جدول المبيعات التفصيلي -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title mb-4">
                            <i class="bi bi-table text-primary"></i>
                            تفاصيل المبيعات
                        </h3>
                        <div class="overflow-x-auto">
                            <table class="table table-zebra w-full" id="sales-report-table">
                                <thead>
                                    <tr class="bg-gray-200 dark:bg-gray-700">
                                        <th>الشهر</th>
                                        <th>عدد الفواتير</th>
                                        <th>إجمالي المبيعات</th>
                                        <th>التكلفة</th>
                                        <th>الربح</th>
                                        <th>هامش الربح</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${Object.entries(salesByMonth).map(([month, data]) => `
                                        <tr>
                                            <td class="font-bold">${month}</td>
                                            <td>${data.count}</td>
                                            <td class="font-bold text-success">${formatMoney(data.sales)}</td>
                                            <td class="font-bold text-error">${formatMoney(data.cost)}</td>
                                            <td class="font-bold text-primary">${formatMoney(data.profit)}</td>
                                            <td>
                                                <span class="badge badge-${data.margin > 20 ? 'success' : data.margin > 10 ? 'warning' : 'error'}">
                                                    ${data.margin.toFixed(1)}%
                                                </span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                                <tfoot>
                                    <tr class="font-bold bg-primary text-white">
                                        <td>الإجمالي</td>
                                        <td>${invoices.length}</td>
                                        <td>${formatMoney(invoices.reduce((sum, inv) => sum + inv.total, 0))}</td>
                                        <td>${formatMoney(calculateTotalCost(invoices))}</td>
                                        <td>${formatMoney(calculateTotalProfit(invoices))}</td>
                                        <td>${calculateOverallMargin(invoices).toFixed(1)}%</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- رسم بياني مقارن -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">
                            <i class="bi bi-pie-chart text-primary"></i>
                            توزيع المبيعات حسب الحالة
                        </h3>
                        <canvas id="salesStatusChart" style="height: 250px;"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== تقرير الأرباح والخسائر ====================
    function renderProfitLossReport() {
        const invoices = APP_CORE.getData('invoices') || [];
        const expenses = calculateExpenses();
        
        const revenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const cost = calculateTotalCost(invoices);
        const grossProfit = revenue - cost;
        const netProfit = grossProfit - expenses;

        return `
            <div class="space-y-6">
                <!-- قائمة الدخل -->
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title text-2xl mb-6">
                            <i class="bi bi-receipt text-success"></i>
                            قائمة الدخل (Income Statement)
                        </h3>

                        <div class="space-y-4">
                            <!-- الإيرادات -->
                            <div>
                                <div class="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <span class="font-bold text-lg">إجمالي الإيرادات</span>
                                    <span class="text-2xl font-bold text-success">${formatMoney(revenue)}</span>
                                </div>
                            </div>

                            <div class="divider"></div>

                            <!-- تكلفة المبيعات -->
                            <div>
                                <div class="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <span class="font-bold">تكلفة المبيعات</span>
                                    <span class="text-xl font-bold text-error">${formatMoney(cost)}</span>
                                </div>
                            </div>

                            <div class="divider"></div>

                            <!-- مجمل الربح -->
                            <div>
                                <div class="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <span class="font-bold text-lg">مجمل الربح</span>
                                    <span class="text-2xl font-bold text-primary">${formatMoney(grossProfit)}</span>
                                </div>
                                <p class="text-sm text-gray-600 mt-2 text-center">
                                    هامش مجمل الربح: ${((grossProfit/revenue)*100).toFixed(1)}%
                                </p>
                            </div>

                            <div class="divider"></div>

                            <!-- المصروفات -->
                            <div>
                                <div class="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                    <span class="font-bold">إجمالي المصروفات</span>
                                    <span class="text-xl font-bold text-warning">${formatMoney(expenses)}</span>
                                </div>
                                <div class="mt-3 pr-4 space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span>• مصروفات إدارية</span>
                                        <span>${formatMoney(expenses * 0.4)}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span>• مصروفات تسويق</span>
                                        <span>${formatMoney(expenses * 0.3)}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span>• مصروفات أخرى</span>
                                        <span>${formatMoney(expenses * 0.3)}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="divider"></div>

                            <!-- صافي الربح -->
                            <div>
                                <div class="flex justify-between items-center p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
                                    <div>
                                        <span class="text-xl font-bold">صافي الربح</span>
                                        <p class="text-sm opacity-90 mt-1">Net Profit</p>
                                    </div>
                                    <div class="text-right">
                                        <span class="text-4xl font-bold">${formatMoney(netProfit)}</span>
                                        <p class="text-sm opacity-90 mt-1">
                                            هامش ${((netProfit/revenue)*100).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- رسوم بيانية -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <h3 class="card-title">توزيع التكاليف</h3>
                            <canvas id="costBreakdownChart" style="height: 250px;"></canvas>
                        </div>
                    </div>

                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <h3 class="card-title">الإيرادات مقابل المصروفات</h3>
                            <canvas id="revenueVsExpensesChart" style="height: 250px;"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== تقرير العملاء ====================
    function renderCustomersReport() {
        const customers = APP_CORE.getData('customers') || [];
        const invoices = APP_CORE.getData('invoices') || [];
        
        // حساب إحصائيات العملاء
        const customerStats = customers.map(customer => {
            const customerInvoices = invoices.filter(inv => inv.customerId === customer.id);
            const totalPurchases = customerInvoices.reduce((sum, inv) => sum + inv.total, 0);
            const invoiceCount = customerInvoices.length;
            
            return {
                ...customer,
                totalPurchases,
                invoiceCount,
                averagePurchase: invoiceCount > 0 ? totalPurchases / invoiceCount : 0,
                lastPurchaseDate: customerInvoices.length > 0 ? 
                    new Date(Math.max(...customerInvoices.map(inv => new Date(inv.date)))).toLocaleDateString('ar-EG') : 
                    'لا يوجد'
            };
        }).sort((a, b) => b.totalPurchases - a.totalPurchases);

        return `
            <div class="space-y-6">
                <!-- أفضل 10 عملاء -->
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title text-2xl mb-4">
                            <i class="bi bi-trophy text-warning"></i>
                            أفضل 10 عملاء
                        </h3>
                        <div class="overflow-x-auto">
                            <table class="table table-zebra w-full">
                                <thead>
                                    <tr class="bg-gray-200 dark:bg-gray-700">
                                        <th>الترتيب</th>
                                        <th>العميل</th>
                                        <th>عدد الفواتير</th>
                                        <th>إجمالي المشتريات</th>
                                        <th>متوسط الفاتورة</th>
                                        <th>آخر شراء</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${customerStats.slice(0, 10).map((customer, index) => `
                                        <tr>
                                            <td>
                                                <div class="flex items-center gap-2">
                                                    ${index < 3 ? 
                                                        `<i class="bi bi-trophy-fill text-${index === 0 ? 'warning' : index === 1 ? 'gray-400' : 'orange-600'} text-xl"></i>` : 
                                                        `<span class="font-bold">${index + 1}</span>`
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                <div class="flex items-center gap-3">
                                                    <div class="avatar placeholder">
                                                        <div class="bg-primary text-white rounded-full w-10">
                                                            <span>${customer.name.charAt(0)}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div class="font-bold">${customer.name}</div>
                                                        <div class="text-xs opacity-70">${customer.phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="font-bold">${customer.invoiceCount}</td>
                                            <td class="font-bold text-success">${formatMoney(customer.totalPurchases)}</td>
                                            <td>${formatMoney(customer.averagePurchase)}</td>
                                            <td class="text-sm">${customer.lastPurchaseDate}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- رسم بياني -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">
                            <i class="bi bi-bar-chart text-primary"></i>
                            أعلى 10 عملاء من حيث المبيعات
                        </h3>
                        <canvas id="topCustomersChart" style="height: 350px;"></canvas>
                    </div>
                </div>

                <!-- تحليل العملاء -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="stats shadow">
                        <div class="stat">
                            <div class="stat-title">إجمالي العملاء</div>
                            <div class="stat-value text-primary">${customers.length}</div>
                            <div class="stat-desc">عميل نشط</div>
                        </div>
                    </div>

                    <div class="stats shadow">
                        <div class="stat">
                            <div class="stat-title">متوسط قيمة العميل</div>
                            <div class="stat-value text-success">${formatMoney(
                                customerStats.length > 0 ? 
                                customerStats.reduce((sum, c) => sum + c.totalPurchases, 0) / customerStats.length : 
                                0
                            )}</div>
                            <div class="stat-desc">Customer Lifetime Value</div>
                        </div>
                    </div>

                    <div class="stats shadow">
                        <div class="stat">
                            <div class="stat-title">أفضل عميل</div>
                            <div class="stat-value text-warning text-xl">${customerStats[0]?.name || 'لا يوجد'}</div>
                            <div class="stat-desc">${formatMoney(customerStats[0]?.totalPurchases || 0)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== تقرير المنتجات ====================
    function renderProductsReport() {
        const products = APP_CORE.getData('products') || [];
        const invoices = APP_CORE.getData('invoices') || [];
        
        // حساب مبيعات كل منتج
        const productStats = products.map(product => {
            let totalQuantity = 0;
            let totalRevenue = 0;
            
            invoices.forEach(invoice => {
                invoice.items.forEach(item => {
                    if (item.productId === product.id) {
                        totalQuantity += item.quantity;
                        totalRevenue += item.total;
                    }
                });
            });

            const profit = totalRevenue - (totalQuantity * (product.costPrice || 0));
            
            return {
                ...product,
                totalQuantity,
                totalRevenue,
                profit,
                profitMargin: totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0
            };
        }).sort((a, b) => b.totalRevenue - a.totalRevenue);

        return `
            <div class="space-y-6">
                <!-- أكثر المنتجات مبيعاً -->
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title text-2xl mb-4">
                            <i class="bi bi-box-seam text-primary"></i>
                            أكثر المنتجات مبيعاً
                        </h3>
                        <div class="overflow-x-auto">
                            <table class="table table-zebra w-full">
                                <thead>
                                    <tr class="bg-gray-200 dark:bg-gray-700">
                                        <th>الترتيب</th>
                                        <th>المنتج</th>
                                        <th>الكمية المباعة</th>
                                        <th>إجمالي المبيعات</th>
                                        <th>الربح</th>
                                        <th>هامش الربح</th>
                                        <th>المخزون</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${productStats.filter(p => p.totalQuantity > 0).map((product, index) => `
                                        <tr>
                                            <td>
                                                ${index < 3 ? 
                                                    `<i class="bi bi-star-fill text-warning text-xl"></i>` : 
                                                    `<span class="font-bold">${index + 1}</span>`
                                                }
                                            </td>
                                            <td>
                                                <div>
                                                    <div class="font-bold">${product.name}</div>
                                                    <div class="text-xs opacity-70">${product.sku}</div>
                                                </div>
                                            </td>
                                            <td class="font-bold">${product.totalQuantity}</td>
                                            <td class="font-bold text-success">${formatMoney(product.totalRevenue)}</td>
                                            <td class="font-bold text-primary">${formatMoney(product.profit)}</td>
                                            <td>
                                                <span class="badge badge-${product.profitMargin > 30 ? 'success' : product.profitMargin > 15 ? 'warning' : 'error'}">
                                                    ${product.profitMargin.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td>
                                                <span class="badge badge-${product.currentStock > product.minStock ? 'success' : 'warning'}">
                                                    ${product.currentStock}
                                                </span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- رسوم بيانية -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <h3 class="card-title">أعلى 10 منتجات مبيعاً</h3>
                            <canvas id="topProductsChart" style="height: 300px;"></canvas>
                        </div>
                    </div>

                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <h3 class="card-title">توزيع المبيعات حسب الفئة</h3>
                            <canvas id="productCategoriesChart" style="height: 300px;"></canvas>
                        </div>
                    </div>
                </div>

                <!-- تحذيرات المخزون -->
                ${renderStockAlerts(products)}
            </div>
        `;
    }

    // ==================== تحذيرات المخزون ====================
    function renderStockAlerts(products) {
        const lowStock = products.filter(p => p.currentStock <= p.minStock);
        
        if (lowStock.length === 0) {
            return `
                <div class="alert alert-success">
                    <i class="bi bi-check-circle"></i>
                    <span>جميع المنتجات متوفرة بكميات كافية</span>
                </div>
            `;
        }

        return `
            <div class="card bg-base-100 shadow-xl border-2 border-warning">
                <div class="card-body">
                    <h3 class="card-title text-warning">
                        <i class="bi bi-exclamation-triangle"></i>
                        تنبيهات المخزون (${lowStock.length})
                    </h3>
                    <div class="space-y-2">
                        ${lowStock.map(product => `
                            <div class="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                                <div>
                                    <p class="font-bold">${product.name}</p>
                                    <p class="text-sm opacity-70">الكمية المتوفرة: ${product.currentStock} - الحد الأدنى: ${product.minStock}</p>
                                </div>
                                <button class="btn btn-warning btn-sm" onclick="APP_PAGES.navigateTo('inventory')">
                                    <i class="bi bi-plus-lg"></i>
                                    إعادة طلب
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== دوال مساعدة ====================
    function calculateComprehensiveStats() {
        const invoices = APP_CORE.getData('invoices') || [];
        const customers = APP_CORE.getData('customers') || [];
        const quotations = APP_CORE.getData('quotations') || [];
        
        const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const totalCost = calculateTotalCost(invoices);
        const netProfit = totalSales - totalCost;
        const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

        // حساب النمو (مقارنة مع الشهر الماضي)
        const now = new Date();
        const lastMonthSales = invoices.filter(inv => {
            const invDate = new Date(inv.date);
            return invDate.getMonth() === (now.getMonth() - 1) && invDate.getFullYear() === now.getFullYear();
        }).reduce((sum, inv) => sum + inv.total, 0);
        
        const thisMonthSales = invoices.filter(inv => {
            const invDate = new Date(inv.date);
            return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
        }).reduce((sum, inv) => sum + inv.total, 0);
        
        const salesGrowth = lastMonthSales > 0 ? ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100 : 0;

        return {
            totalSales,
            netProfit,
            profitMargin,
            salesGrowth,
            invoiceCount: invoices.length,
            averageInvoice: invoices.length > 0 ? totalSales / invoices.length : 0,
            activeCustomers: customers.filter(c => c.status === 'active').length,
            totalCustomers: customers.length
        };
    }

    function groupSalesByMonth(invoices) {
        const grouped = {};
        
        invoices.forEach(invoice => {
            const date = new Date(invoice.date);
            const monthKey = date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' });
            
            if (!grouped[monthKey]) {
                grouped[monthKey] = {
                    count: 0,
                    sales: 0,
                    cost: 0,
                    profit: 0,
                    margin: 0
                };
            }
            
            const cost = calculateInvoiceCost(invoice);
            const profit = invoice.total - cost;
            
            grouped[monthKey].count++;
            grouped[monthKey].sales += invoice.total;
            grouped[monthKey].cost += cost;
            grouped[monthKey].profit += profit;
            grouped[monthKey].margin = grouped[monthKey].sales > 0 ? 
                (grouped[monthKey].profit / grouped[monthKey].sales) * 100 : 0;
        });
        
        return grouped;
    }

    function calculateInvoiceCost(invoice) {
        const products = APP_CORE.getData('products') || [];
        let cost = 0;
        
        invoice.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                cost += (product.costPrice || 0) * item.quantity;
            }
        });
        
        return cost;
    }

    function calculateTotalCost(invoices) {
        return invoices.reduce((sum, inv) => sum + calculateInvoiceCost(inv), 0);
    }

    function calculateTotalProfit(invoices) {
        const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const totalCost = calculateTotalCost(invoices);
        return totalSales - totalCost;
    }

    function calculateOverallMargin(invoices) {
        const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const profit = calculateTotalProfit(invoices);
        return totalSales > 0 ? (profit / totalSales) * 100 : 0;
    }

    function calculateExpenses() {
        // في نظام حقيقي، سيتم جلبها من قاعدة البيانات
        const invoices = APP_CORE.getData('invoices') || [];
        const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
        // افتراض 15% من المبيعات كمصروفات
        return totalSales * 0.15;
    }

    function formatMoney(amount) {
        if (amount === null || amount === undefined || isNaN(amount)) amount = 0;
        return amount.toLocaleString('ar-EG', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }) + ' ج.م';
    }

    // ==================== التبديل بين التقارير ====================
    function switchTab(tabName) {
        // تحديث الـ tabs
        document.querySelectorAll('.tabs .tab').forEach(tab => {
            tab.classList.remove('tab-active');
        });
        event.target.closest('.tab').classList.add('tab-active');

        // عرض التقرير
        const content = document.getElementById('report-content');
        
        switch(tabName) {
            case 'sales':
                content.innerHTML = renderSalesReport();
                setTimeout(initializeSalesCharts, 200);
                break;
            case 'profit':
                content.innerHTML = renderProfitLossReport();
                setTimeout(initializeProfitCharts, 200);
                break;
            case 'customers':
                content.innerHTML = renderCustomersReport();
                setTimeout(initializeCustomersCharts, 200);
                break;
            case 'products':
                content.innerHTML = renderProductsReport();
                setTimeout(initializeProductsCharts, 200);
                break;
        }
    }

    // ==================== تهيئة الرسوم البيانية ====================
    function initializeSalesCharts() {
        if (typeof Chart === 'undefined') return;

        const invoices = APP_CORE.getData('invoices') || [];
        const salesByMonth = groupSalesByMonth(invoices);

        // رسم المبيعات الشهرية
        const ctx1 = document.getElementById('salesMonthlyChart');
        if (ctx1) {
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: Object.keys(salesByMonth),
                    datasets: [{
                        label: 'المبيعات',
                        data: Object.values(salesByMonth).map(d => d.sales),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true }
                    }
                }
            });
        }

        // رسم توزيع الحالات
        const ctx2 = document.getElementById('salesStatusChart');
        if (ctx2) {
            const paid = invoices.filter(inv => inv.paymentStatus === 'paid').length;
            const unpaid = invoices.filter(inv => inv.paymentStatus === 'unpaid').length;
            const partial = invoices.filter(inv => inv.paymentStatus === 'partial').length;

            new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['مدفوع', 'غير مدفوع', 'جزئي'],
                    datasets: [{
                        data: [paid, unpaid, partial],
                        backgroundColor: ['#10b981', '#ef4444', '#f59e0b']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    function initializeProfitCharts() {
        if (typeof Chart === 'undefined') return;

        const invoices = APP_CORE.getData('invoices') || [];
        const revenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const cost = calculateTotalCost(invoices);
        const expenses = calculateExpenses();

        // رسم توزيع التكاليف
        const ctx1 = document.getElementById('costBreakdownChart');
        if (ctx1) {
            new Chart(ctx1, {
                type: 'pie',
                data: {
                    labels: ['تكلفة البضاعة', 'مصروفات إدارية', 'مصروفات تسويق', 'مصروفات أخرى'],
                    datasets: [{
                        data: [cost, expenses * 0.4, expenses * 0.3, expenses * 0.3],
                        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // رسم الإيرادات مقابل المصروفات
        const ctx2 = document.getElementById('revenueVsExpensesChart');
        if (ctx2) {
            new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['المالية'],
                    datasets: [
                        {
                            label: 'الإيرادات',
                            data: [revenue],
                            backgroundColor: '#10b981'
                        },
                        {
                            label: 'التكاليف',
                            data: [cost + expenses],
                            backgroundColor: '#ef4444'
                        },
                        {
                            label: 'الربح',
                            data: [revenue - cost - expenses],
                            backgroundColor: '#3b82f6'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    function initializeCustomersCharts() {
        if (typeof Chart === 'undefined') return;

        const customers = APP_CORE.getData('customers') || [];
        const invoices = APP_CORE.getData('invoices') || [];
        
        const customerStats = customers.map(customer => {
            const total = invoices
                .filter(inv => inv.customerId === customer.id)
                .reduce((sum, inv) => sum + inv.total, 0);
            return { name: customer.name, total };
        }).sort((a, b) => b.total - a.total).slice(0, 10);

        const ctx = document.getElementById('topCustomersChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: customerStats.map(c => c.name),
                    datasets: [{
                        label: 'إجمالي المشتريات (ج.م)',
                        data: customerStats.map(c => c.total),
                        backgroundColor: '#3b82f6'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y'
                }
            });
        }
    }

    function initializeProductsCharts() {
        if (typeof Chart === 'undefined') return;

        const products = APP_CORE.getData('products') || [];
        const invoices = APP_CORE.getData('invoices') || [];
        
        const productStats = products.map(product => {
            let totalRevenue = 0;
            invoices.forEach(invoice => {
                invoice.items.forEach(item => {
                    if (item.productId === product.id) {
                        totalRevenue += item.total;
                    }
                });
            });
            return { name: product.name, total: totalRevenue, category: product.category };
        }).sort((a, b) => b.total - a.total).slice(0, 10);

        // أعلى 10 منتجات
        const ctx1 = document.getElementById('topProductsChart');
        if (ctx1) {
            new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: productStats.map(p => p.name.substring(0, 20)),
                    datasets: [{
                        label: 'المبيعات (ج.م)',
                        data: productStats.map(p => p.total),
                        backgroundColor: '#10b981'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // توزيع حسب الفئة
        const ctx2 = document.getElementById('productCategoriesChart');
        if (ctx2) {
            const categories = {};
            productStats.forEach(p => {
                categories[p.category] = (categories[p.category] || 0) + p.total;
            });

            new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(categories),
                    datasets: [{
                        data: Object.values(categories),
                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    // ==================== تصدير Excel ====================
    function exportAllToExcel() {
        if (typeof XLSX === 'undefined') {
            APP_CORE.showToast('مكتبة Excel غير محملة', 'error');
            return;
        }

        const wb = XLSX.utils.book_new();

        // تقرير المبيعات
        const invoices = APP_CORE.getData('invoices') || [];
        const salesData = invoices.map(inv => ({
            'رقم الفاتورة': inv.invoiceNumber,
            'التاريخ': inv.date,
            'العميل': inv.customerName,
            'المبلغ': inv.total,
            'الحالة': inv.paymentStatus === 'paid' ? 'مدفوع' : inv.paymentStatus === 'unpaid' ? 'غير مدفوع' : 'جزئي'
        }));
        
        const ws1 = XLSX.utils.json_to_sheet(salesData);
        XLSX.utils.book_append_sheet(wb, ws1, "المبيعات");

        // تقرير العملاء
        const customers = APP_CORE.getData('customers') || [];
        const customersData = customers.map(c => ({
            'الاسم': c.name,
            'الهاتف': c.phone,
            'البريد': c.email,
            'الرصيد': c.currentBalance
        }));
        
        const ws2 = XLSX.utils.json_to_sheet(customersData);
        XLSX.utils.book_append_sheet(wb, ws2, "العملاء");

        // حفظ الملف
        XLSX.writeFile(wb, `تقرير-شامل-${new Date().toISOString().split('T')[0]}.xlsx`);
        
        APP_CORE.showToast('تم تصدير التقارير بنجاح ✅', 'success');
    }

    // ==================== فلترة ====================
    function filterSalesReport() {
        // سيتم تنفيذها لاحقاً
        APP_CORE.showToast('جاري التطوير...', 'info');
    }

    function resetSalesFilter() {
        document.getElementById('sales-date-from').value = '';
        document.getElementById('sales-date-to').value = '';
        filterSalesReport();
    }

    // ==================== Public API ====================
    console.log('✅ نظام التقارير المالية جاهز 📊');

    return {
        renderReportsPage,
        switchTab,
        exportAllToExcel,
        filterSalesReport,
        resetSalesFilter
    };
})();

if (typeof APP_REPORTS !== 'undefined') {
    console.log('✅ APP_REPORTS تم تعريفه بنجاح');
} else {
    console.error('❌ فشل تعريف APP_REPORTS');
}