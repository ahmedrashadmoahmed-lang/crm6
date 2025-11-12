// ==================== إدارة العملاء المصري ====================
const APP_EGYPT_CUSTOMERS = (function() {
    'use strict';

    // ==================== Real Customer Data ====================
    const REAL_CUSTOMERS_DATA = [
    {
        id: 'C-202110',
        code: 'C-202110',
        name: 'شركة الاسكندرية لتوزيع الكهرباء',
        nameEn: 'شركة الاسكندرية لتوزيع الكهرباء',
        phone: '+20 10 1234 5000',
        email: 'info@customer0.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202110',
        totalInvoices: 15,
        totalSales: 328456.14,
        totalPaid: 311779.8,
        balance: 16676.34,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'متبقي 16676.34 ج.م',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202103',
        code: 'C-202103',
        name: 'جمعية رجال الاعمال',
        nameEn: 'جمعية رجال الاعمال',
        phone: '+20 10 1234 5001',
        email: 'info@customer1.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202103',
        totalInvoices: 8,
        totalSales: 67662.13,
        totalPaid: 63190.56,
        balance: 4471.57,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'متبقي 4471.57 ج.م',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202189',
        code: 'C-202189',
        name: 'Newtrac Trading',
        nameEn: 'Newtrac Trading',
        phone: '+20 10 1234 5002',
        email: 'info@customer2.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202189',
        totalInvoices: 9,
        totalSales: 178317.93,
        totalPaid: 169303.26,
        balance: 9014.67,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'متبقي 9014.67 ج.م',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202174',
        code: 'C-202174',
        name: 'مستشفي سموحة الدولي',
        nameEn: 'مستشفي سموحة الدولي',
        phone: '+20 10 1234 5003',
        email: 'info@customer3.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202174',
        totalInvoices: 7,
        totalSales: 162199.82,
        totalPaid: 162199.82,
        balance: 0,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202122',
        code: 'C-202122',
        name: 'شركة صقر للأغذية',
        nameEn: 'شركة صقر للأغذية',
        phone: '+20 10 1234 5004',
        email: 'info@customer4.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202122',
        totalInvoices: 6,
        totalSales: 136606.71,
        totalPaid: 127136.44,
        balance: 9470.27,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'متبقي 9470.27 ج.م',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202121',
        code: 'C-202121',
        name: 'الإسكندرية للمنتجات البترولية - اسبك',
        nameEn: 'الإسكندرية للمنتجات البترولية - اسبك',
        phone: '+20 10 1234 5005',
        email: 'info@customer5.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202121',
        totalInvoices: 5,
        totalSales: 100641.67,
        totalPaid: 100326.19,
        balance: 315.48,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'متبقي 315.48 ج.م',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202145',
        code: 'C-202145',
        name: 'مستشفى الجامعة',
        nameEn: 'مستشفى الجامعة',
        phone: '+20 10 1234 5006',
        email: 'info@customer6.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202145',
        totalInvoices: 4,
        totalSales: 79291.07,
        totalPaid: 71588.4,
        balance: 7702.67,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'متبقي 7702.67 ج.م',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202156',
        code: 'C-202156',
        name: 'شركة التصنيع الحديثة',
        nameEn: 'شركة التصنيع الحديثة',
        phone: '+20 10 1234 5007',
        email: 'info@customer7.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202156',
        totalInvoices: 4,
        totalSales: 92482.81,
        totalPaid: 79330.76,
        balance: 13152.05,
        rating: 'good',
        paymentTerms: 30,
        notes: 'متبقي 13152.05 ج.م',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202167',
        code: 'C-202167',
        name: 'مركز الأعمال الدولي',
        nameEn: 'مركز الأعمال الدولي',
        phone: '+20 10 1234 5008',
        email: 'info@customer8.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202167',
        totalInvoices: 3,
        totalSales: 85933.92,
        totalPaid: 85933.92,
        balance: 0,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202178',
        code: 'C-202178',
        name: 'شركة المستقبل للتجارة',
        nameEn: 'شركة المستقبل للتجارة',
        phone: '+20 10 1234 5009',
        email: 'info@customer9.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202178',
        totalInvoices: 3,
        totalSales: 70197.64,
        totalPaid: 67365.92,
        balance: 2831.72,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'متبقي 2831.72 ج.م',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202188',
        code: 'C-202188',
        name: 'المجموعة الطبية المتحدة',
        nameEn: 'المجموعة الطبية المتحدة',
        phone: '+20 10 1234 5010',
        email: 'info@customer10.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202188',
        totalInvoices: 3,
        totalSales: 66118.24,
        totalPaid: 62260.27,
        balance: 3857.97,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'متبقي 3857.97 ج.م',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202199',
        code: 'C-202199',
        name: 'شركة الأمل للاستثمار',
        nameEn: 'شركة الأمل للاستثمار',
        phone: '+20 10 1234 5011',
        email: 'info@customer11.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202199',
        totalInvoices: 2,
        totalSales: 58621.68,
        totalPaid: 58621.68,
        balance: 0,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202201',
        code: 'C-202201',
        name: 'مؤسسة التقدم التجارية',
        nameEn: 'مؤسسة التقدم التجارية',
        phone: '+20 10 1234 5012',
        email: 'info@customer12.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202201',
        totalInvoices: 2,
        totalSales: 52138.37,
        totalPaid: 52138.37,
        balance: 0,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202212',
        code: 'C-202212',
        name: 'شركة الرائد للصناعات',
        nameEn: 'شركة الرائد للصناعات',
        phone: '+20 10 1234 5013',
        email: 'info@customer13.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202212',
        totalInvoices: 2,
        totalSales: 38507.83,
        totalPaid: 38507.83,
        balance: 0,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202223',
        code: 'C-202223',
        name: 'المركز التجاري الشامل',
        nameEn: 'المركز التجاري الشامل',
        phone: '+20 10 1234 5014',
        email: 'info@customer14.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202223',
        totalInvoices: 2,
        totalSales: 28030.94,
        totalPaid: 26263.33,
        balance: 1767.61,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'متبقي 1767.61 ج.م',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202234',
        code: 'C-202234',
        name: 'شركة النجاح المستدام',
        nameEn: 'شركة النجاح المستدام',
        phone: '+20 10 1234 5015',
        email: 'info@customer15.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202234',
        totalInvoices: 1,
        totalSales: 20564.31,
        totalPaid: 20564.31,
        balance: 0,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'C-202245',
        code: 'C-202245',
        name: 'مجموعة الابتكار التجارية',
        nameEn: 'مجموعة الابتكار التجارية',
        phone: '+20 10 1234 5016',
        email: 'info@customer16.eg',
        address: 'الإسكندرية، مصر',
        taxNumber: 'TAX-C-202245',
        totalInvoices: 1,
        totalSales: 20946.2,
        totalPaid: 20946.2,
        balance: 0,
        rating: 'vip',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
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
