// ==================== نظام المبيعات المصري ====================
const APP_EGYPT_SALES = (function() {
    'use strict';

    // ==================== Sample Real Sales Data ====================
    const REAL_SALES_DATA = [
        {
            id: 'INV-243-1233',
            invoiceNumber: '243/1233',
            customerId: 'C-202103',
            customerName: 'جمعية رجال الأعمال',
            date: '2025-01-15',
            subtotal: 1916.67,
            vat: 268.33,
            incomeTax: 19.17,
            total: 2204.17,
            linkedPurchase: 'PUR-23',
            status: 'paid',
            paymentMethod: 'bank',
            notes: 'فاتورة نموذجية - مرتبطة بمشتريات 23'
        },
        {
            id: 'INV-244-1234',
            invoiceNumber: '244/1234',
            customerId: 'C-202105',
            customerName: 'مركز القلب الدولي',
            date: '2025-01-20',
            subtotal: 3242.11,
            vat: 453.90,
            incomeTax: 32.42,
            total: 3728.43,
            linkedPurchase: 'PUR-10',
            status: 'paid',
            paymentMethod: 'cash',
            notes: 'فاتورة نموذجية - مرتبطة بمشتريات 10'
        },
        {
            id: 'INV-245-1235',
            invoiceNumber: '245/1235',
            customerId: 'C-202103',
            customerName: 'جمعية رجال الأعمال',
            date: '2025-02-01',
            subtotal: 6030.70,
            vat: 844.30,
            incomeTax: 60.31,
            total: 6935.31,
            linkedPurchase: null,
            status: 'pending',
            paymentMethod: null,
            notes: 'فاتورة نموذجية'
        }
    ];

    // ==================== Initialize ====================
    function initialize() {
        console.log('🧾 تهيئة نظام المبيعات المصري...');
        
        // Load existing sales or use sample data
        let sales = APP_EGYPT_CORE.getData('sales');
        if (!sales || sales.length === 0) {
            console.log('📥 تحميل البيانات النموذجية للمبيعات');
            sales = REAL_SALES_DATA;
            APP_EGYPT_CORE.saveData('sales', sales);
        }
        
        return {
            initialized: true,
            count: sales.length,
            total: calculateTotalSales()
        };
    }

    // ==================== Create New Sale ====================
    function createSaleInvoice(data) {
        const sales = APP_EGYPT_CORE.getData('sales');
        
        // Calculate taxes
        const taxData = APP_EGYPT_TAX.calculateAllTaxes(data.subtotal);
        
        const invoice = {
            id: APP_EGYPT_CORE.generateId('INV-S-'),
            invoiceNumber: data.invoiceNumber || APP_EGYPT_CORE.generateInvoiceNumber('sales'),
            customerId: data.customerId,
            customerName: data.customerName,
            date: data.date || new Date().toISOString().split('T')[0],
            items: data.items || [],
            subtotal: taxData.subtotal,
            vat: taxData.vat,
            incomeTax: taxData.incomeTax,
            total: taxData.total,
            linkedPurchase: data.linkedPurchase || null,
            status: data.status || 'pending',
            paymentMethod: data.paymentMethod || null,
            notes: data.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        sales.push(invoice);
        APP_EGYPT_CORE.saveData('sales', sales);
        
        // Update customer balance
        updateCustomerBalance(invoice.customerId, invoice.total);
        
        return invoice;
    }

    // ==================== Update Sale ====================
    function updateSaleInvoice(id, updates) {
        const sales = APP_EGYPT_CORE.getData('sales');
        const index = sales.findIndex(inv => inv.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الفاتورة غير موجودة' };
        }
        
        const invoice = sales[index];
        
        // Recalculate if subtotal changed
        if (updates.subtotal && updates.subtotal !== invoice.subtotal) {
            const taxData = APP_EGYPT_TAX.calculateAllTaxes(updates.subtotal);
            updates.vat = taxData.vat;
            updates.incomeTax = taxData.incomeTax;
            updates.total = taxData.total;
        }
        
        // Update invoice
        sales[index] = {
            ...invoice,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        APP_EGYPT_CORE.saveData('sales', sales);
        
        return { success: true, invoice: sales[index] };
    }

    // ==================== Delete Sale ====================
    function deleteSaleInvoice(id) {
        const sales = APP_EGYPT_CORE.getData('sales');
        const index = sales.findIndex(inv => inv.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الفاتورة غير موجودة' };
        }
        
        const invoice = sales[index];
        
        // Update customer balance
        updateCustomerBalance(invoice.customerId, -invoice.total);
        
        sales.splice(index, 1);
        APP_EGYPT_CORE.saveData('sales', sales);
        
        return { success: true, message: 'تم حذف الفاتورة' };
    }

    // ==================== Get Sales ====================
    function getAllSales(filters = {}) {
        let sales = APP_EGYPT_CORE.getData('sales');
        
        // Apply filters
        if (filters.customerId) {
            sales = sales.filter(inv => inv.customerId === filters.customerId);
        }
        
        if (filters.status) {
            sales = sales.filter(inv => inv.status === filters.status);
        }
        
        if (filters.dateFrom) {
            sales = sales.filter(inv => inv.date >= filters.dateFrom);
        }
        
        if (filters.dateTo) {
            sales = sales.filter(inv => inv.date <= filters.dateTo);
        }
        
        // Sort by date descending
        sales.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return sales;
    }

    function getSaleById(id) {
        const sales = APP_EGYPT_CORE.getData('sales');
        return sales.find(inv => inv.id === id);
    }

    // ==================== Statistics ====================
    function calculateTotalSales(filters = {}) {
        const sales = getAllSales(filters);
        return sales.reduce((sum, inv) => sum + inv.total, 0);
    }

    function calculateSalesStatistics(year = new Date().getFullYear()) {
        const sales = getAllSales().filter(inv => {
            const invYear = new Date(inv.date).getFullYear();
            return invYear === year;
        });
        
        const totalSales = sales.reduce((sum, inv) => sum + inv.total, 0);
        const totalVAT = sales.reduce((sum, inv) => sum + inv.vat, 0);
        const totalIncomeTax = sales.reduce((sum, inv) => sum + inv.incomeTax, 0);
        const paidInvoices = sales.filter(inv => inv.status === 'paid');
        const pendingInvoices = sales.filter(inv => inv.status === 'pending');
        
        return {
            year,
            totalInvoices: sales.length,
            totalSales,
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

    // ==================== Calculate Profit ====================
    function calculateInvoiceProfit(saleId) {
        const sale = getSaleById(saleId);
        if (!sale || !sale.linkedPurchase) {
            return null;
        }
        
        const purchase = APP_EGYPT_PURCHASES?.getPurchaseById(sale.linkedPurchase);
        if (!purchase) {
            return null;
        }
        
        const profit = sale.subtotal - purchase.subtotal;
        const profitMargin = (profit / sale.subtotal) * 100;
        
        return {
            saleId: sale.id,
            saleInvoice: sale.invoiceNumber,
            purchaseId: purchase.id,
            purchaseInvoice: purchase.invoiceNumber,
            saleAmount: sale.subtotal,
            purchaseAmount: purchase.subtotal,
            profit,
            profitMargin: Number(profitMargin.toFixed(2))
        };
    }

    // ==================== Update Customer Balance ====================
    function updateCustomerBalance(customerId, amount) {
        if (!window.APP_EGYPT_CUSTOMERS) return;
        
        const customers = APP_EGYPT_CORE.getData('customers');
        const customer = customers.find(c => c.id === customerId);
        
        if (customer) {
            customer.balance = (customer.balance || 0) + amount;
            APP_EGYPT_CORE.saveData('customers', customers);
        }
    }

    // ==================== Render Sales List ====================
    function renderSalesList(containerId = 'sales-list') {
        const sales = getAllSales();
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        if (sales.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="bi bi-receipt text-6xl text-gray-300"></i>
                    <p class="mt-4 text-gray-500">لا توجد فواتير مبيعات</p>
                </div>
            `;
            return;
        }
        
        const html = sales.map(invoice => `
            <tr>
                <td>${invoice.invoiceNumber}</td>
                <td>${invoice.customerName}</td>
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
                    <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_SALES.viewInvoice('${invoice.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_SALES.printInvoice('${invoice.id}')">
                        <i class="bi bi-printer"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        container.innerHTML = html;
    }

    // ==================== Print Invoice ====================
    function printInvoice(id) {
        const invoice = getSaleById(id);
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
                <title>فاتورة مبيعات ${invoice.invoiceNumber}</title>
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
                        <h1>فاتورة مبيعات</h1>
                        <h2>${invoice.invoiceNumber}</h2>
                    </div>
                    <div class="details">
                        <p><strong>العميل:</strong> ${invoice.customerName}</p>
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
        createSaleInvoice,
        updateSaleInvoice,
        deleteSaleInvoice,
        getAllSales,
        getSaleById,
        calculateTotalSales,
        calculateSalesStatistics,
        calculateInvoiceProfit,
        renderSalesList,
        printInvoice,
        REAL_SALES_DATA
    };
})();

// Log when loaded
if (typeof window !== 'undefined') {
    console.log('🇪🇬 نظام المبيعات المصري جاهز');
}
