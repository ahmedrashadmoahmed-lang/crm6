// ==================== النواة الأساسية للنظام المصري ====================
const APP_EGYPT_CORE = (function() {
    'use strict';

    // ==================== Constants ====================
    const EGYPT_VERSION = '6.0.0';
    const EGYPT_NAME = 'نظام محاسبي مصري متكامل - CRM6';
    
    const STORAGE_KEYS = {
        sales: 'egypt_crm6_sales',
        purchases: 'egypt_crm6_purchases',
        customers: 'egypt_crm6_customers',
        suppliers: 'egypt_crm6_suppliers',
        expenses: 'egypt_crm6_expenses',
        guarantees: 'egypt_crm6_guarantees',
        cashbox: 'egypt_crm6_cashbox',
        custody: 'egypt_crm6_custody',
        payroll: 'egypt_crm6_payroll',
        partners: 'egypt_crm6_partners',
        settings: 'egypt_crm6_settings'
    };

    // ==================== State ====================
    let egyptState = {
        initialized: false,
        currency: 'EGP',
        currencySymbol: 'ج.م',
        locale: 'ar-EG',
        taxRate: {
            vat: 0.14,        // ضريبة القيمة المضافة 14%
            incomeTax: 0.01   // ضريبة الأرباح التجارية 1%
        }
    };

    // ==================== Data Store ====================
    let egyptData = {
        sales: [],
        purchases: [],
        customers: [],
        suppliers: [],
        expenses: [],
        guarantees: [],
        cashbox: [],
        custody: [],
        payroll: [],
        partners: [],
        settings: {
            company: {
                name: 'شركة محاسبي برو - مصر',
                nameEn: 'Accounting Pro Company - Egypt',
                taxNumber: '123-456-789',
                commercialRecord: '12345',
                address: 'القاهرة، مصر',
                phone: '+20 10 1234 5678',
                email: 'info@accounting-pro.eg'
            },
            fiscal: {
                year: 2025,
                startDate: '2025-01-01',
                endDate: '2025-12-31'
            }
        }
    };

    // ==================== Initialize ====================
    function initialize() {
        console.log('🇪🇬 تهيئة النظام المصري...');
        
        // Load data from localStorage
        loadAllData();
        
        egyptState.initialized = true;
        console.log('✅ تم تهيئة النظام المصري بنجاح');
        
        return {
            version: EGYPT_VERSION,
            name: EGYPT_NAME,
            initialized: true
        };
    }

    // ==================== Data Management ====================
    function loadAllData() {
        for (const key in STORAGE_KEYS) {
            const storageKey = STORAGE_KEYS[key];
            const data = localStorage.getItem(storageKey);
            if (data) {
                try {
                    egyptData[key] = JSON.parse(data);
                } catch (e) {
                    console.error(`خطأ في تحميل ${key}:`, e);
                }
            }
        }
    }

    function saveData(key, data) {
        if (!STORAGE_KEYS[key]) {
            console.error(`مفتاح غير صالح: ${key}`);
            return false;
        }
        
        egyptData[key] = data;
        localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
        return true;
    }

    function getData(key) {
        return egyptData[key] || (Array.isArray(egyptData[key]) ? [] : {});
    }

    // ==================== Formatting Utilities ====================
    function formatCurrency(amount, showSymbol = true) {
        if (amount === null || amount === undefined || isNaN(amount)) {
            amount = 0;
        }
        
        const formatted = new Intl.NumberFormat('ar-EG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
        
        return showSymbol ? `${formatted} ${egyptState.currencySymbol}` : formatted;
    }

    function formatDate(date, format = 'full') {
        if (!date) return '';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        
        const options = {
            full: { year: 'numeric', month: 'long', day: 'numeric' },
            short: { year: 'numeric', month: '2-digit', day: '2-digit' },
            medium: { year: 'numeric', month: 'short', day: 'numeric' }
        };
        
        return d.toLocaleDateString('ar-EG', options[format] || options.full);
    }

    function formatNumber(number, decimals = 2) {
        if (number === null || number === undefined || isNaN(number)) {
            number = 0;
        }
        
        return new Intl.NumberFormat('ar-EG', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    }

    // ==================== ID Generation ====================
    function generateId(prefix = '') {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `${prefix}${timestamp}${random}`;
    }

    function generateInvoiceNumber(type = 'sales') {
        const prefix = type === 'sales' ? 'INV-S-' : 'INV-P-';
        const year = new Date().getFullYear();
        const items = getData(type);
        const count = items.length + 1;
        return `${prefix}${year}-${String(count).padStart(4, '0')}`;
    }

    // ==================== Statistics ====================
    function calculateStatistics() {
        const sales = getData('sales');
        const purchases = getData('purchases');
        const expenses = getData('expenses');
        const customers = getData('customers');
        const suppliers = getData('suppliers');
        
        // Sales totals
        const totalSales = sales.reduce((sum, inv) => sum + (inv.total || 0), 0);
        const totalSalesVAT = sales.reduce((sum, inv) => sum + (inv.vat || 0), 0);
        const totalSalesIncomeTax = sales.reduce((sum, inv) => sum + (inv.incomeTax || 0), 0);
        
        // Purchases totals
        const totalPurchases = purchases.reduce((sum, inv) => sum + (inv.total || 0), 0);
        const totalPurchasesVAT = purchases.reduce((sum, inv) => sum + (inv.vat || 0), 0);
        
        // Expenses
        const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        
        // Profit/Loss
        const grossProfit = totalSales - totalPurchases;
        const netProfit = grossProfit - totalExpenses;
        
        // Customer balances
        const totalReceivables = customers.reduce((sum, cust) => sum + (cust.balance || 0), 0);
        
        // Supplier balances
        const totalPayables = suppliers.reduce((sum, supp) => sum + (supp.balance || 0), 0);
        
        return {
            sales: {
                count: sales.length,
                total: totalSales,
                vat: totalSalesVAT,
                incomeTax: totalSalesIncomeTax
            },
            purchases: {
                count: purchases.length,
                total: totalPurchases,
                vat: totalPurchasesVAT
            },
            expenses: {
                count: expenses.length,
                total: totalExpenses
            },
            profit: {
                gross: grossProfit,
                net: netProfit
            },
            customers: {
                count: customers.length,
                receivables: totalReceivables
            },
            suppliers: {
                count: suppliers.length,
                payables: totalPayables
            }
        };
    }

    // ==================== Export ====================
    function exportData() {
        const exportData = {
            version: EGYPT_VERSION,
            exportDate: new Date().toISOString(),
            data: egyptData
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportName = `egypt-crm6-backup-${Date.now()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        linkElement.click();
        
        return exportName;
    }

    function importData(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            
            if (!imported.data) {
                throw new Error('بيانات غير صالحة');
            }
            
            // Merge or replace data
            for (const key in imported.data) {
                if (STORAGE_KEYS[key]) {
                    egyptData[key] = imported.data[key];
                    saveData(key, imported.data[key]);
                }
            }
            
            return {
                success: true,
                message: 'تم استيراد البيانات بنجاح'
            };
        } catch (e) {
            console.error('خطأ في استيراد البيانات:', e);
            return {
                success: false,
                message: 'فشل استيراد البيانات: ' + e.message
            };
        }
    }

    // ==================== Public API ====================
    return {
        initialize,
        
        // Data management
        saveData,
        getData,
        loadAllData,
        
        // Formatting
        formatCurrency,
        formatDate,
        formatNumber,
        
        // ID generation
        generateId,
        generateInvoiceNumber,
        
        // Statistics
        calculateStatistics,
        
        // Import/Export
        exportData,
        importData,
        
        // State access
        getState: () => egyptState,
        getVersion: () => EGYPT_VERSION,
        getName: () => EGYPT_NAME
    };
})();

// Auto-initialize on load
if (typeof window !== 'undefined') {
    console.log('🇪🇬 النظام المصري جاهز للتهيئة');
}
