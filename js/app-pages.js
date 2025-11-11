// ==================== نظام الصفحات - النسخة النهائية ====================
const APP_PAGES = (function() {
    'use strict';

    let currentPage = 'dashboard';

    const PAGES = {
        dashboard: { title: 'لوحة التحكم', icon: 'bi-speedometer2', render: renderDashboard },
        customers: { title: 'إدارة العملاء', icon: 'bi-people', render: renderCustomers },
        opportunities: { title: 'الفرص البيعية', icon: 'bi-briefcase', render: renderOpportunities },
        quotations: { title: 'عروض الأسعار', icon: 'bi-file-earmark-text', render: renderQuotations },
        sales_orders: { title: 'طلبات البيع', icon: 'bi-cart-check', render: renderSalesOrders },
        sales_team: { title: 'فريق المبيعات', icon: 'bi-person-badge', render: renderSalesTeam },
        suppliers: { title: 'الموردون', icon: 'bi-truck', render: renderSuppliers },
        purchase_orders: { title: 'طلبات الشراء', icon: 'bi-cart-plus', render: renderPurchaseOrders },
        inventory: { title: 'المخزون', icon: 'bi-box-seam', render: renderInventory },
        accounting: { title: 'المحاسبة', icon: 'bi-calculator', render: renderAccounting },
        invoices: { 
            title: 'الفواتير', 
            icon: 'bi-receipt',
            render: () => typeof APP_INVOICES !== 'undefined' ? APP_INVOICES.renderInvoicesPage() : renderSimplePage('الفواتير', 'bi-receipt', 'نظام الفواتير غير محمّل')
        },
        reports: { 
            title: 'التقارير', 
            icon: 'bi-graph-up', 
            render: () => typeof APP_REPORTS !== 'undefined' ? APP_REPORTS.renderReportsPage() : renderSimplePage('التقارير', 'bi-graph-up', 'نظام التقارير غير محمّل')
        },
        settings: { title: 'الإعدادات', icon: 'bi-gear', render: renderSettings },
        profile: { title: 'الملف الشخصي', icon: 'bi-person', render: renderProfile }
    };

    function navigateTo(pageId) {
        if (!PAGES[pageId]) {
            APP_CORE.showToast('الصفحة غير موجودة', 'error');
            return;
        }

        currentPage = pageId;
        const page = PAGES[pageId];

        document.getElementById('page-title').textContent = page.title;
        document.getElementById('page-icon').className = `bi ${page.icon} text-primary`;

        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.dataset.page === pageId) {
                link.classList.add('bg-primary', 'text-white');
            } else {
                link.classList.remove('bg-primary', 'text-white');
            }
        });

        const content = document.getElementById('main-content');
        if (content) {
            content.innerHTML = '<div class="flex justify-center items-center py-12"><span class="loading loading-spinner loading-lg text-primary"></span></div>';
            
            setTimeout(() => {
                try {
                    content.innerHTML = page.render();
                    
                    if (pageId === 'dashboard' && typeof APP_CHARTS !== 'undefined') {
                        setTimeout(() => APP_CHARTS.initializeCharts(), 200);
                    }
                } catch (error) {
                    console.error('Error rendering page:', error);
                    content.innerHTML = `
                        <div class="alert alert-error">
                            <i class="bi bi-x-circle"></i>
                            <span>حدث خطأ: ${error.message}</span>
                        </div>
                    `;
                }
            }, 100);
        }

        const drawerToggle = document.getElementById('drawer-toggle');
        if (drawerToggle) drawerToggle.checked = false;
    }

    function renderDashboard() {
        if (typeof APP_DASHBOARD_ENHANCED !== 'undefined') {
            return APP_DASHBOARD_ENHANCED.renderEnhancedDashboard();
        }

        const customers = APP_CORE.getData('customers') || [];
        const quotations = APP_CORE.getData('quotations') || [];
        const products = APP_CORE.getData('products') || [];
        
        const totalSales = quotations.filter(q => q.status === 'closed').reduce((sum, q) => sum + (q.customerPrice || 0), 0);
        const lowStock = products.filter(p => p.currentStock <= p.minStock).length;

        return `
            <div class="space-y-6">
                <div class="card bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <div class="card-body">
                        <h2 class="text-3xl font-bold">مرحباً، ${APP_CORE.appState.currentUser?.name} 👋</h2>
                        <p class="opacity-90">نظام محاسبي برو - ${new Date().toLocaleDateString('ar-EG')}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="card bg-blue-500 text-white shadow-xl cursor-pointer" onclick="APP_PAGES.navigateTo('customers')">
                        <div class="card-body">
                            <h3 class="card-title">العملاء</h3>
                            <p class="text-4xl font-bold">${customers.length}</p>
                        </div>
                    </div>

                    <div class="card bg-green-500 text-white shadow-xl cursor-pointer" onclick="APP_PAGES.navigateTo('quotations')">
                        <div class="card-body">
                            <h3 class="card-title">المبيعات</h3>
                            <p class="text-3xl font-bold">${APP_CORE.formatCurrency(totalSales)}</p>
                        </div>
                    </div>

                    <div class="card bg-purple-500 text-white shadow-xl cursor-pointer" onclick="APP_PAGES.navigateTo('invoices')">
                        <div class="card-body">
                            <h3 class="card-title">الفواتير</h3>
                            <p class="text-4xl font-bold">${(APP_CORE.getData('invoices') || []).length}</p>
                        </div>
                    </div>

                    <div class="card bg-orange-500 text-white shadow-xl cursor-pointer" onclick="APP_PAGES.navigateTo('inventory')">
                        <div class="card-body">
                            <h3 class="card-title">تنبيهات المخزون</h3>
                            <p class="text-4xl font-bold">${lowStock}</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="card bg-white dark:bg-gray-800 shadow-xl">
                        <div class="card-body">
                            <h3 class="card-title">المبيعات الشهرية</h3>
                            <canvas id="salesChart" style="height: 300px;"></canvas>
                        </div>
                    </div>

                    <div class="card bg-white dark:bg-gray-800 shadow-xl">
                        <div class="card-body">
                            <h3 class="card-title">توزيع العملاء</h3>
                            <canvas id="customersChart" style="height: 300px;"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderCustomers() {
        const customers = APP_CORE.getData('customers') || [];
        
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold">إدارة العملاء</h2>
                        <p class="text-gray-600 dark:text-gray-400">${customers.length} عميل</p>
                    </div>
                    <button class="btn btn-primary" onclick="if(typeof APP_MODALS !== 'undefined') APP_MODALS.showAddCustomerModal(); else alert('قريباً')">
                        <i class="bi bi-plus-lg"></i> إضافة عميل
                    </button>
                </div>

                <div class="card bg-white dark:bg-gray-800 shadow-lg">
                    <div class="card-body">
                        <div class="overflow-x-auto">
                            <table class="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>العميل</th>
                                        <th>الهاتف</th>
                                        <th>البريد</th>
                                        <th>الرصيد</th>
                                        <th>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${customers.length === 0 ? `
                                        <tr><td colspan="5" class="text-center py-12">
                                            <i class="bi bi-people text-6xl opacity-30"></i>
                                            <p class="mt-4">لا يوجد عملاء</p>
                                        </td></tr>
                                    ` : customers.map(c => `
                                        <tr>
                                            <td>
                                                <div class="flex items-center gap-3">
                                                    <div class="avatar placeholder">
                                                        <div class="bg-primary text-white rounded-full w-10">
                                                            <span>${c.name.charAt(0)}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div class="font-bold">${c.name}</div>
                                                        <div class="text-sm opacity-70">${c.nameEn || ''}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>${c.phone}</td>
                                            <td class="text-sm">${c.email}</td>
                                            <td>
                                                <span class="font-bold ${c.currentBalance > 0 ? 'text-error' : 'text-success'}">
                                                    ${APP_CORE.formatCurrency(c.currentBalance)}
                                                </span>
                                            </td>
                                            <td>
                                                <button class="btn btn-ghost btn-sm" title="عرض">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderQuotations() {
        if (typeof APP_PAGES_COMPLETE !== 'undefined') {
            return APP_PAGES_COMPLETE.renderQuotationsComplete();
        }

        const quotations = APP_CORE.getData('quotations') || [];
        const customers = APP_CORE.getData('customers') || [];

        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">عروض الأسعار</h2>
                    <button class="btn btn-primary" onclick="alert('قريباً')">
                        <i class="bi bi-plus-lg"></i> إنشاء عرض
                    </button>
                </div>

                <div class="card bg-white dark:bg-gray-800 shadow-lg">
                    <div class="card-body">
                        <div class="overflow-x-auto">
                            <table class="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>رقم العرض</th>
                                        <th>التاريخ</th>
                                        <th>العميل</th>
                                        <th>المبلغ</th>
                                        <th>الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${quotations.map(q => {
                                        const customer = customers.find(c => c.id === q.customerId);
                                        return `
                                            <tr>
                                                <td class="font-bold">${q.number}</td>
                                                <td>${APP_CORE.formatDate(q.date, 'short')}</td>
                                                <td>${customer?.name || 'غير محدد'}</td>
                                                <td class="font-bold text-success">${APP_CORE.formatCurrency(q.customerPrice)}</td>
                                                <td><span class="badge badge-info">${q.status}</span></td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderOpportunities() {
        return renderSimplePage('الفرص البيعية', 'bi-briefcase', 'قريباً');
    }

    function renderSalesOrders() {
        return renderSimplePage('طلبات البيع', 'bi-cart-check', 'قريباً');
    }

    function renderSalesTeam() {
        const salesTeam = APP_CORE.getData('salesTeam') || [];
        return `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold">فريق المبيعات</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${salesTeam.map(agent => `
                        <div class="card bg-white dark:bg-gray-800 shadow-lg">
                            <div class="card-body">
                                <div class="flex items-center gap-4 mb-4">
                                    <div class="avatar placeholder">
                                        <div class="bg-primary text-white rounded-full w-16">
                                            <span class="text-2xl">${agent.name.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 class="font-bold text-lg">${agent.name}</h3>
                                        <p class="text-sm opacity-70">${agent.position}</p>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-sm">الهدف:</span>
                                        <span class="font-bold">${APP_CORE.formatCurrency(agent.target)}</span>
                                    </div>
                                    <progress class="progress progress-primary" value="${(agent.achieved/agent.target)*100}" max="100"></progress>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderSuppliers() {
        const suppliers = APP_CORE.getData('suppliers') || [];
        return `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold">الموردون</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${suppliers.map(s => `
                        <div class="card bg-white dark:bg-gray-800 shadow-lg">
                            <div class="card-body">
                                <h3 class="card-title">${s.name}</h3>
                                <p class="text-sm">${s.phone}</p>
                                <p class="text-sm opacity-70">${s.email}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderPurchaseOrders() {
        return renderSimplePage('طلبات الشراء', 'bi-cart-plus', 'قريباً');
    }

    function renderInventory() {
        const products = APP_CORE.getData('products') || [];
        return `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold">المخزون (${products.length} منتج)</h2>
                <div class="card bg-white dark:bg-gray-800 shadow-lg">
                    <div class="card-body">
                        <table class="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>المنتج</th>
                                    <th>المخزون</th>
                                    <th>السعر</th>
                                    <th>الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.map(p => `
                                    <tr>
                                        <td>${p.name}</td>
                                        <td class="font-bold">${p.currentStock}</td>
                                        <td>${APP_CORE.formatCurrency(p.unitPrice)}</td>
                                        <td>
                                            <span class="badge badge-${p.currentStock > p.minStock ? 'success' : 'warning'}">
                                                ${p.currentStock > p.minStock ? 'متوفر' : 'منخفض'}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    function renderAccounting() {
        if (typeof APP_ACCOUNTING !== 'undefined') {
            return APP_ACCOUNTING.renderAccountingPage();
        }
        return renderSimplePage('المحاسبة', 'bi-calculator', 'قريباً');
    }

    function renderSettings() {
        return renderSimplePage('الإعدادات', 'bi-gear', 'قريباً');
    }

    function renderProfile() {
        const user = APP_CORE.appState.currentUser;
        return `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold">الملف الشخصي</h2>
                <div class="card bg-white dark:bg-gray-800 shadow-lg">
                    <div class="card-body">
                        <div class="flex items-center gap-6">
                            <div class="avatar placeholder">
                                <div class="bg-primary text-white rounded-full w-24 text-3xl">
                                    <span>${user?.avatar}</span>
                                </div>
                            </div>
                            <div>
                                <h3 class="text-2xl font-bold">${user?.name}</h3>
                                <p class="text-gray-600">${user?.email}</p>
                                <p class="text-sm opacity-70 mt-1">${user?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderSimplePage(title, icon, message) {
        return `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold">${title}</h2>
                <div class="card bg-white dark:bg-gray-800 shadow-lg">
                    <div class="card-body">
                        <div class="text-center py-12">
                            <i class="bi ${icon} text-6xl opacity-30"></i>
                            <p class="mt-4 text-lg">${message}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    console.log('✅ APP_PAGES جاهز');

    return {
        navigateTo,
        getCurrentPage: () => currentPage,
        PAGES
    };
})();

if (typeof APP_PAGES !== 'undefined') {
    console.log('✅ APP_PAGES تم تعريفه بنجاح');
} else {
    console.error('❌ فشل تعريف APP_PAGES');
}