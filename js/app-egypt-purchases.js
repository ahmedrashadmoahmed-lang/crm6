// ==================== نظام المشتريات المصري ====================
const APP_EGYPT_PURCHASES = (function() {
    'use strict';

    // ==================== Sample Real Purchase Data ====================
    const REAL_PURCHASE_DATA = [
        {
            id: 'PUR-23',
            invoiceNumber: '23',
            supplierId: 'S-202101',
            supplierName: 'شرق آسيا',
            date: '2025-01-10',
            subtotal: 1270.00,
            vat: 177.80,
            incomeTax: 12.70,
            total: 1460.50,
            linkedSale: 'INV-243-1233',
            status: 'paid',
            paymentMethod: 'bank',
            notes: 'فاتورة مشتريات مرتبطة بمبيعات 243/1233'
        },
        {
            id: 'PUR-10',
            invoiceNumber: '10',
            supplierId: 'S-202102',
            supplierName: 'الحمد ستور',
            date: '2025-01-18',
            subtotal: 2947.38,
            vat: 412.63,
            incomeTax: 29.47,
            total: 3389.48,
            linkedSale: 'INV-244-1234',
            status: 'paid',
            paymentMethod: 'cash',
            notes: 'فاتورة مشتريات مرتبطة بمبيعات 244/1234'
        }
    ];

    // ==================== Initialize ====================
    function initialize() {
        console.log('🛒 تهيئة نظام المشتريات المصري...');
        
        // Load existing purchases or use sample data
        let purchases = APP_EGYPT_CORE.getData('purchases');
        if (!purchases || purchases.length === 0) {
            console.log('📥 تحميل البيانات النموذجية للمشتريات');
            purchases = REAL_PURCHASE_DATA;
            APP_EGYPT_CORE.saveData('purchases', purchases);
        }
        
        return {
            initialized: true,
            count: purchases.length,
            total: calculateTotalPurchases()
        };
    }

    // ==================== Create New Purchase ====================
    function createPurchaseInvoice(data) {
        const purchases = APP_EGYPT_CORE.getData('purchases');
        
        // Calculate taxes
        const taxData = APP_EGYPT_TAX.calculateAllTaxes(data.subtotal);
        
        const invoice = {
            id: APP_EGYPT_CORE.generateId('PUR-'),
            invoiceNumber: data.invoiceNumber || APP_EGYPT_CORE.generateInvoiceNumber('purchases'),
            supplierId: data.supplierId,
            supplierName: data.supplierName,
            date: data.date || new Date().toISOString().split('T')[0],
            items: data.items || [],
            subtotal: taxData.subtotal,
            vat: taxData.vat,
            incomeTax: taxData.incomeTax,
            total: taxData.total,
            linkedSale: data.linkedSale || null,
            status: data.status || 'pending',
            paymentMethod: data.paymentMethod || null,
            notes: data.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        purchases.push(invoice);
        APP_EGYPT_CORE.saveData('purchases', purchases);
        
        // Update supplier balance
        updateSupplierBalance(invoice.supplierId, invoice.total);
        
        return invoice;
    }

    // ==================== Update Purchase ====================
    function updatePurchaseInvoice(id, updates) {
        const purchases = APP_EGYPT_CORE.getData('purchases');
        const index = purchases.findIndex(inv => inv.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الفاتورة غير موجودة' };
        }
        
        const invoice = purchases[index];
        
        // Recalculate if subtotal changed
        if (updates.subtotal && updates.subtotal !== invoice.subtotal) {
            const taxData = APP_EGYPT_TAX.calculateAllTaxes(updates.subtotal);
            updates.vat = taxData.vat;
            updates.incomeTax = taxData.incomeTax;
            updates.total = taxData.total;
        }
        
        // Update invoice
        purchases[index] = {
            ...invoice,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        APP_EGYPT_CORE.saveData('purchases', purchases);
        
        return { success: true, invoice: purchases[index] };
    }

    // ==================== Delete Purchase ====================
    function deletePurchaseInvoice(id) {
        const purchases = APP_EGYPT_CORE.getData('purchases');
        const index = purchases.findIndex(inv => inv.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الفاتورة غير موجودة' };
        }
        
        const invoice = purchases[index];
        
        // Update supplier balance
        updateSupplierBalance(invoice.supplierId, -invoice.total);
        
        purchases.splice(index, 1);
        APP_EGYPT_CORE.saveData('purchases', purchases);
        
        return { success: true, message: 'تم حذف الفاتورة' };
    }

    // ==================== Get Purchases ====================
    function getAllPurchases(filters = {}) {
        let purchases = APP_EGYPT_CORE.getData('purchases');
        
        // Apply filters
        if (filters.supplierId) {
            purchases = purchases.filter(inv => inv.supplierId === filters.supplierId);
        }
        
        if (filters.status) {
            purchases = purchases.filter(inv => inv.status === filters.status);
        }
        
        if (filters.dateFrom) {
            purchases = purchases.filter(inv => inv.date >= filters.dateFrom);
        }
        
        if (filters.dateTo) {
            purchases = purchases.filter(inv => inv.date <= filters.dateTo);
        }
        
        // Sort by date descending
        purchases.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return purchases;
    }

    function getPurchaseById(id) {
        const purchases = APP_EGYPT_CORE.getData('purchases');
        return purchases.find(inv => inv.id === id);
    }

    // ==================== Statistics ====================
    function calculateTotalPurchases(filters = {}) {
        const purchases = getAllPurchases(filters);
        return purchases.reduce((sum, inv) => sum + inv.total, 0);
    }

    function calculatePurchasesStatistics(year = new Date().getFullYear()) {
        const purchases = getAllPurchases().filter(inv => {
            const invYear = new Date(inv.date).getFullYear();
            return invYear === year;
        });
        
        const totalPurchases = purchases.reduce((sum, inv) => sum + inv.total, 0);
        const totalVAT = purchases.reduce((sum, inv) => sum + inv.vat, 0);
        const totalIncomeTax = purchases.reduce((sum, inv) => sum + inv.incomeTax, 0);
        const paidInvoices = purchases.filter(inv => inv.status === 'paid');
        const pendingInvoices = purchases.filter(inv => inv.status === 'pending');
        
        return {
            year,
            totalInvoices: purchases.length,
            totalPurchases,
            totalVAT,
            totalIncomeTax,
            paidInvoices: {
                count: paidInvoices.length,
                total: paidInvoices.reduce((sum, inv) => sum + inv.total, 0)
            },
            pendingInvoices: {
                count: pendingInvoices.length,
                total: pendingInvoices.reduce((sum, inv) => sum + inv.total, 0)
            }
        };
    }

    // ==================== Link to Sales ====================
    function linkPurchaseToSale(purchaseId, saleId) {
        const result = updatePurchaseInvoice(purchaseId, { linkedSale: saleId });
        
        if (result.success && window.APP_EGYPT_SALES) {
            APP_EGYPT_SALES.updateSaleInvoice(saleId, { linkedPurchase: purchaseId });
        }
        
        return result;
    }

    function unlinkPurchaseFromSale(purchaseId) {
        const purchase = getPurchaseById(purchaseId);
        if (!purchase || !purchase.linkedSale) {
            return { success: false, message: 'لا يوجد ربط بفاتورة مبيعات' };
        }
        
        const saleId = purchase.linkedSale;
        
        const result = updatePurchaseInvoice(purchaseId, { linkedSale: null });
        
        if (result.success && window.APP_EGYPT_SALES) {
            APP_EGYPT_SALES.updateSaleInvoice(saleId, { linkedPurchase: null });
        }
        
        return result;
    }

    // ==================== Update Supplier Balance ====================
    function updateSupplierBalance(supplierId, amount) {
        if (!window.APP_EGYPT_SUPPLIERS) return;
        
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        const supplier = suppliers.find(s => s.id === supplierId);
        
        if (supplier) {
            supplier.balance = (supplier.balance || 0) + amount;
            APP_EGYPT_CORE.saveData('suppliers', suppliers);
        }
    }

    // ==================== Render Purchases List ====================
    function renderPurchasesList(containerId = 'purchases-list') {
        const purchases = getAllPurchases();
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        if (purchases.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="bi bi-cart text-6xl text-gray-300"></i>
                    <p class="mt-4 text-gray-500">لا توجد فواتير مشتريات</p>
                </div>
            `;
            return;
        }
        
        const html = purchases.map(invoice => `
            <tr>
                <td>${invoice.invoiceNumber}</td>
                <td>${invoice.supplierName}</td>
                <td>${APP_EGYPT_CORE.formatDate(invoice.date, 'short')}</td>
                <td>${APP_EGYPT_CORE.formatCurrency(invoice.subtotal)}</td>
                <td>${APP_EGYPT_CORE.formatCurrency(invoice.vat)}</td>
                <td>${APP_EGYPT_CORE.formatCurrency(invoice.incomeTax)}</td>
                <td class="font-bold">${APP_EGYPT_CORE.formatCurrency(invoice.total)}</td>
                <td>
                    ${invoice.status === 'paid' 
                        ? '<span class="badge badge-success">مدفوع</span>' 
                        : '<span class="badge badge-warning">معلق</span>'}
                </td>
                <td>
                    ${invoice.linkedSale 
                        ? '<span class="badge badge-info">مربوط</span>' 
                        : '<span class="badge badge-ghost">غير مربوط</span>'}
                </td>
                <td>
                    <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_PURCHASES.viewInvoice('${invoice.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_PURCHASES.printInvoice('${invoice.id}')">
                        <i class="bi bi-printer"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        container.innerHTML = html;
    }

    // ==================== Print Invoice ====================
    function printInvoice(id) {
        const invoice = getPurchaseById(id);
        if (!invoice) {
            alert('الفاتورة غير موجودة');
            return;
        }
        
        // Create print window
        const printWindow = window.open('', '_blank');
        const html = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>فاتورة مشتريات ${invoice.invoiceNumber}</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; }
                    .invoice { max-width: 800px; margin: 0 auto; padding: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .details { margin: 20px 0; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 10px; text-align: right; border: 1px solid #ddd; }
                    th { background: #f5f5f5; }
                    .total { font-size: 1.2em; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="header">
                        <h1>فاتورة مشتريات</h1>
                        <h2>${invoice.invoiceNumber}</h2>
                    </div>
                    <div class="details">
                        <p><strong>المورد:</strong> ${invoice.supplierName}</p>
                        <p><strong>التاريخ:</strong> ${APP_EGYPT_CORE.formatDate(invoice.date)}</p>
                        ${invoice.notes ? `<p><strong>ملاحظات:</strong> ${invoice.notes}</p>` : ''}
                    </div>
                    <table>
                        <tr>
                            <th>البيان</th>
                            <th>المبلغ</th>
                        </tr>
                        <tr>
                            <td>المبلغ الأساسي</td>
                            <td>${APP_EGYPT_CORE.formatCurrency(invoice.subtotal)}</td>
                        </tr>
                        <tr>
                            <td>ضريبة القيمة المضافة (14%)</td>
                            <td>${APP_EGYPT_CORE.formatCurrency(invoice.vat)}</td>
                        </tr>
                        <tr>
                            <td>ضريبة الأرباح التجارية (1%)</td>
                            <td>${APP_EGYPT_CORE.formatCurrency(invoice.incomeTax)}</td>
                        </tr>
                        <tr class="total">
                            <td>الإجمالي</td>
                            <td>${APP_EGYPT_CORE.formatCurrency(invoice.total)}</td>
                        </tr>
                    </table>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
    }

    // ==================== Public API ====================
    return {
        initialize,
        createPurchaseInvoice,
        updatePurchaseInvoice,
        deletePurchaseInvoice,
        getAllPurchases,
        getPurchaseById,
        calculateTotalPurchases,
        calculatePurchasesStatistics,
        linkPurchaseToSale,
        unlinkPurchaseFromSale,
        renderPurchasesList,
        printInvoice,
        REAL_PURCHASE_DATA
    };
})();

// Log when loaded
if (typeof window !== 'undefined') {
    console.log('🇪🇬 نظام المشتريات المصري جاهز');
}
