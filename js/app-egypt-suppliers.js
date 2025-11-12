// ==================== إدارة الموردين المصري ====================
const APP_EGYPT_SUPPLIERS = (function() {
    'use strict';

    // ==================== Real Supplier Data ====================
    const REAL_SUPPLIERS_DATA = [
        {
            id: 'S-202101',
            code: 'S-202101',
            name: 'شرق آسيا',
            nameEn: 'East Asia',
            phone: '+20 10 1111 2222',
            email: 'info@eastasia.eg',
            address: 'القاهرة، مصر',
            taxNumber: 'TAX-S-202101',
            totalInvoices: 15,
            totalPurchases: 98324,
            totalPaid: 0,
            balance: 98324,
            rating: 'good',
            paymentTerms: 30,
            notes: 'مورد رئيسي - 98,324 ج.م مستحق',
            status: 'active',
            createdAt: '2021-01-01'
        },
        {
            id: 'S-202102',
            code: 'S-202102',
            name: 'الحمد ستور',
            nameEn: 'Al Hamd Store',
            phone: '+20 10 2222 3333',
            email: 'info@alhamd-store.eg',
            address: 'الجيزة، مصر',
            taxNumber: 'TAX-S-202102',
            totalInvoices: 8,
            totalPurchases: 23691,
            totalPaid: 0,
            balance: 23691,
            rating: 'good',
            paymentTerms: 45,
            notes: 'مورد موثوق - 23,691 ج.م مستحق',
            status: 'active',
            createdAt: '2021-02-01'
        },
        {
            id: 'S-202134',
            code: 'S-202134',
            name: 'كرنفال',
            nameEn: 'Carnival',
            phone: '+20 10 3333 4444',
            email: 'info@carnival.eg',
            address: 'الإسكندرية، مصر',
            taxNumber: 'TAX-S-202134',
            totalInvoices: 12,
            totalPurchases: 45000,
            totalPaid: 45000,
            balance: 0,
            rating: 'excellent',
            paymentTerms: 30,
            notes: 'مدفوع بالكامل - أداء ممتاز',
            status: 'active',
            createdAt: '2021-03-01'
        },
        {
            id: 'S-202104',
            code: 'S-202104',
            name: 'كيمو ستور',
            nameEn: 'Kimo Store',
            phone: '+20 10 4444 5555',
            email: 'info@kimo-store.eg',
            address: 'المنصورة، مصر',
            taxNumber: 'TAX-S-202104',
            totalInvoices: 5,
            totalPurchases: 7796,
            totalPaid: 0,
            balance: 7796,
            rating: 'good',
            paymentTerms: 60,
            notes: 'مورد صغير - 7,796 ج.م مستحق',
            status: 'active',
            createdAt: '2021-04-01'
        }
    ];

    // ==================== Initialize ====================
    function initialize() {
        console.log('🏭 تهيئة نظام الموردين المصري...');
        
        // Load existing suppliers or use sample data
        let suppliers = APP_EGYPT_CORE.getData('suppliers');
        if (!suppliers || suppliers.length === 0) {
            console.log('📥 تحميل البيانات النموذجية للموردين');
            suppliers = REAL_SUPPLIERS_DATA;
            APP_EGYPT_CORE.saveData('suppliers', suppliers);
        }
        
        return {
            initialized: true,
            count: suppliers.length,
            totalPayables: calculateTotalPayables()
        };
    }

    // ==================== Create Supplier ====================
    function createSupplier(data) {
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        
        const supplier = {
            id: APP_EGYPT_CORE.generateId('S-'),
            code: data.code || `S-${Date.now()}`,
            name: data.name,
            nameEn: data.nameEn || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            taxNumber: data.taxNumber || '',
            totalInvoices: 0,
            totalPurchases: 0,
            totalPaid: 0,
            balance: 0,
            rating: data.rating || 'new',
            paymentTerms: data.paymentTerms || 30,
            notes: data.notes || '',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        suppliers.push(supplier);
        APP_EGYPT_CORE.saveData('suppliers', suppliers);
        
        return supplier;
    }

    // ==================== Update Supplier ====================
    function updateSupplier(id, updates) {
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        const index = suppliers.findIndex(s => s.id === id);
        
        if (index === -1) {
            return { success: false, message: 'المورد غير موجود' };
        }
        
        suppliers[index] = {
            ...suppliers[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        APP_EGYPT_CORE.saveData('suppliers', suppliers);
        
        return { success: true, supplier: suppliers[index] };
    }

    // ==================== Delete Supplier ====================
    function deleteSupplier(id) {
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        const index = suppliers.findIndex(s => s.id === id);
        
        if (index === -1) {
            return { success: false, message: 'المورد غير موجود' };
        }
        
        // Check if supplier has invoices
        const supplier = suppliers[index];
        if (supplier.totalInvoices > 0) {
            return { 
                success: false, 
                message: 'لا يمكن حذف مورد لديه فواتير. يرجى حذف الفواتير أولاً.' 
            };
        }
        
        suppliers.splice(index, 1);
        APP_EGYPT_CORE.saveData('suppliers', suppliers);
        
        return { success: true, message: 'تم حذف المورد' };
    }

    // ==================== Get Suppliers ====================
    function getAllSuppliers(filters = {}) {
        let suppliers = APP_EGYPT_CORE.getData('suppliers');
        
        // Apply filters
        if (filters.status) {
            suppliers = suppliers.filter(s => s.status === filters.status);
        }
        
        if (filters.rating) {
            suppliers = suppliers.filter(s => s.rating === filters.rating);
        }
        
        if (filters.search) {
            const search = filters.search.toLowerCase();
            suppliers = suppliers.filter(s => 
                s.name.toLowerCase().includes(search) ||
                s.code.toLowerCase().includes(search) ||
                (s.phone && s.phone.includes(search))
            );
        }
        
        // Sort by name
        suppliers.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        
        return suppliers;
    }

    function getSupplierById(id) {
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        return suppliers.find(s => s.id === id);
    }

    // ==================== Statistics ====================
    function calculateTotalPayables() {
        const suppliers = getAllSuppliers();
        return suppliers.reduce((sum, s) => sum + (s.balance || 0), 0);
    }

    function getSupplierStatistics() {
        const suppliers = getAllSuppliers();
        
        const totalSuppliers = suppliers.length;
        const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
        const totalPayables = calculateTotalPayables();
        const excellentSuppliers = suppliers.filter(s => s.rating === 'excellent').length;
        
        return {
            totalSuppliers,
            activeSuppliers,
            totalPayables,
            excellentSuppliers,
            averageBalance: totalSuppliers > 0 ? totalPayables / totalSuppliers : 0
        };
    }

    // ==================== Supplier Statement ====================
    function getSupplierStatement(supplierId, dateFrom, dateTo) {
        const supplier = getSupplierById(supplierId);
        if (!supplier) {
            return null;
        }
        
        let purchases = [];
        if (window.APP_EGYPT_PURCHASES) {
            purchases = APP_EGYPT_PURCHASES.getAllPurchases({ 
                supplierId, 
                dateFrom, 
                dateTo 
            });
        }
        
        return {
            supplier,
            purchases,
            summary: {
                totalInvoices: purchases.length,
                totalAmount: purchases.reduce((sum, p) => sum + p.total, 0),
                paidAmount: purchases.filter(p => p.status === 'paid')
                    .reduce((sum, p) => sum + p.total, 0),
                pendingAmount: purchases.filter(p => p.status === 'pending')
                    .reduce((sum, p) => sum + p.total, 0)
            }
        };
    }

    // ==================== Update Supplier Balance ====================
    function updateSupplierBalance(supplierId, amount, increment = true) {
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        const supplier = suppliers.find(s => s.id === supplierId);
        
        if (supplier) {
            if (increment) {
                supplier.balance = (supplier.balance || 0) + amount;
                supplier.totalPurchases = (supplier.totalPurchases || 0) + amount;
                supplier.totalInvoices = (supplier.totalInvoices || 0) + 1;
            } else {
                supplier.balance = amount;
            }
            
            APP_EGYPT_CORE.saveData('suppliers', suppliers);
            return true;
        }
        
        return false;
    }

    function recordPayment(supplierId, amount) {
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        const supplier = suppliers.find(s => s.id === supplierId);
        
        if (supplier) {
            supplier.balance = (supplier.balance || 0) - amount;
            supplier.totalPaid = (supplier.totalPaid || 0) + amount;
            
            APP_EGYPT_CORE.saveData('suppliers', suppliers);
            return true;
        }
        
        return false;
    }

    // ==================== Render Suppliers List ====================
    function renderSuppliersList(containerId = 'suppliers-list') {
        const suppliers = getAllSuppliers();
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        if (suppliers.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="bi bi-building text-6xl text-gray-300"></i>
                    <p class="mt-4 text-gray-500">لا يوجد موردين</p>
                </div>
            `;
            return;
        }
        
        const html = suppliers.map(supplier => {
            const ratingBadge = {
                'excellent': '<span class="badge badge-success">ممتاز</span>',
                'good': '<span class="badge badge-info">جيد</span>',
                'average': '<span class="badge badge-warning">متوسط</span>',
                'poor': '<span class="badge badge-error">ضعيف</span>',
                'new': '<span class="badge badge-ghost">جديد</span>'
            };
            
            return `
                <tr>
                    <td>${supplier.code}</td>
                    <td>${supplier.name}</td>
                    <td>${supplier.phone || '-'}</td>
                    <td>${supplier.totalInvoices}</td>
                    <td>${APP_EGYPT_CORE.formatCurrency(supplier.totalPurchases)}</td>
                    <td>${APP_EGYPT_CORE.formatCurrency(supplier.totalPaid)}</td>
                    <td class="${supplier.balance > 0 ? 'text-error' : 'text-success'} font-bold">
                        ${APP_EGYPT_CORE.formatCurrency(supplier.balance)}
                    </td>
                    <td>${ratingBadge[supplier.rating] || ratingBadge['new']}</td>
                    <td>
                        <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_SUPPLIERS.viewSupplier('${supplier.id}')">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_SUPPLIERS.editSupplier('${supplier.id}')">
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
        createSupplier,
        updateSupplier,
        deleteSupplier,
        getAllSuppliers,
        getSupplierById,
        calculateTotalPayables,
        getSupplierStatistics,
        getSupplierStatement,
        updateSupplierBalance,
        recordPayment,
        renderSuppliersList,
        REAL_SUPPLIERS_DATA
    };
})();

// Log when loaded
if (typeof window !== 'undefined') {
    console.log('🇪🇬 نظام الموردين المصري جاهز');
}
