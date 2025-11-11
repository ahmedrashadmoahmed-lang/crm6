// ==================== لوحة تحكم محسّنة ====================
const APP_DASHBOARD_ENHANCED = (function() {
    'use strict';

    function renderEnhancedDashboard() {
        const customers = APP_CORE.getData('customers') || [];
        const quotations = APP_CORE.getData('quotations') || [];
        const opportunities = APP_CORE.getData('opportunities') || [];
        const products = APP_CORE.getData('products') || [];
        const salesTeam = APP_CORE.getData('salesTeam') || [];

        const totalSales = quotations.filter(q => q.status === 'closed').reduce((sum, q) => sum + (q.customerPrice || 0), 0);
        const totalProfit = quotations.filter(q => q.status === 'closed').reduce((sum, q) => sum + (q.profit || 0), 0);
        const activeOpportunities = opportunities.filter(o => o.stage !== 'closed').length;
        const lowStockProducts = products.filter(p => p.currentStock <= p.minStock).length;

        // حساب نمو المبيعات
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const currentMonthSales = quotations.filter(q => {
            const qDate = new Date(q.date);
            return q.status === 'closed' && qDate.getMonth() === now.getMonth() && qDate.getFullYear() === now.getFullYear();
        }).reduce((sum, q) => sum + (q.customerPrice || 0), 0);
        
        const lastMonthSales = quotations.filter(q => {
            const qDate = new Date(q.date);
            return q.status === 'closed' && qDate.getMonth() === lastMonth.getMonth() && qDate.getFullYear() === lastMonth.getFullYear();
        }).reduce((sum, q) => sum + (q.customerPrice || 0), 0);
        
        const salesGrowth = lastMonthSales > 0 ? (((currentMonthSales - lastMonthSales) / lastMonthSales) * 100).toFixed(1) : 0;

        return `
            <div class="space-y-6">
                <!-- Welcome Header -->
                <div class="card bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-2xl">
                    <div class="card-body">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 class="text-3xl font-bold mb-2">مرحباً، ${APP_CORE.appState.currentUser?.name} 👋</h2>
                                <p class="text-white/90">إليك نظرة عامة على أداء نظامك اليوم - ${new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div class="stats bg-white/10 text-white backdrop-blur-sm">
                                <div class="stat place-items-center">
                                    <div class="stat-title text-white/80">نمو المبيعات</div>
                                    <div class="stat-value text-3xl ${salesGrowth >= 0 ? 'text-green-300' : 'text-red-300'}">
                                        ${salesGrowth >= 0 ? '↗' : '↘'} ${Math.abs(salesGrowth)}%
                                    </div>
                                    <div class="stat-desc text-white/70">مقارنة بالشهر الماضي</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- KPI Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Total Sales -->
                    <div class="stat-card card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all" onclick="APP_PAGES.navigateTo('quotations')">
                        <div class="card-body">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <p class="text-sm opacity-90 mb-1">إجمالي المبيعات</p>
                                    <p class="text-3xl font-bold mb-2">${APP_CORE.formatCurrency(totalSales)}</p>
                                    <div class="badge badge-sm bg-white/20">
                                        ${quotations.filter(q => q.status === 'closed').length} صفقة مغلقة
                                    </div>
                                </div>
                                <div class="text-5xl opacity-30">
                                    <i class="bi bi-currency-dollar"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Total Profit -->
                    <div class="stat-card card bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all" onclick="APP_PAGES.navigateTo('reports')">
                        <div class="card-body">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <p class="text-sm opacity-90 mb-1">صافي الربح</p>
                                    <p class="text-3xl font-bold mb-2">${APP_CORE.formatCurrency(totalProfit)}</p>
                                    <div class="badge badge-sm bg-white/20">
                                        ${totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : 0}% هامش ربح
                                    </div>
                                </div>
                                <div class="text-5xl opacity-30">
                                    <i class="bi bi-graph-up-arrow"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Customers -->
                    <div class="stat-card card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all" onclick="APP_PAGES.navigateTo('customers')">
                        <div class="card-body">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <p class="text-sm opacity-90 mb-1">العملاء</p>
                                    <p class="text-3xl font-bold mb-2">${customers.length}</p>
                                    <div class="badge badge-sm bg-white/20">
                                        ${customers.filter(c => c.status === 'active').length} نشط
                                    </div>
                                </div>
                                <div class="text-5xl opacity-30">
                                    <i class="bi bi-people"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Alerts -->
                    <div class="stat-card card bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-xl hover:shadow-2xl transition-all" onclick="APP_PAGES.navigateTo('inventory')">
                        <div class="card-body">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <p class="text-sm opacity-90 mb-1">التنبيهات</p>
                                    <p class="text-3xl font-bold mb-2">${lowStockProducts}</p>
                                    <div class="badge badge-sm bg-white/20">
                                        مخزون منخفض
                                    </div>
                                </div>
                                <div class="text-5xl opacity-30">
                                    <i class="bi bi-exclamation-triangle"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="card bg-white dark:bg-gray-800 shadow-xl">
                        <div class="card-body">
                            <h3 class="card-title mb-4">
                                <i class="bi bi-graph-up text-primary"></i>
                                المبيعات الشهرية
                            </h3>
                            <div style="height: 300px;">
                                <canvas id="salesChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div class="card bg-white dark:bg-gray-800 shadow-xl">
                        <div class="card-body">
                            <h3 class="card-title mb-4">
                                <i class="bi bi-pie-chart text-success"></i>
                                توزيع العملاء
                            </h3>
                            <div style="height: 300px;">
                                <canvas id="customersChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activities & Top Performers -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Recent Activities -->
                    <div class="card bg-white dark:bg-gray-800 shadow-xl">
                        <div class="card-body">
                            <h3 class="card-title mb-4">
                                <i class="bi bi-clock-history text-primary"></i>
                                آخر العمليات
                            </h3>
                            <div class="space-y-3 max-h-96 overflow-y-auto">
                                ${renderRecentActivities(quotations, customers)}
                            </div>
                        </div>
                    </div>

                    <!-- Top Sales Agents -->
                    <div class="card bg-white dark:bg-gray-800 shadow-xl">
                        <div class="card-body">
                            <h3 class="card-title mb-4">
                                <i class="bi bi-trophy text-warning"></i>
                                أفضل مندوبي المبيعات
                            </h3>
                            <div class="space-y-3">
                                ${renderTopSalesAgents(quotations, salesTeam)}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Workflow Diagram -->
                ${APP_WORKFLOW.renderWorkflowDiagram()}
            </div>
        `;
    }

    function renderRecentActivities(quotations, customers) {
        const recent = quotations.slice(0, 8);
        
        if (recent.length === 0) {
            return '<p class="text-center text-gray-500 py-8">لا توجد عمليات حديثة</p>';
        }

        return recent.map(q => {
            const customer = customers.find(c => c.id === q.customerId);
            return `
                <div class="flex items-center gap-3 p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors cursor-pointer" onclick="APP_PAGES_COMPLETE.viewQuotationDetails('${q.id}')">
                    <div class="avatar placeholder">
                        <div class="bg-primary text-white rounded-full w-10">
                            <i class="bi bi-file-earmark-text"></i>
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="font-semibold text-sm truncate">${q.number}</p>
                        <p class="text-xs opacity-70 truncate">${customer?.name || 'غير محدد'}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-sm">${APP_CORE.formatCurrency(q.customerPrice)}</p>
                        <p class="text-xs opacity-60">${formatTimeAgo(q.date)}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderTopSalesAgents(quotations, salesTeam) {
        const agentPerformance = {};
        
        quotations.filter(q => q.status === 'closed').forEach(q => {
            const agent = q.salesPerson || 'غير محدد';
            if (!agentPerformance[agent]) {
                agentPerformance[agent] = { sales: 0, profit: 0, count: 0 };
            }
            agentPerformance[agent].sales += q.customerPrice || 0;
            agentPerformance[agent].profit += q.profit || 0;
            agentPerformance[agent].count += 1;
        });

        const topAgents = Object.entries(agentPerformance)
            .sort((a, b) => b[1].sales - a[1].sales)
            .slice(0, 5);

        if (topAgents.length === 0) {
            return '<p class="text-center text-gray-500 py-8">لا توجد بيانات</p>';
        }

        return topAgents.map((agent, index) => {
            const [name, data] = agent;
            const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
            
            return `
                <div class="flex items-center gap-3 p-3 rounded-lg bg-base-200">
                    <div class="text-2xl">${medals[index]}</div>
                    <div class="flex-1">
                        <p class="font-semibold">${name}</p>
                        <p class="text-xs opacity-70">${data.count} صفقة</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-success">${APP_CORE.formatCurrency(data.sales)}</p>
                        <p class="text-xs opacity-70">ربح: ${APP_CORE.formatCurrency(data.profit)}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    function formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'الآن';
        if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} د`;
        if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} س`;
        if (diffInSeconds < 604800) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
        return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
    }

    return {
        renderEnhancedDashboard
    };
})();

// تحديث APP_PAGES
if (typeof APP_PAGES !== 'undefined') {
    const originalRenderDashboard = APP_PAGES.renderDashboard || (() => '');
    APP_PAGES.renderDashboard = function() {
        const html = APP_DASHBOARD_ENHANCED.renderEnhancedDashboard();
        setTimeout(() => {
            APP_CHARTS.initializeCharts();
        }, 100);
        return html;
    };
}