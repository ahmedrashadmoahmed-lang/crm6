// ==================== النظام الموحد - CRM6 + المحاسبة المصرية ====================
const APP_UNIFIED = (function() {
    'use strict';

    // ==================== Constants ====================
    const UNIFIED_VERSION = '6.0.0';
    const UNIFIED_NAME = 'نظام CRM6 المتكامل مع الذكاء الاصطناعي 🇪🇬';
    
    // ==================== State ====================
    let unifiedState = {
        initialized: false,
        activeSystem: 'egypt', // 'crm6' or 'egypt'
        crm6Ready: false,
        egyptReady: false,
        aiReady: false
    };

    // ==================== Initialize ====================
    function initialize() {
        console.log('%c🚀 تهيئة النظام الموحد', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
        
        // تهيئة نظام CRM6 الأصلي
        if (typeof APP_CORE !== 'undefined') {
            try {
                APP_CORE.initialize();
                unifiedState.crm6Ready = true;
                console.log('✅ نظام CRM6 جاهز');
            } catch (e) {
                console.warn('⚠️ تحذير: مشكلة في تهيئة CRM6', e);
            }
        }
        
        // تهيئة النظام المصري
        if (typeof APP_EGYPT_CORE !== 'undefined') {
            try {
                APP_EGYPT_CORE.initialize();
                unifiedState.egyptReady = true;
                console.log('✅ النظام المصري جاهز');
            } catch (e) {
                console.warn('⚠️ تحذير: مشكلة في تهيئة النظام المصري', e);
            }
        }
        
        // تهيئة محرك AI
        if (typeof APP_AI_ENGINE !== 'undefined') {
            try {
                APP_AI_ENGINE.initialize();
                unifiedState.aiReady = true;
                console.log('✅ محرك AI جاهز');
            } catch (e) {
                console.log('ℹ️ محرك AI غير متاح حالياً');
            }
        }
        
        unifiedState.initialized = true;
        console.log('%c✅ النظام الموحد جاهز! 🎉', 'color: #10b981; font-size: 16px; font-weight: bold;');
        
        return {
            version: UNIFIED_VERSION,
            name: UNIFIED_NAME,
            crm6Ready: unifiedState.crm6Ready,
            egyptReady: unifiedState.egyptReady,
            aiReady: unifiedState.aiReady
        };
    }

    // ==================== Switch System ====================
    function switchSystem(system) {
        if (system !== 'crm6' && system !== 'egypt') {
            console.error('نظام غير صالح:', system);
            return false;
        }
        
        unifiedState.activeSystem = system;
        console.log(`🔄 تم التبديل إلى: ${system === 'crm6' ? 'CRM6 الأصلي' : 'النظام المصري'}`);
        
        // يمكن إضافة منطق لتحديث الواجهة هنا
        if (typeof updateNavigationMenu === 'function') {
            updateNavigationMenu();
        }
        
        return true;
    }

    // ==================== Get All Customers (Unified) ====================
    function getAllCustomers() {
        const customers = [];
        
        // عملاء CRM6
        if (unifiedState.crm6Ready && typeof APP_CORE !== 'undefined') {
            try {
                const crm6Customers = APP_CORE.getCustomers() || [];
                crm6Customers.forEach(customer => {
                    customers.push({
                        ...customer,
                        source: 'crm6',
                        systemName: 'CRM6 الأصلي'
                    });
                });
            } catch (e) {
                console.warn('تحذير: لا يمكن جلب عملاء CRM6', e);
            }
        }
        
        // عملاء النظام المصري
        if (unifiedState.egyptReady && typeof APP_EGYPT_CORE !== 'undefined') {
            try {
                const egyptCustomers = APP_EGYPT_CORE.getData('customers') || [];
                egyptCustomers.forEach(customer => {
                    customers.push({
                        ...customer,
                        source: 'egypt',
                        systemName: 'النظام المصري'
                    });
                });
            } catch (e) {
                console.warn('تحذير: لا يمكن جلب عملاء النظام المصري', e);
            }
        }
        
        return customers;
    }

    // ==================== Get All Sales (Unified) ====================
    function getAllSales() {
        const sales = [];
        
        // مبيعات CRM6
        if (unifiedState.crm6Ready && typeof APP_CORE !== 'undefined') {
            try {
                const crm6Sales = APP_CORE.getInvoices() || [];
                crm6Sales.forEach(sale => {
                    sales.push({
                        ...sale,
                        source: 'crm6',
                        systemName: 'CRM6'
                    });
                });
            } catch (e) {
                console.warn('تحذير: لا يمكن جلب مبيعات CRM6', e);
            }
        }
        
        // مبيعات النظام المصري
        if (unifiedState.egyptReady && typeof APP_EGYPT_CORE !== 'undefined') {
            try {
                const egyptSales = APP_EGYPT_CORE.getData('sales') || [];
                egyptSales.forEach(sale => {
                    sales.push({
                        ...sale,
                        source: 'egypt',
                        systemName: 'النظام المصري'
                    });
                });
            } catch (e) {
                console.warn('تحذير: لا يمكن جلب مبيعات النظام المصري', e);
            }
        }
        
        return sales;
    }

    // ==================== Get All Suppliers (Unified) ====================
    function getAllSuppliers() {
        const suppliers = [];
        
        // موردين CRM6
        if (unifiedState.crm6Ready && typeof APP_CORE !== 'undefined') {
            try {
                const crm6Suppliers = APP_CORE.getSuppliers() || [];
                crm6Suppliers.forEach(supplier => {
                    suppliers.push({
                        ...supplier,
                        source: 'crm6',
                        systemName: 'CRM6'
                    });
                });
            } catch (e) {
                console.warn('تحذير: لا يمكن جلب موردين CRM6', e);
            }
        }
        
        // موردين النظام المصري
        if (unifiedState.egyptReady && typeof APP_EGYPT_CORE !== 'undefined') {
            try {
                const egyptSuppliers = APP_EGYPT_CORE.getData('suppliers') || [];
                egyptSuppliers.forEach(supplier => {
                    suppliers.push({
                        ...supplier,
                        source: 'egypt',
                        systemName: 'النظام المصري'
                    });
                });
            } catch (e) {
                console.warn('تحذير: لا يمكن جلب موردين النظام المصري', e);
            }
        }
        
        return suppliers;
    }

    // ==================== Get Purchases (Egypt System) ====================
    function getAllPurchases() {
        if (!unifiedState.egyptReady || typeof APP_EGYPT_CORE === 'undefined') {
            return [];
        }
        
        try {
            return APP_EGYPT_CORE.getData('purchases') || [];
        } catch (e) {
            console.warn('تحذير: لا يمكن جلب المشتريات', e);
            return [];
        }
    }

    // ==================== Get Expenses (Egypt System) ====================
    function getAllExpenses() {
        if (!unifiedState.egyptReady || typeof APP_EGYPT_CORE === 'undefined') {
            return [];
        }
        
        try {
            return APP_EGYPT_CORE.getData('expenses') || [];
        } catch (e) {
            console.warn('تحذير: لا يمكن جلب المصروفات', e);
            return [];
        }
    }

    // ==================== Calculate Unified Statistics ====================
    function getUnifiedStatistics() {
        const stats = {
            customers: {
                total: 0,
                crm6: 0,
                egypt: 0
            },
            sales: {
                total: 0,
                totalAmount: 0,
                crm6Count: 0,
                egyptCount: 0,
                crm6Amount: 0,
                egyptAmount: 0
            },
            suppliers: {
                total: 0,
                crm6: 0,
                egypt: 0
            },
            purchases: {
                total: 0,
                totalAmount: 0
            },
            expenses: {
                total: 0,
                totalAmount: 0
            }
        };
        
        // إحصائيات العملاء
        const customers = getAllCustomers();
        stats.customers.total = customers.length;
        stats.customers.crm6 = customers.filter(c => c.source === 'crm6').length;
        stats.customers.egypt = customers.filter(c => c.source === 'egypt').length;
        
        // إحصائيات المبيعات
        const sales = getAllSales();
        stats.sales.total = sales.length;
        stats.sales.crm6Count = sales.filter(s => s.source === 'crm6').length;
        stats.sales.egyptCount = sales.filter(s => s.source === 'egypt').length;
        
        // حساب إجمالي المبيعات
        sales.forEach(sale => {
            const amount = sale.total || sale.totalAmount || 0;
            stats.sales.totalAmount += amount;
            if (sale.source === 'crm6') {
                stats.sales.crm6Amount += amount;
            } else {
                stats.sales.egyptAmount += amount;
            }
        });
        
        // إحصائيات الموردين
        const suppliers = getAllSuppliers();
        stats.suppliers.total = suppliers.length;
        stats.suppliers.crm6 = suppliers.filter(s => s.source === 'crm6').length;
        stats.suppliers.egypt = suppliers.filter(s => s.source === 'egypt').length;
        
        // إحصائيات المشتريات (النظام المصري فقط)
        const purchases = getAllPurchases();
        stats.purchases.total = purchases.length;
        stats.purchases.totalAmount = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
        
        // إحصائيات المصروفات (النظام المصري فقط)
        const expenses = getAllExpenses();
        stats.expenses.total = expenses.length;
        stats.expenses.totalAmount = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        
        return stats;
    }

    // ==================== Public API ====================
    return {
        initialize,
        switchSystem,
        getState: () => ({ ...unifiedState }),
        
        // Data Access
        getAllCustomers,
        getAllSales,
        getAllSuppliers,
        getAllPurchases,
        getAllExpenses,
        
        // Statistics
        getUnifiedStatistics,
        
        // Version Info
        version: UNIFIED_VERSION,
        name: UNIFIED_NAME
    };
})();

// تهيئة تلقائية عند تحميل السكريبت
if (typeof window !== 'undefined') {
    window.APP_UNIFIED = APP_UNIFIED;
}
