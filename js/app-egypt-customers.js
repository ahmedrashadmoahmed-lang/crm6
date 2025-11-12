// ==================== إدارة العملاء المصري ====================
const APP_EGYPT_CUSTOMERS = (function() {
    'use strict';

    // ==================== Real Customer Data ====================
    const REAL_CUSTOMERS_DATA = [
        {
            id: 'C-202103',
            code: 'C-202103',
            name: 'جمعية رجال الأعمال',
            nameEn: 'Businessmen Association',
            phone: '+20 10 1234 5678',
            email: 'info@businessmen-assoc.eg',
            address: 'القاهرة، مصر',
            taxNumber: 'TAX-202103',
            totalInvoices: 8,
            totalSales: 59151,
            totalPaid: 48960,
            balance: 10191,
            rating: 'good',
            paymentTerms: 30,
            notes: '8 فواتير، 59,151 ج.م، محصل 48,960 ج.م',
            status: 'active',
            createdAt: '2021-03-01'
        },
        {
            id: 'C-202105',
            code: 'C-202105',
            name: 'مركز القلب الدولي',
            nameEn: 'International Heart Center',
            phone: '+20 10 2345 6789',
            email: 'info@heart-center.eg',
            address: 'الجيزة، مصر',
            taxNumber: 'TAX-202105',
            totalInvoices: 5,
            totalSales: 45000,
            totalPaid: 45000,
            balance: 0,
            rating: 'excellent',
            paymentTerms: 30,
            notes: 'تقييم ممتاز، دفع خلال شهر',
            status: 'active',
            createdAt: '2021-05-01'
        },
        {
            id: 'C-202107',
            code: 'C-202107',
            name: 'شركة التجارة المتحدة',
            nameEn: 'United Trading Company',
            phone: '+20 10 3456 7890',
            email: 'info@united-trading.eg',
            address: 'الإسكندرية، مصر',
            taxNumber: 'TAX-202107',
            totalInvoices: 3,
            totalSales: 28000,
            totalPaid: 20000,
            balance: 8000,
            rating: 'good',
            paymentTerms: 60,
            notes: 'عميل جيد، دفعات منتظمة',
            status: 'active',
            createdAt: '2021-07-01'
        },
        {
            id: 'C-202109',
            code: 'C-202109',
            name: 'مستشفى النور',
            nameEn: 'Al Noor Hospital',
            phone: '+20 10 4567 8901',
            email: 'info@alnoor-hospital.eg',
            address: 'المنصورة، مصر',
            taxNumber: 'TAX-202109',
            totalInvoices: 6,
            totalSales: 52000,
            totalPaid: 52000,
            balance: 0,
            rating: 'excellent',
            paymentTerms: 15,
            notes: 'عميل ممتاز، دفع سريع',
            status: 'active',
            createdAt: '2021-09-01'
        },
        {
            id: 'C-202111',
            code: 'C-202111',
            name: 'معهد التدريب المهني',
            nameEn: 'Vocational Training Institute',
            phone: '+20 10 5678 9012',
            email: 'info@training-institute.eg',
            address: 'طنطا، مصر',
            taxNumber: 'TAX-202111',
            totalInvoices: 4,
            totalSales: 35000,
            totalPaid: 30000,
            balance: 5000,
            rating: 'good',
            paymentTerms: 45,
            notes: 'عميل جديد، أداء جيد',
            status: 'active',
            createdAt: '2021-11-01'
        }
    ];

    // ==================== Initialize ====================
    function initialize() {
        console.log('👥 تهيئة نظام العملاء المصري...');
        
        // Load existing customers or use sample data
        let customers = APP_EGYPT_CORE.getData('customers');
        if (!customers || customers.length === 0) {
            console.log('📥 تحميل البيانات النموذجية للعملاء');
            customers = REAL_CUSTOMERS_DATA;
            APP_EGYPT_CORE.saveData('customers', customers);
        }
        
        return {
            initialized: true,
            count: customers.length,
            totalReceivables: calculateTotalReceivables()
        };
    }

    // ==================== Create Customer ====================
    function createCustomer(data) {
        const customers = APP_EGYPT_CORE.getData('customers');
        
        const customer = {
            id: APP_EGYPT_CORE.generateId('C-'),
            code: data.code || `C-${Date.now()}`,
            name: data.name,
            nameEn: data.nameEn || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            taxNumber: data.taxNumber || '',
            totalInvoices: 0,
            totalSales: 0,
            totalPaid: 0,
            balance: 0,
            rating: data.rating || 'new',
            paymentTerms: data.paymentTerms || 30,
            notes: data.notes || '',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        customers.push(customer);
        APP_EGYPT_CORE.saveData('customers', customers);
        
        return customer;
    }

    // ==================== Update Customer ====================
    function updateCustomer(id, updates) {
        const customers = APP_EGYPT_CORE.getData('customers');
        const index = customers.findIndex(c => c.id === id);
        
        if (index === -1) {
            return { success: false, message: 'العميل غير موجود' };
        }
        
        customers[index] = {
            ...customers[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        APP_EGYPT_CORE.saveData('customers', customers);
        
        return { success: true, customer: customers[index] };
    }

    // ==================== Delete Customer ====================
    function deleteCustomer(id) {
        const customers = APP_EGYPT_CORE.getData('customers');
        const index = customers.findIndex(c => c.id === id);
        
        if (index === -1) {
            return { success: false, message: 'العميل غير موجود' };
        }
        
        // Check if customer has invoices
        const customer = customers[index];
        if (customer.totalInvoices > 0) {
            return { 
                success: false, 
                message: 'لا يمكن حذف عميل لديه فواتير. يرجى حذف الفواتير أولاً.' 
            };
        }
        
        customers.splice(index, 1);
        APP_EGYPT_CORE.saveData('customers', customers);
        
        return { success: true, message: 'تم حذف العميل' };
    }

    // ==================== Get Customers ====================
    function getAllCustomers(filters = {}) {
        let customers = APP_EGYPT_CORE.getData('customers');
        
        // Apply filters
        if (filters.status) {
            customers = customers.filter(c => c.status === filters.status);
        }
        
        if (filters.rating) {
            customers = customers.filter(c => c.rating === filters.rating);
        }
        
        if (filters.search) {
            const search = filters.search.toLowerCase();
            customers = customers.filter(c => 
                c.name.toLowerCase().includes(search) ||
                c.code.toLowerCase().includes(search) ||
                (c.phone && c.phone.includes(search))
            );
        }
        
        // Sort by name
        customers.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        
        return customers;
    }

    function getCustomerById(id) {
        const customers = APP_EGYPT_CORE.getData('customers');
        return customers.find(c => c.id === id);
    }

    // ==================== Statistics ====================
    function calculateTotalReceivables() {
        const customers = getAllCustomers();
        return customers.reduce((sum, c) => sum + (c.balance || 0), 0);
    }

    function getCustomerStatistics() {
        const customers = getAllCustomers();
        
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        const totalReceivables = calculateTotalReceivables();
        const excellentCustomers = customers.filter(c => c.rating === 'excellent').length;
        
        return {
            totalCustomers,
            activeCustomers,
            totalReceivables,
            excellentCustomers,
            averageBalance: totalCustomers > 0 ? totalReceivables / totalCustomers : 0
        };
    }

    // ==================== Customer Statement ====================
    function getCustomerStatement(customerId, dateFrom, dateTo) {
        const customer = getCustomerById(customerId);
        if (!customer) {
            return null;
        }
        
        let sales = [];
        if (window.APP_EGYPT_SALES) {
            sales = APP_EGYPT_SALES.getAllSales({ 
                customerId, 
                dateFrom, 
                dateTo 
            });
        }
        
        return {
            customer,
            sales,
            summary: {
                totalInvoices: sales.length,
                totalAmount: sales.reduce((sum, s) => sum + s.total, 0),
                paidAmount: sales.filter(s => s.status === 'paid')
                    .reduce((sum, s) => sum + s.total, 0),
                pendingAmount: sales.filter(s => s.status === 'pending')
                    .reduce((sum, s) => sum + s.total, 0)
            }
        };
    }

    // ==================== Update Customer Balance ====================
    function updateCustomerBalance(customerId, amount, increment = true) {
        const customers = APP_EGYPT_CORE.getData('customers');
        const customer = customers.find(c => c.id === customerId);
        
        if (customer) {
            if (increment) {
                customer.balance = (customer.balance || 0) + amount;
                customer.totalSales = (customer.totalSales || 0) + amount;
                customer.totalInvoices = (customer.totalInvoices || 0) + 1;
            } else {
                customer.balance = amount;
            }
            
            APP_EGYPT_CORE.saveData('customers', customers);
            return true;
        }
        
        return false;
    }

    function recordPayment(customerId, amount) {
        const customers = APP_EGYPT_CORE.getData('customers');
        const customer = customers.find(c => c.id === customerId);
        
        if (customer) {
            customer.balance = (customer.balance || 0) - amount;
            customer.totalPaid = (customer.totalPaid || 0) + amount;
            
            APP_EGYPT_CORE.saveData('customers', customers);
            return true;
        }
        
        return false;
    }

    // ==================== Render Customers List ====================
    function renderCustomersList(containerId = 'customers-list') {
        const customers = getAllCustomers();
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        if (customers.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="bi bi-people text-6xl text-gray-300"></i>
                    <p class="mt-4 text-gray-500">لا يوجد عملاء</p>
                </div>
            `;
            return;
        }
        
        const html = customers.map(customer => {
            const ratingBadge = {
                'excellent': '<span class="badge badge-success">ممتاز</span>',
                'good': '<span class="badge badge-info">جيد</span>',
                'average': '<span class="badge badge-warning">متوسط</span>',
                'poor': '<span class="badge badge-error">ضعيف</span>',
                'new': '<span class="badge badge-ghost">جديد</span>'
            };
            
            return `
                <tr>
                    <td>${customer.code}</td>
                    <td>${customer.name}</td>
                    <td>${customer.phone || '-'}</td>
                    <td>${customer.totalInvoices}</td>
                    <td>${APP_EGYPT_CORE.formatCurrency(customer.totalSales)}</td>
                    <td>${APP_EGYPT_CORE.formatCurrency(customer.totalPaid)}</td>
                    <td class="${customer.balance > 0 ? 'text-error' : 'text-success'} font-bold">
                        ${APP_EGYPT_CORE.formatCurrency(customer.balance)}
                    </td>
                    <td>${ratingBadge[customer.rating] || ratingBadge['new']}</td>
                    <td>
                        <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_CUSTOMERS.viewCustomer('${customer.id}')">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_CUSTOMERS.editCustomer('${customer.id}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        
        container.innerHTML = html;
    }

    // ==================== Public API ====================
    return {
        initialize,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        getAllCustomers,
        getCustomerById,
        calculateTotalReceivables,
        getCustomerStatistics,
        getCustomerStatement,
        updateCustomerBalance,
        recordPayment,
        renderCustomersList,
        REAL_CUSTOMERS_DATA
    };
})();

// Log when loaded
if (typeof window !== 'undefined') {
    console.log('🇪🇬 نظام العملاء المصري جاهز');
}
