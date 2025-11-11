// ==================== النواة الأساسية للنظام ====================
const APP_CORE = (function() {
    'use strict';

    // ==================== Constants ====================
    const APP_VERSION = '5.0.0';
    const APP_NAME = 'نظام محاسبي برو';
    
    const STORAGE_KEYS = {
        customers: 'accounting_pro_customers_v5',
        invoices: 'accounting_pro_invoices_v5',
        products: 'accounting_pro_products_v5',
        suppliers: 'accounting_pro_suppliers_v5',
        salesTeam: 'accounting_pro_sales_team_v5',
        opportunities: 'accounting_pro_opportunities_v5',
        salesOrders: 'accounting_pro_sales_orders_v5',
        purchaseOrders: 'accounting_pro_purchase_orders_v5',
        quotations: 'accounting_pro_quotations_v5',
        accounting: 'accounting_pro_accounting_v5',
        settings: 'accounting_pro_settings_v5',
        user: 'accounting_pro_current_user_v5',
        theme: 'accounting_pro_theme',
        notifications: 'accounting_pro_notifications_v5'
    };

    // ==================== State ====================
    let appState = {
        initialized: false,
        currentUser: null,
        currentTheme: 'light',
        notifications: []
    };

    // ==================== Data Store ====================
    let dataStore = {
        customers: [],
        invoices: [],
        products: [],
        suppliers: [],
        salesTeam: [],
        opportunities: [],
        salesOrders: [],
        purchaseOrders: [],
        quotations: [],
        accounting: {
            transactions: [],
            accounts: {
                cash: 100000,
                bank: 250000,
                accountsReceivable: 75000,
                inventory: 150000,
                accountsPayable: 50000,
                equity: 525000
            },
            chartOfAccounts: {
                assets: [
                    { id: 'cash', code: '1010', name: 'النقدية بالصندوق', balance: 100000, type: 'debit' },
                    { id: 'bank', code: '1020', name: 'البنك', balance: 250000, type: 'debit' },
                    { id: 'accounts_receivable', code: '1030', name: 'العملاء (مدينون)', balance: 75000, type: 'debit' },
                    { id: 'inventory', code: '1040', name: 'المخزون', balance: 150000, type: 'debit' }
                ],
                liabilities: [
                    { id: 'accounts_payable', code: '2010', name: 'الموردون (دائنون)', balance: 50000, type: 'credit' },
                    { id: 'loans', code: '2020', name: 'القروض', balance: 80000, type: 'credit' },
                    { id: 'tax_payable', code: '2030', name: 'الضرائب المستحقة', balance: 15000, type: 'credit' }
                ],
                equity: [
                    { id: 'capital', code: '3010', name: 'رأس المال', balance: 400000, type: 'credit' },
                    { id: 'retained_earnings', code: '3020', name: 'الأرباح المحتجزة', balance: 125000, type: 'credit' }
                ],
                revenue: [
                    { id: 'sales', code: '4010', name: 'مبيعات البضائع', balance: 0, type: 'credit' },
                    { id: 'service_income', code: '4020', name: 'إيرادات الخدمات', balance: 0, type: 'credit' }
                ],
                expenses: [
                    { id: 'salaries', code: '5010', name: 'الرواتب والأجور', balance: 0, type: 'debit' },
                    { id: 'rent', code: '5020', name: 'الإيجارات', balance: 0, type: 'debit' },
                    { id: 'utilities', code: '5030', name: 'المرافق', balance: 0, type: 'debit' },
                    { id: 'marketing', code: '5040', name: 'التسويق والإعلان', balance: 0, type: 'debit' },
                    { id: 'taxes', code: '5050', name: 'الضرائب', balance: 0, type: 'debit' }
                ]
            }
        },
        settings: {
            company: {
                name: 'شركة محاسبي برو',
                email: 'info@accounting-pro.com',
                phone: '+966 50 123 4567',
                address: 'الرياض، المملكة العربية السعودية',
                taxNumber: '300000000000003',
                commercialRecord: '1010000000'
            },
            financial: {
                currency: 'SAR',
                currencySymbol: 'ر.س',
                taxRate: 15,
                fiscalYearStart: '01-01',
                invoicePrefix: 'INV-',
                quotationPrefix: 'QUO-',
                salesOrderPrefix: 'SO-',
                purchaseOrderPrefix: 'PO-'
            }
        }
    };

    // ==================== Initialization ====================
    function initialize() {
        showLoadingScreen();
        
        // Load data in sequence
        setTimeout(() => updateLoading('تحميل البيانات الأساسية...', 20), 100);
        setTimeout(() => {
            loadFromStorage();
            updateLoading('تحميل بيانات العملاء...', 40);
        }, 300);
        
        setTimeout(() => updateLoading('تحميل بيانات المبيعات...', 60), 600);
        setTimeout(() => updateLoading('تهيئة النظام المحاسبي...', 80), 900);
        setTimeout(() => {
            updateLoading('اكتمال التحميل...', 100);
            initializeSampleData();
            appState.initialized = true;
            
            setTimeout(() => {
                hideLoadingScreen();
                APP_AUTH.checkLoginStatus();
            }, 500);
        }, 1200);
    }

    function showLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'flex';
    }

    function hideLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'none';
    }

    function updateLoading(text, progress) {
        const textEl = document.getElementById('loading-step');
        const progressEl = document.getElementById('loading-progress');
        
        if (textEl) textEl.textContent = text;
        if (progressEl) progressEl.style.width = progress + '%';
    }

    // ==================== Sample Data ====================
    function initializeSampleData() {
        // Check if data already exists
        if (dataStore.customers.length > 0) return;

        // Customers
        dataStore.customers = [
            {
                id: 'cust_001',
                name: 'شركة التقنية المتطورة',
                type: 'company',
                contactPerson: 'أحمد محمد',
                email: 'ahmed@tech-company.com',
                phone: '+966501234567',
                address: 'الرياض، المملكة العربية السعودية',
                creditLimit: 100000,
                currentBalance: 25000,
                salesAgent: 'sales_agent1',
                status: 'active',
                createdAt: new Date('2025-01-15').toISOString()
            },
            {
                id: 'cust_002',
                name: 'مؤسسة النجاح التجارية',
                type: 'company',
                contactPerson: 'سارة أحمد',
                email: 'sara@alnajah.com',
                phone: '+966502345678',
                address: 'جدة، المملكة العربية السعودية',
                creditLimit: 150000,
                currentBalance: 45000,
                salesAgent: 'sales_agent2',
                status: 'active',
                createdAt: new Date('2025-02-01').toISOString()
            }
        ];

        // Products
        dataStore.products = [
            {
                id: 'prod_001',
                name: 'لابتوب ديل XPS 15',
                sku: 'DELL-XPS15-2024',
                category: 'أجهزة كمبيوتر',
                purchasePrice: 3500,
                sellingPrice: 4500,
                currentStock: 25,
                minStock: 5,
                supplierId: 'supp_001',
                status: 'active'
            },
            {
                id: 'prod_002',
                name: 'طابعة HP LaserJet Pro',
                sku: 'HP-LJ-PRO-M404',
                category: 'طابعات',
                purchasePrice: 800,
                sellingPrice: 1200,
                currentStock: 15,
                minStock: 3,
                supplierId: 'supp_002',
                status: 'active'
            }
        ];

        // Suppliers
        dataStore.suppliers = [
            {
                id: 'supp_001',
                name: 'شركة التقنية للتوريدات',
                contactPerson: 'خالد سعيد',
                email: 'info@tech-supplies.com',
                phone: '+966503456789',
                address: 'الرياض، المملكة العربية السعودية',
                products: ['أجهزة كمبيوتر', 'لابتوبات'],
                paymentTerms: '30 يوم',
                rating: 4.5,
                status: 'active'
            },
            {
                id: 'supp_002',
                name: 'مؤسسة الأجهزة المكتبية',
                contactPerson: 'فاطمة محمد',
                email: 'info@office-devices.com',
                phone: '+966504567890',
                address: 'جدة، المملكة العربية السعودية',
                products: ['طابعات', 'ماسحات ضوئية'],
                paymentTerms: '45 يوم',
                rating: 4.2,
                status: 'active'
            }
        ];

        // Sales Team
        dataStore.salesTeam = [
            {
                id: 'sales_agent1',
                name: 'محمد عبدالله',
                position: 'مندوب مبيعات أول',
                email: 'mohamed@accounting-pro.com',
                phone: '+966505678901',
                department: 'المبيعات',
                target: 500000,
                achieved: 325000,
                commissionRate: 5,
                status: 'active',
                joinDate: '2024-01-15'
            },
            {
                id: 'sales_agent2',
                name: 'سارة علي',
                position: 'مندوبة مبيعات',
                email: 'sara@accounting-pro.com',
                phone: '+966506789012',
                department: 'المبيعات',
                target: 400000,
                achieved: 280000,
                commissionRate: 5,
                status: 'active',
                joinDate: '2024-03-01'
            }
        ];

        // Opportunities
        dataStore.opportunities = [
            {
                id: 'opp_001',
                title: 'توريد أجهزة كمبيوتر - شركة التقنية',
                customerId: 'cust_001',
                salesAgent: 'sales_agent1',
                expectedValue: 75000,
                probability: 70,
                stage: 'negotiation',
                expectedClose: new Date('2025-12-31').toISOString(),
                priority: 'high',
                notes: 'فرصة واعدة - العميل جاد',
                createdAt: new Date('2025-10-01').toISOString()
            }
        ];

        // Sample Accounting Transactions
        dataStore.accounting.transactions = [
            {
                id: 'trn_001',
                date: new Date('2025-11-01').toISOString(),
                type: 'journal_entry',
                description: 'مبيعات نقدية',
                entries: [
                    { account: 'cash', accountName: 'النقدية', debit: 11500, credit: 0 },
                    { account: 'sales', accountName: 'المبيعات', debit: 0, credit: 10000 },
                    { account: 'tax_payable', accountName: 'ضريبة القيمة المضافة', debit: 0, credit: 1500 }
                ],
                reference: 'INV-001',
                status: 'posted',
                createdBy: 'accountant'
            }
        ];

        saveToStorage();
    }

    // ==================== Storage Functions ====================
    function loadFromStorage() {
        try {
            Object.keys(STORAGE_KEYS).forEach(key => {
                const storageKey = STORAGE_KEYS[key];
                const data = localStorage.getItem(storageKey);
                
                if (data) {
                    if (key === 'theme') {
                        appState.currentTheme = data;
                    } else if (key === 'user') {
                        appState.currentUser = JSON.parse(data);
                    } else if (dataStore.hasOwnProperty(key)) {
                        dataStore[key] = JSON.parse(data);
                    }
                }
            });
        } catch (error) {
            console.error('Error loading from storage:', error);
            showToast('حدث خطأ في تحميل البيانات', 'error');
        }
    }

    function saveToStorage() {
        try {
            Object.keys(STORAGE_KEYS).forEach(key => {
                const storageKey = STORAGE_KEYS[key];
                
                if (key === 'theme') {
                    localStorage.setItem(storageKey, appState.currentTheme);
                } else if (key === 'user' && appState.currentUser) {
                    localStorage.setItem(storageKey, JSON.stringify(appState.currentUser));
                } else if (dataStore.hasOwnProperty(key)) {
                    localStorage.setItem(storageKey, JSON.stringify(dataStore[key]));
                }
            });
        } catch (error) {
            console.error('Error saving to storage:', error);
            showToast('حدث خطأ في حفظ البيانات', 'error');
        }
    }

    // ==================== Data Access Functions ====================
    function getData(key) {
        return dataStore[key] || null;
    }

    function setData(key, value) {
        if (dataStore.hasOwnProperty(key)) {
            dataStore[key] = value;
            saveToStorage();
            return true;
        }
        return false;
    }

    function addItem(collection, item) {
        if (dataStore.hasOwnProperty(collection) && Array.isArray(dataStore[collection])) {
            dataStore[collection].push(item);
            saveToStorage();
            return true;
        }
        return false;
    }

    function updateItem(collection, itemId, updates) {
        if (dataStore.hasOwnProperty(collection) && Array.isArray(dataStore[collection])) {
            const index = dataStore[collection].findIndex(item => item.id === itemId);
            if (index !== -1) {
                dataStore[collection][index] = { ...dataStore[collection][index], ...updates };
                saveToStorage();
                return true;
            }
        }
        return false;
    }

    function deleteItem(collection, itemId) {
        if (dataStore.hasOwnProperty(collection) && Array.isArray(dataStore[collection])) {
            dataStore[collection] = dataStore[collection].filter(item => item.id !== itemId);
            saveToStorage();
            return true;
        }
        return false;
    }

    // ==================== Utility Functions ====================
    function generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

       function formatCurrency(amount, options = {}) {
        const settings = getData('settings') || {};
        const currency = settings.financial?.currency || 'EGP';
        const symbol = currency === 'EGP' ? 'ج.م' : '$';
        
        if (amount === null || amount === undefined || isNaN(amount)) {
            amount = 0;
        }

        const decimals = options.decimals !== undefined ? options.decimals : 2;
        const formatted = Math.abs(amount)
            .toFixed(decimals)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return (amount < 0 ? '-' : '') + formatted + ' ' + symbol;
    }

    function formatDate(dateString, format = 'full') {
        const date = new Date(dateString);
        
        if (format === 'short') {
            return date.toLocaleDateString('ar-EG');
        } else if (format === 'time') {
            return date.toLocaleTimeString('ar-EG');
        } else {
            return date.toLocaleString('ar-EG');
        }
    }

    function showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `alert alert-${type} shadow-lg animate-slide-in`;
        
        const icons = {
            info: 'bi-info-circle',
            success: 'bi-check-circle',
            warning: 'bi-exclamation-triangle',
            error: 'bi-x-circle'
        };

        toast.innerHTML = `
            <div>
                <i class="bi ${icons[type]}"></i>
                <span>${message}</span>
            </div>
            <button class="btn btn-sm btn-ghost" onclick="this.parentElement.remove()">
                <i class="bi bi-x"></i>
            </button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    function exportData() {
        try {
            const exportData = {
                version: APP_VERSION,
                exportDate: new Date().toISOString(),
                data: dataStore
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `accounting-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showToast('تم تصدير البيانات بنجاح', 'success');
        } catch (error) {
            console.error('Export error:', error);
            showToast('حدث خطأ في تصدير البيانات', 'error');
        }
    }

    function importData() {
        const fileInput = document.getElementById('import-file');
        const file = fileInput?.files[0];
        
        if (!file) {
            showToast('يرجى اختيار ملف', 'warning');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (!importedData.data) {
                    throw new Error('Invalid data format');
                }

                if (confirm('هل تريد استبدال جميع البيانات الحالية؟')) {
                    dataStore = importedData.data;
                    saveToStorage();
                    showToast('تم استيراد البيانات بنجاح', 'success');
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            } catch (error) {
                console.error('Import error:', error);
                showToast('خطأ في تنسيق الملف', 'error');
            }
        };
        
        reader.readAsText(file);
    }

    function showBackupModal() {
        document.getElementById('backupModal')?.showModal();
    }

    // ==================== Public API ====================
    return {
        initialize,
        getData,
        setData,
        addItem,
        updateItem,
        deleteItem,
        generateId,
        formatCurrency,
        formatDate,
        showToast,
        exportData,
        importData,
        showBackupModal,
        get appState() { return appState; },
        get version() { return APP_VERSION; }
    };
})();

if (typeof APP_CORE !== 'undefined') {
    console.log('✅ APP_CORE تم تعريفه بنجاح');
} else {
    console.error('❌ فشل تعريف APP_CORE');
}