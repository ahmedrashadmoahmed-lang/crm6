// ==================== نظام الفواتير الكامل - النسخة المصرية 🇪🇬 ====================
console.log('🧾 تحميل نظام الفواتير المصري...');

const APP_INVOICES = (function() {
    'use strict';

    // ==================== إنشاء فاتورة جديدة ====================
    function createNewInvoice() {
        const customers = APP_CORE.getData('customers') || [];
        const products = APP_CORE.getData('products') || [];
        const settings = APP_CORE.getData('settings') || {};
        
        const nextNumber = getNextInvoiceNumber();

        const modal = document.createElement('div');
        modal.className = 'modal modal-open';
        modal.innerHTML = `
            <div class="modal-box max-w-5xl">
                <h3 class="font-bold text-2xl mb-4 flex items-center gap-2">
                    <i class="bi bi-receipt text-primary"></i>
                    إنشاء فاتورة جديدة
                </h3>
                
                <form id="invoice-form" class="space-y-4">
                    <!-- معلومات الفاتورة -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text font-bold">رقم الفاتورة</span>
                            </label>
                            <input type="text" class="input input-bordered bg-gray-100" value="${nextNumber}" readonly />
                        </div>
                        
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text font-bold">التاريخ</span>
                            </label>
                            <input type="date" class="input input-bordered" id="invoice-date" value="${new Date().toISOString().split('T')[0]}" required />
                        </div>
                        
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text font-bold">تاريخ الاستحقاق</span>
                            </label>
                            <input type="date" class="input input-bordered" id="invoice-due-date" required />
                        </div>
                    </div>

                    <!-- اختيار العميل -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-bold">العميل *</span>
                        </label>
                        <select class="select select-bordered w-full" id="invoice-customer" required>
                            <option value="">-- اختر العميل --</option>
                            ${customers.map(c => `
                                <option value="${c.id}" data-customer='${JSON.stringify(c)}'>
                                    ${c.name} - ${c.phone}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- بيانات العميل (تظهر بعد الاختيار) -->
                    <div id="customer-details" class="hidden">
                        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <h4 class="font-bold mb-2">بيانات العميل:</h4>
                            <div class="grid grid-cols-2 gap-2 text-sm">
                                <div><strong>الاسم:</strong> <span id="customer-name"></span></div>
                                <div><strong>الهاتف:</strong> <span id="customer-phone"></span></div>
                                <div><strong>العنوان:</strong> <span id="customer-address"></span></div>
                                <div><strong>الرصيد الحالي:</strong> <span id="customer-balance" class="font-bold"></span></div>
                            </div>
                        </div>
                    </div>

                    <!-- جدول الأصناف -->
                    <div class="border-2 border-gray-300 rounded-lg p-4">
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="font-bold text-lg">أصناف الفاتورة</h4>
                            <button type="button" class="btn btn-sm btn-primary" onclick="APP_INVOICES.addInvoiceItem()">
                                <i class="bi bi-plus-lg"></i> إضافة صنف
                            </button>
                        </div>
                        
                        <div class="overflow-x-auto">
                            <table class="table table-zebra w-full" id="invoice-items-table">
                                <thead>
                                    <tr class="bg-gray-200">
                                        <th style="width: 40%">الصنف</th>
                                        <th style="width: 10%">الكمية</th>
                                        <th style="width: 15%">السعر</th>
                                        <th style="width: 10%">الخصم %</th>
                                        <th style="width: 15%">الإجمالي</th>
                                        <th style="width: 10%">حذف</th>
                                    </tr>
                                </thead>
                                <tbody id="invoice-items-body">
                                    <!-- سيتم إضافة الأصناف هنا -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- الإجماليات -->
                    <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div class="form-control">
                                    <label class="label">
                                        <span class="label-text">ملاحظات</span>
                                    </label>
                                    <textarea class="textarea textarea-bordered h-24" id="invoice-notes" placeholder="ملاحظات إضافية..."></textarea>
                                </div>
                            </div>
                            
                            <div class="space-y-2">
                                <div class="flex justify-between text-lg">
                                    <span>الإجمالي قبل الضريبة:</span>
                                    <span class="font-bold" id="subtotal">0.00 ج.م</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>الخصم:</span>
                                    <span class="font-bold text-orange-600" id="total-discount">0.00 ج.م</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>ضريبة القيمة المضافة (${settings.financial?.taxRate || 14}%):</span>
                                    <span class="font-bold text-blue-600" id="tax-amount">0.00 ج.م</span>
                                </div>
                                <div class="divider my-2"></div>
                                <div class="flex justify-between text-2xl">
                                    <span class="font-bold">الإجمالي النهائي:</span>
                                    <span class="font-bold text-success" id="total-amount">0.00 ج.م</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- حالة الدفع -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-bold">حالة الدفع</span>
                        </label>
                        <select class="select select-bordered" id="invoice-payment-status" required>
                            <option value="unpaid">غير مدفوع</option>
                            <option value="partial">مدفوع جزئياً</option>
                            <option value="paid">مدفوع بالكامل</option>
                        </select>
                    </div>

                    <div class="form-control" id="paid-amount-container" style="display: none;">
                        <label class="label">
                            <span class="label-text font-bold">المبلغ المدفوع</span>
                        </label>
                        <input type="number" step="0.01" class="input input-bordered" id="invoice-paid-amount" value="0" />
                    </div>

                    <!-- أزرار الحفظ -->
                    <div class="modal-action">
                        <button type="button" class="btn" onclick="this.closest('.modal').remove()">
                            إلغاء
                        </button>
                        <button type="submit" class="btn btn-success">
                            <i class="bi bi-save"></i>
                            حفظ الفاتورة
                        </button>
                        <button type="button" class="btn btn-primary" onclick="APP_INVOICES.saveAndPrintInvoice()">
                            <i class="bi bi-printer"></i>
                            حفظ وطباعة
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // إضافة أول صنف تلقائياً
        setTimeout(() => addInvoiceItem(), 100);

        // Event Listeners
        document.getElementById('invoice-customer').addEventListener('change', function() {
            const option = this.options[this.selectedIndex];
            if (option.value) {
                const customer = JSON.parse(option.dataset.customer);
                showCustomerDetails(customer);
            } else {
                document.getElementById('customer-details').classList.add('hidden');
            }
        });

        document.getElementById('invoice-payment-status').addEventListener('change', function() {
            const paidContainer = document.getElementById('paid-amount-container');
            if (this.value === 'partial') {
                paidContainer.style.display = 'block';
            } else {
                paidContainer.style.display = 'none';
            }
        });

        document.getElementById('invoice-form').addEventListener('submit', function(e) {
            e.preventDefault();
            saveInvoice();
        });

        // تعيين تاريخ الاستحقاق (30 يوم من الآن)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        document.getElementById('invoice-due-date').value = dueDate.toISOString().split('T')[0];
    }

    // ==================== إضافة صنف للفاتورة ====================
    function addInvoiceItem() {
        const products = APP_CORE.getData('products') || [];
        const tbody = document.getElementById('invoice-items-body');
        const rowId = 'item_' + Date.now();

        const row = document.createElement('tr');
        row.id = rowId;
        row.innerHTML = `
            <td>
                <select class="select select-bordered select-sm w-full item-product" onchange="APP_INVOICES.updateItemPrice(this)" required>
                    <option value="">-- اختر الصنف --</option>
                    ${products.map(p => `
                        <option value="${p.id}" 
                                data-price="${p.unitPrice}" 
                                data-name="${p.name}"
                                data-stock="${p.currentStock || 0}">
                            ${p.name} - ${p.unitPrice} ج.م (متوفر: ${p.currentStock || 0})
                        </option>
                    `).join('')}
                </select>
            </td>
            <td>
                <input type="number" class="input input-bordered input-sm w-full item-quantity" 
                       value="1" min="1" step="1" 
                       onchange="APP_INVOICES.calculateItemTotal(this)" required />
            </td>
            <td>
                <input type="number" class="input input-bordered input-sm w-full item-price" 
                       value="0" min="0" step="0.01" 
                       onchange="APP_INVOICES.calculateItemTotal(this)" required />
            </td>
            <td>
                <input type="number" class="input input-bordered input-sm w-full item-discount" 
                       value="0" min="0" max="100" step="0.01" 
                       onchange="APP_INVOICES.calculateItemTotal(this)" />
            </td>
            <td>
                <span class="font-bold item-total">0.00 ج.م</span>
            </td>
            <td>
                <button type="button" class="btn btn-error btn-sm" onclick="APP_INVOICES.removeInvoiceItem('${rowId}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    }

    // ==================== تحديث سعر الصنف ====================
    function updateItemPrice(select) {
        const option = select.options[select.selectedIndex];
        if (option.value) {
            const price = option.dataset.price;
            const row = select.closest('tr');
            row.querySelector('.item-price').value = price;
            calculateItemTotal(row.querySelector('.item-quantity'));
        }
    }

    // ==================== حساب إجمالي الصنف ====================
    function calculateItemTotal(input) {
        const row = input.closest('tr');
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const discountPercent = parseFloat(row.querySelector('.item-discount').value) || 0;

        const subtotal = quantity * price;
        const discountAmount = subtotal * (discountPercent / 100);
        const total = subtotal - discountAmount;

        row.querySelector('.item-total').textContent = total.toFixed(2) + ' ج.م';

        calculateInvoiceTotals();
    }

    // ==================== حساب إجماليات الفاتورة ====================
    function calculateInvoiceTotals() {
        const rows = document.querySelectorAll('#invoice-items-body tr');
        let subtotal = 0;
        let totalDiscount = 0;

        rows.forEach(row => {
            const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            const discountPercent = parseFloat(row.querySelector('.item-discount').value) || 0;

            const itemSubtotal = quantity * price;
            const itemDiscount = itemSubtotal * (discountPercent / 100);

            subtotal += itemSubtotal;
            totalDiscount += itemDiscount;
        });

        const settings = APP_CORE.getData('settings') || {};
        const taxRate = settings.financial?.taxRate || 14;
        const subtotalAfterDiscount = subtotal - totalDiscount;
        const taxAmount = subtotalAfterDiscount * (taxRate / 100);
        const total = subtotalAfterDiscount + taxAmount;

        document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' ج.م';
        document.getElementById('total-discount').textContent = totalDiscount.toFixed(2) + ' ج.م';
        document.getElementById('tax-amount').textContent = taxAmount.toFixed(2) + ' ج.م';
        document.getElementById('total-amount').textContent = total.toFixed(2) + ' ج.م';
    }

    // ==================== حذف صنف ====================
    function removeInvoiceItem(rowId) {
        const row = document.getElementById(rowId);
        if (row) {
            row.remove();
            calculateInvoiceTotals();
        }
    }

    // ==================== عرض بيانات العميل ====================
    function showCustomerDetails(customer) {
        document.getElementById('customer-name').textContent = customer.name;
        document.getElementById('customer-phone').textContent = customer.phone;
        document.getElementById('customer-address').textContent = customer.address || 'غير محدد';
        document.getElementById('customer-balance').textContent = APP_CORE.formatCurrency(customer.currentBalance || 0);
        document.getElementById('customer-details').classList.remove('hidden');
    }

    // ==================== حفظ الفاتورة ====================
    function saveInvoice(printAfterSave = false) {
        const customerId = document.getElementById('invoice-customer').value;
        if (!customerId) {
            APP_CORE.showToast('يرجى اختيار العميل', 'error');
            return;
        }

        const rows = document.querySelectorAll('#invoice-items-body tr');
        if (rows.length === 0) {
            APP_CORE.showToast('يرجى إضافة أصناف للفاتورة', 'error');
            return;
        }

        const items = [];
        let isValid = true;

        rows.forEach(row => {
            const productSelect = row.querySelector('.item-product');
            const productId = productSelect.value;
            
            if (!productId) {
                isValid = false;
                return;
            }

            const option = productSelect.options[productSelect.selectedIndex];
            const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            const discount = parseFloat(row.querySelector('.item-discount').value) || 0;

            items.push({
                productId: productId,
                productName: option.dataset.name,
                quantity: quantity,
                unitPrice: price,
                discount: discount,
                total: parseFloat(row.querySelector('.item-total').textContent)
            });
        });

        if (!isValid) {
            APP_CORE.showToast('يرجى اختيار صنف لكل صف', 'error');
            return;
        }

        const settings = APP_CORE.getData('settings') || {};
        const taxRate = settings.financial?.taxRate || 14;

        const subtotal = parseFloat(document.getElementById('subtotal').textContent) || 0;
        const totalDiscount = parseFloat(document.getElementById('total-discount').textContent) || 0;
        const taxAmount = parseFloat(document.getElementById('tax-amount').textContent) || 0;
        const total = parseFloat(document.getElementById('total-amount').textContent) || 0;

        const customerSelect = document.getElementById('invoice-customer');
        const customerOption = customerSelect.options[customerSelect.selectedIndex];
        const customer = JSON.parse(customerOption.dataset.customer);

        const paymentStatus = document.getElementById('invoice-payment-status').value;
        const paidAmount = paymentStatus === 'partial' ? parseFloat(document.getElementById('invoice-paid-amount').value) || 0 : (paymentStatus === 'paid' ? total : 0);

        const invoice = {
            id: APP_CORE.generateId('INV'),
            invoiceNumber: getNextInvoiceNumber(),
            date: document.getElementById('invoice-date').value,
            dueDate: document.getElementById('invoice-due-date').value,
            customerId: customerId,
            customerName: customer.name,
            customerPhone: customer.phone,
            customerAddress: customer.address || '',
            items: items,
            subtotal: subtotal,
            discount: totalDiscount,
            taxRate: taxRate,
            taxAmount: taxAmount,
            total: total,
            paymentStatus: paymentStatus,
            paidAmount: paidAmount,
            remainingAmount: total - paidAmount,
            notes: document.getElementById('invoice-notes').value || '',
            createdAt: new Date().toISOString(),
            createdBy: APP_CORE.appState.currentUser?.name || 'نظام'
        };

        const invoices = APP_CORE.getData('invoices') || [];
        invoices.push(invoice);
        APP_CORE.setData('invoices', invoices);

        // تحديث رصيد العميل
        if (paymentStatus !== 'paid') {
            customer.currentBalance = (customer.currentBalance || 0) + invoice.remainingAmount;
            const customers = APP_CORE.getData('customers') || [];
            const customerIndex = customers.findIndex(c => c.id === customerId);
            if (customerIndex !== -1) {
                customers[customerIndex] = customer;
                APP_CORE.setData('customers', customers);
            }
        }

        APP_CORE.showToast('تم حفظ الفاتورة بنجاح ✅', 'success');

        if (printAfterSave) {
            printInvoice(invoice);
        }

        document.querySelector('.modal').remove();
        
        if (typeof APP_PAGES !== 'undefined') {
            APP_PAGES.navigateTo('invoices');
        }
    }

    // ==================== حفظ وطباعة ====================
    function saveAndPrintInvoice() {
        saveInvoice(true);
    }

    // ==================== طباعة الفاتورة ====================
    function printInvoice(invoice) {
        const settings = APP_CORE.getData('settings') || {};
        const company = settings.company || {};

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>فاتورة رقم ${invoice.invoiceNumber}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        padding: 20mm; 
                        direction: rtl; 
                        font-size: 12pt;
                    }
                    .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; }
                    .company-name { font-size: 24pt; font-weight: bold; color: #1e40af; margin-bottom: 5px; }
                    .company-info { font-size: 10pt; color: #666; }
                    .invoice-title { 
                        background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
                        color: white; 
                        padding: 15px; 
                        text-align: center; 
                        font-size: 18pt; 
                        font-weight: bold;
                        margin: 20px 0;
                        border-radius: 8px;
                    }
                    .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
                    .info-box { border: 2px solid #e5e7eb; padding: 15px; border-radius: 8px; }
                    .info-box h3 { color: #1e40af; margin-bottom: 10px; font-size: 14pt; }
                    .info-row { margin: 5px 0; }
                    .info-label { font-weight: bold; display: inline-block; width: 120px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #d1d5db; padding: 10px; text-align: center; }
                    th { background-color: #3b82f6; color: white; font-weight: bold; }
                    tr:nth-child(even) { background-color: #f9fafb; }
                    .totals { margin-top: 20px; text-align: left; }
                    .totals-table { width: 50%; margin-right: auto; }
                    .totals-table td { border: 1px solid #d1d5db; padding: 8px; }
                    .totals-table tr:last-child { background-color: #10b981; color: white; font-weight: bold; font-size: 14pt; }
                    .footer { 
                        margin-top: 30px; 
                        padding-top: 20px; 
                        border-top: 2px solid #e5e7eb; 
                        text-align: center; 
                        font-size: 10pt; 
                        color: #666;
                    }
                    .tax-notice { 
                        background-color: #fef3c7; 
                        border: 2px solid #f59e0b; 
                        padding: 10px; 
                        margin: 20px 0; 
                        border-radius: 8px;
                        text-align: center;
                        font-weight: bold;
                    }
                    @media print {
                        body { padding: 10mm; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-name">${company.name || 'شركة محاسبي برو'} 🇪🇬</div>
                    <div class="company-info">
                        ${company.address || 'القاهرة - مصر'} | 
                        ${company.phone || 'تليفون'} | 
                        ${company.email || 'بريد إلكتروني'}
                    </div>
                    <div class="company-info">
                        السجل الضريبي: ${company.taxNumber || '000-000-000'} | 
                        السجل التجاري: ${company.commercialRecord || '00000'}
                    </div>
                </div>

                <div class="invoice-title">
                    فاتورة ضريبية 🧾
                </div>

                <div class="info-section">
                    <div class="info-box">
                        <h3>بيانات الفاتورة</h3>
                        <div class="info-row">
                            <span class="info-label">رقم الفاتورة:</span>
                            <span>${invoice.invoiceNumber}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">التاريخ:</span>
                            <span>${new Date(invoice.date).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">تاريخ الاستحقاق:</span>
                            <span>${new Date(invoice.dueDate).toLocaleDateString('ar-EG')}</span>
                        </div>
                    </div>

                    <div class="info-box">
                        <h3>بيانات العميل</h3>
                        <div class="info-row">
                            <span class="info-label">الاسم:</span>
                            <span>${invoice.customerName}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">الهاتف:</span>
                            <span>${invoice.customerPhone}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">العنوان:</span>
                            <span>${invoice.customerAddress || 'غير محدد'}</span>
                        </div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%">#</th>
                            <th style="width: 35%">الصنف</th>
                            <th style="width: 10%">الكمية</th>
                            <th style="width: 15%">السعر</th>
                            <th style="width: 10%">الخصم</th>
                            <th style="width: 15%">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td style="text-align: right">${item.productName}</td>
                                <td>${item.quantity}</td>
                                <td>${item.unitPrice.toFixed(2)} ج.م</td>
                                <td>${item.discount}%</td>
                                <td>${item.total.toFixed(2)} ج.م</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="totals">
                    <table class="totals-table">
                        <tr>
                            <td>الإجمالي قبل الضريبة:</td>
                            <td>${invoice.subtotal.toFixed(2)} ج.م</td>
                        </tr>
                        <tr>
                            <td>الخصم:</td>
                            <td>${invoice.discount.toFixed(2)} ج.م</td>
                        </tr>
                        <tr>
                            <td>ضريبة القيمة المضافة (${invoice.taxRate}%):</td>
                            <td>${invoice.taxAmount.toFixed(2)} ج.م</td>
                        </tr>
                        <tr>
                            <td>الإجمالي النهائي:</td>
                            <td>${invoice.total.toFixed(2)} ج.م</td>
                        </tr>
                    </table>
                </div>

                <div class="tax-notice">
                    🇪🇬 فاتورة ضريبية - ضريبة القيمة المضافة ${invoice.taxRate}% مضافة
                </div>

                ${invoice.notes ? `
                    <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
                        <strong>ملاحظات:</strong> ${invoice.notes}
                    </div>
                ` : ''}

                <div class="footer">
                    <p>شكراً لتعاملكم معنا 🙏</p>
                    <p>تم الإصدار بواسطة: نظام محاسبي برو - مصر v5.0</p>
                    <p>التاريخ والوقت: ${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 20px;">
                    <button onclick="window.print()" style="background: #3b82f6; color: white; padding: 10px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 14pt;">
                        <strong>طباعة 🖨️</strong>
                    </button>
                    <button onclick="window.close()" style="background: #6b7280; color: white; padding: 10px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 14pt; margin-right: 10px;">
                        <strong>إغلاق</strong>
                    </button>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    // ==================== الحصول على رقم الفاتورة التالي ====================
    function getNextInvoiceNumber() {
        const invoices = APP_CORE.getData('invoices') || [];
        const settings = APP_CORE.getData('settings') || {};
        const prefix = settings.financial?.invoicePrefix || 'INV-EG-';
        const nextNum = invoices.length + 1;
        return `${prefix}${String(nextNum).padStart(5, '0')}`;
    }

    // ==================== عرض صفحة الفواتير ====================
    function renderInvoicesPage() {
        const invoices = APP_CORE.getData('invoices') || [];

        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 class="text-3xl font-bold flex items-center gap-3">
                            <i class="bi bi-receipt text-primary"></i>
                            الفواتير
                        </h2>
                        <p class="text-gray-600 dark:text-gray-400 mt-1">
                            إدارة فواتير البيع والتحصيل
                        </p>
                    </div>
                    <button class="btn btn-primary btn-lg" onclick="APP_INVOICES.createNewInvoice()">
                        <i class="bi bi-plus-lg"></i>
                        فاتورة جديدة
                    </button>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    ${renderInvoiceStats(invoices)}
                </div>

                <!-- Filters -->
                <div class="card bg-white dark:bg-gray-800 shadow-lg">
                    <div class="card-body">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input type="text" placeholder="🔍 بحث..." class="input input-bordered" id="invoice-search" onkeyup="APP_INVOICES.filterInvoices()" />
                            
                            <select class="select select-bordered" id="invoice-status-filter" onchange="APP_INVOICES.filterInvoices()">
                                <option value="">كل الحالات</option>
                                <option value="paid">مدفوع</option>
                                <option value="unpaid">غير مدفوع</option>
                                <option value="partial">مدفوع جزئياً</option>
                            </select>

                            <input type="date" class="input input-bordered" id="invoice-date-from" onchange="APP_INVOICES.filterInvoices()" />
                            <input type="date" class="input input-bordered" id="invoice-date-to" onchange="APP_INVOICES.filterInvoices()" />
                        </div>
                    </div>
                </div>

                <!-- Invoices Table -->
                <div class="card bg-white dark:bg-gray-800 shadow-lg">
                    <div class="card-body">
                        <div class="overflow-x-auto">
                            <table class="table table-zebra w-full" id="invoices-table">
                                <thead>
                                    <tr class="bg-gray-200 dark:bg-gray-700">
                                        <th>رقم الفاتورة</th>
                                        <th>التاريخ</th>
                                        <th>العميل</th>
                                        <th>المبلغ</th>
                                        <th>الحالة</th>
                                        <th>المتبقي</th>
                                        <th>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${invoices.length === 0 ? `
                                        <tr>
                                            <td colspan="7" class="text-center py-8">
                                                <div class="text-gray-400">
                                                    <i class="bi bi-inbox text-6xl"></i>
                                                    <p class="mt-2">لا توجد فواتير بعد</p>
                                                    <button class="btn btn-primary mt-4" onclick="APP_INVOICES.createNewInvoice()">
                                                        إنشاء فاتورة جديدة
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ` : invoices.map(invoice => `
                                        <tr data-invoice-id="${invoice.id}">
                                            <td class="font-bold">${invoice.invoiceNumber}</td>
                                            <td>${new Date(invoice.date).toLocaleDateString('ar-EG')}</td>
                                            <td>
                                                <div>
                                                    <div class="font-semibold">${invoice.customerName}</div>
                                                    <div class="text-xs opacity-70">${invoice.customerPhone}</div>
                                                </div>
                                            </td>
                                            <td class="font-bold text-success">${APP_CORE.formatCurrency(invoice.total)}</td>
                                            <td>
                                                <span class="badge ${getPaymentStatusClass(invoice.paymentStatus)}">
                                                    ${getPaymentStatusText(invoice.paymentStatus)}
                                                </span>
                                            </td>
                                            <td class="font-bold ${invoice.remainingAmount > 0 ? 'text-error' : 'text-success'}">
                                                ${APP_CORE.formatCurrency(invoice.remainingAmount)}
                                            </td>
                                            <td>
                                                <div class="flex gap-2">
                                                    <button class="btn btn-ghost btn-sm" onclick="APP_INVOICES.viewInvoice('${invoice.id}')" title="عرض">
                                                        <i class="bi bi-eye"></i>
                                                    </button>
                                                    <button class="btn btn-ghost btn-sm" onclick="APP_INVOICES.printInvoiceById('${invoice.id}')" title="طباعة">
                                                        <i class="bi bi-printer"></i>
                                                    </button>
                                                    <button class="btn btn-ghost btn-sm text-error" onclick="APP_INVOICES.deleteInvoice('${invoice.id}')" title="حذف">
                                                        <i class="bi bi-trash"></i>
                                                    </button>
                                                </div>
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

    // ==================== إحصائيات الفواتير ====================
    function renderInvoiceStats(invoices) {
        const totalInvoices = invoices.length;
        const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const paidAmount = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
        const unpaidAmount = invoices.reduce((sum, inv) => sum + inv.remainingAmount, 0);

        return `
            <div class="stat-card card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="opacity-90">إجمالي الفواتير</p>
                            <p class="text-3xl font-bold">${totalInvoices}</p>
                        </div>
                        <i class="bi bi-receipt text-4xl opacity-20"></i>
                    </div>
                </div>
            </div>

            <div class="stat-card card bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="opacity-90">إجمالي المبلغ</p>
                            <p class="text-3xl font-bold">${APP_CORE.formatCurrency(totalAmount).replace(' ج.م', '')}</p>
                            <p class="text-xs opacity-75">ج.م</p>
                        </div>
                        <i class="bi bi-currency-exchange text-4xl opacity-20"></i>
                    </div>
                </div>
            </div>

            <div class="stat-card card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="opacity-90">المحصل</p>
                            <p class="text-3xl font-bold">${APP_CORE.formatCurrency(paidAmount).replace(' ج.م', '')}</p>
                            <p class="text-xs opacity-75">ج.م</p>
                        </div>
                        <i class="bi bi-check-circle text-4xl opacity-20"></i>
                    </div>
                </div>
            </div>

            <div class="stat-card card bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="opacity-90">المتبقي</p>
                            <p class="text-3xl font-bold">${APP_CORE.formatCurrency(unpaidAmount).replace(' ج.م', '')}</p>
                            <p class="text-xs opacity-75">ج.م</p>
                        </div>
                        <i class="bi bi-hourglass-split text-4xl opacity-20"></i>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== حالات الدفع ====================
    function getPaymentStatusClass(status) {
        const classes = {
            paid: 'badge-success',
            unpaid: 'badge-error',
            partial: 'badge-warning'
        };
        return classes[status] || 'badge-ghost';
    }

    function getPaymentStatusText(status) {
        const texts = {
            paid: '✅ مدفوع',
            unpaid: '❌ غير مدفوع',
            partial: '⏳ جزئي'
        };
        return texts[status] || status;
    }

    // ==================== طباعة فاتورة بالـ ID ====================
    function printInvoiceById(invoiceId) {
        const invoices = APP_CORE.getData('invoices') || [];
        const invoice = invoices.find(inv => inv.id === invoiceId);
        if (invoice) {
            printInvoice(invoice);
        }
    }

    // ==================== عرض تفاصيل الفاتورة ====================
    function viewInvoice(invoiceId) {
        const invoices = APP_CORE.getData('invoices') || [];
        const invoice = invoices.find(inv => inv.id === invoiceId);
        
        if (!invoice) {
            APP_CORE.showToast('الفاتورة غير موجودة', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal modal-open';
        modal.innerHTML = `
            <div class="modal-box max-w-4xl">
                <h3 class="font-bold text-2xl mb-4">
                    تفاصيل الفاتورة: ${invoice.invoiceNumber}
                </h3>
                
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                            <p class="text-sm opacity-70">العميل</p>
                            <p class="font-bold">${invoice.customerName}</p>
                            <p class="text-sm">${invoice.customerPhone}</p>
                        </div>
                        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                            <p class="text-sm opacity-70">التاريخ</p>
                            <p class="font-bold">${new Date(invoice.date).toLocaleDateString('ar-EG')}</p>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>الصنف</th>
                                    <th>الكمية</th>
                                    <th>السعر</th>
                                    <th>الإجمالي</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${invoice.items.map(item => `
                                    <tr>
                                        <td>${item.productName}</td>
                                        <td>${item.quantity}</td>
                                        <td>${APP_CORE.formatCurrency(item.unitPrice)}</td>
                                        <td>${APP_CORE.formatCurrency(item.total)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div class="flex justify-between mb-2">
                            <span>الإجمالي:</span>
                            <span class="font-bold">${APP_CORE.formatCurrency(invoice.subtotal)}</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span>الضريبة (${invoice.taxRate}%):</span>
                            <span class="font-bold">${APP_CORE.formatCurrency(invoice.taxAmount)}</span>
                        </div>
                        <div class="divider my-2"></div>
                        <div class="flex justify-between text-xl">
                            <span class="font-bold">الإجمالي النهائي:</span>
                            <span class="font-bold text-success">${APP_CORE.formatCurrency(invoice.total)}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-action">
                    <button class="btn" onclick="this.closest('.modal').remove()">إغلاق</button>
                    <button class="btn btn-primary" onclick="APP_INVOICES.printInvoiceById('${invoice.id}')">
                        <i class="bi bi-printer"></i> طباعة
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // ==================== حذف فاتورة ====================
    function deleteInvoice(invoiceId) {
        if (!confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
            return;
        }

        const invoices = APP_CORE.getData('invoices') || [];
        const filtered = invoices.filter(inv => inv.id !== invoiceId);
        APP_CORE.setData('invoices', filtered);
        
        APP_CORE.showToast('تم حذف الفاتورة', 'success');
        
        if (typeof APP_PAGES !== 'undefined') {
            APP_PAGES.navigateTo('invoices');
        }
    }

    // ==================== فلترة الفواتير ====================
    function filterInvoices() {
        const searchTerm = document.getElementById('invoice-search')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('invoice-status-filter')?.value || '';
        const dateFrom = document.getElementById('invoice-date-from')?.value || '';
        const dateTo = document.getElementById('invoice-date-to')?.value || '';

        const rows = document.querySelectorAll('#invoices-table tbody tr[data-invoice-id]');
        
        rows.forEach(row => {
            const invoiceId = row.dataset.invoiceId;
            const invoices = APP_CORE.getData('invoices') || [];
            const invoice = invoices.find(inv => inv.id === invoiceId);
            
            if (!invoice) {
                row.style.display = 'none';
                return;
            }

            let show = true;

            // Search filter
            if (searchTerm) {
                const searchableText = `${invoice.invoiceNumber} ${invoice.customerName} ${invoice.customerPhone}`.toLowerCase();
                show = show && searchableText.includes(searchTerm);
            }

            // Status filter
            if (statusFilter) {
                show = show && invoice.paymentStatus === statusFilter;
            }

            // Date range filter
            if (dateFrom) {
                show = show && invoice.date >= dateFrom;
            }
            if (dateTo) {
                show = show && invoice.date <= dateTo;
            }

            row.style.display = show ? '' : 'none';
        });
    }

    // ==================== Public API ====================
    console.log('✅ نظام الفواتير جاهز 🧾');

    return {
        createNewInvoice,
        addInvoiceItem,
        updateItemPrice,
        calculateItemTotal,
        removeInvoiceItem,
        saveAndPrintInvoice,
        renderInvoicesPage,
        printInvoiceById,
        viewInvoice,
        deleteInvoice,
        filterInvoices
    };
})();

if (typeof APP_INVOICES !== 'undefined') {
    console.log('✅ APP_INVOICES تم تعريفه بنجاح');
} else {
    console.error('❌ فشل تعريف APP_INVOICES');
}