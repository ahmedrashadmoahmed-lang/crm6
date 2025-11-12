// ==================== نظام استيراد البيانات من Google Sheets ====================
const APP_EGYPT_IMPORT = (function() {
    'use strict';

    // ==================== Google Sheets URLs ====================
    const SHEETS_URLS = {
        sheet1: 'https://docs.google.com/spreadsheets/d/19LODEbd3povVd-yBQFSyVPNCz46GhhEF-LyB0E1eklw/',
        sheet2: 'https://docs.google.com/spreadsheets/d/1wEmWS4972AbF_tiR01icPHBgu8uJ2Qyx3UbWu02Mwck/'
    };

    // ==================== Convert Google Sheets URL to CSV ====================
    function getSheetCSVUrl(sheetUrl, gid = 0) {
        // Extract sheet ID from URL
        const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (!match) {
            console.error('Invalid Google Sheets URL');
            return null;
        }
        
        const sheetId = match[1];
        return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    }

    // ==================== Parse CSV Data ====================
    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const result = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Simple CSV parsing (doesn't handle all edge cases)
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            result.push(values);
        }
        
        return result;
    }

    // ==================== Import Sales Data ====================
    async function importSalesFromSheet(sheetUrl, gid = 0) {
        try {
            console.log('📥 استيراد بيانات المبيعات من Google Sheets...');
            
            const csvUrl = getSheetCSVUrl(sheetUrl, gid);
            if (!csvUrl) {
                throw new Error('رابط Google Sheets غير صالح');
            }
            
            // Note: This requires CORS to be enabled on the sheet or a proxy
            const response = await fetch(csvUrl);
            if (!response.ok) {
                throw new Error(`فشل تحميل البيانات: ${response.status}`);
            }
            
            const csvText = await response.text();
            const data = parseCSV(csvText);
            
            // Expected format: [Invoice Number, Customer, Date, Subtotal, VAT, Income Tax, Total, Status]
            const sales = [];
            
            // Skip header row
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                if (row.length < 7) continue;
                
                const invoice = {
                    id: APP_EGYPT_CORE.generateId('INV-S-'),
                    invoiceNumber: row[0] || '',
                    customerId: '', // Would need customer lookup
                    customerName: row[1] || '',
                    date: row[2] || new Date().toISOString().split('T')[0],
                    subtotal: parseFloat(row[3]) || 0,
                    vat: parseFloat(row[4]) || 0,
                    incomeTax: parseFloat(row[5]) || 0,
                    total: parseFloat(row[6]) || 0,
                    status: row[7] || 'pending',
                    linkedPurchase: null,
                    notes: 'مستورد من Google Sheets',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                sales.push(invoice);
            }
            
            console.log(`✅ تم استيراد ${sales.length} فاتورة مبيعات`);
            return sales;
            
        } catch (error) {
            console.error('❌ خطأ في استيراد المبيعات:', error);
            throw error;
        }
    }

    // ==================== Import Purchases Data ====================
    async function importPurchasesFromSheet(sheetUrl, gid = 0) {
        try {
            console.log('📥 استيراد بيانات المشتريات من Google Sheets...');
            
            const csvUrl = getSheetCSVUrl(sheetUrl, gid);
            if (!csvUrl) {
                throw new Error('رابط Google Sheets غير صالح');
            }
            
            const response = await fetch(csvUrl);
            if (!response.ok) {
                throw new Error(`فشل تحميل البيانات: ${response.status}`);
            }
            
            const csvText = await response.text();
            const data = parseCSV(csvText);
            
            const purchases = [];
            
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                if (row.length < 7) continue;
                
                const invoice = {
                    id: APP_EGYPT_CORE.generateId('PUR-'),
                    invoiceNumber: row[0] || '',
                    supplierId: '',
                    supplierName: row[1] || '',
                    date: row[2] || new Date().toISOString().split('T')[0],
                    subtotal: parseFloat(row[3]) || 0,
                    vat: parseFloat(row[4]) || 0,
                    incomeTax: parseFloat(row[5]) || 0,
                    total: parseFloat(row[6]) || 0,
                    status: row[7] || 'pending',
                    linkedSale: null,
                    notes: 'مستورد من Google Sheets',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                purchases.push(invoice);
            }
            
            console.log(`✅ تم استيراد ${purchases.length} فاتورة مشتريات`);
            return purchases;
            
        } catch (error) {
            console.error('❌ خطأ في استيراد المشتريات:', error);
            throw error;
        }
    }

    // ==================== Import Customers Data ====================
    async function importCustomersFromSheet(sheetUrl, gid = 0) {
        try {
            console.log('📥 استيراد بيانات العملاء من Google Sheets...');
            
            const csvUrl = getSheetCSVUrl(sheetUrl, gid);
            if (!csvUrl) {
                throw new Error('رابط Google Sheets غير صالح');
            }
            
            const response = await fetch(csvUrl);
            if (!response.ok) {
                throw new Error(`فشل تحميل البيانات: ${response.status}`);
            }
            
            const csvText = await response.text();
            const data = parseCSV(csvText);
            
            const customers = [];
            
            // Expected format: [Code, Name, Phone, Email, Total Sales, Balance]
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                if (row.length < 4) continue;
                
                const customer = {
                    id: APP_EGYPT_CORE.generateId('C-'),
                    code: row[0] || '',
                    name: row[1] || '',
                    nameEn: '',
                    phone: row[2] || '',
                    email: row[3] || '',
                    address: row[4] || '',
                    taxNumber: row[5] || '',
                    totalInvoices: 0,
                    totalSales: parseFloat(row[6]) || 0,
                    totalPaid: parseFloat(row[7]) || 0,
                    balance: parseFloat(row[8]) || 0,
                    rating: 'good',
                    paymentTerms: 30,
                    notes: 'مستورد من Google Sheets',
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                customers.push(customer);
            }
            
            console.log(`✅ تم استيراد ${customers.length} عميل`);
            return customers;
            
        } catch (error) {
            console.error('❌ خطأ في استيراد العملاء:', error);
            throw error;
        }
    }

    // ==================== Import Suppliers Data ====================
    async function importSuppliersFromSheet(sheetUrl, gid = 0) {
        try {
            console.log('📥 استيراد بيانات الموردين من Google Sheets...');
            
            const csvUrl = getSheetCSVUrl(sheetUrl, gid);
            if (!csvUrl) {
                throw new Error('رابط Google Sheets غير صالح');
            }
            
            const response = await fetch(csvUrl);
            if (!response.ok) {
                throw new Error(`فشل تحميل البيانات: ${response.status}`);
            }
            
            const csvText = await response.text();
            const data = parseCSV(csvText);
            
            const suppliers = [];
            
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                if (row.length < 4) continue;
                
                const supplier = {
                    id: APP_EGYPT_CORE.generateId('S-'),
                    code: row[0] || '',
                    name: row[1] || '',
                    nameEn: '',
                    phone: row[2] || '',
                    email: row[3] || '',
                    address: row[4] || '',
                    taxNumber: row[5] || '',
                    totalInvoices: 0,
                    totalPurchases: parseFloat(row[6]) || 0,
                    totalPaid: parseFloat(row[7]) || 0,
                    balance: parseFloat(row[8]) || 0,
                    rating: 'good',
                    paymentTerms: 30,
                    notes: 'مستورد من Google Sheets',
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                suppliers.push(supplier);
            }
            
            console.log(`✅ تم استيراد ${suppliers.length} مورد`);
            return suppliers;
            
        } catch (error) {
            console.error('❌ خطأ في استيراد الموردين:', error);
            throw error;
        }
    }

    // ==================== Import Expenses Data ====================
    async function importExpensesFromSheet(sheetUrl, gid = 0) {
        try {
            console.log('📥 استيراد بيانات المصروفات من Google Sheets...');
            
            const csvUrl = getSheetCSVUrl(sheetUrl, gid);
            if (!csvUrl) {
                throw new Error('رابط Google Sheets غير صالح');
            }
            
            const response = await fetch(csvUrl);
            if (!response.ok) {
                throw new Error(`فشل تحميل البيانات: ${response.status}`);
            }
            
            const csvText = await response.text();
            const data = parseCSV(csvText);
            
            const expenses = [];
            
            // Expected format: [Date, Category, Description, Amount, Payment Method, Status]
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                if (row.length < 4) continue;
                
                const expense = {
                    id: APP_EGYPT_CORE.generateId('EXP-'),
                    date: row[0] || new Date().toISOString().split('T')[0],
                    category: row[1] || 'OTHER',
                    categoryName: row[1] || 'أخرى',
                    amount: parseFloat(row[3]) || 0,
                    description: row[2] || '',
                    paymentMethod: row[4] || 'cash',
                    status: row[5] || 'paid',
                    reference: '',
                    notes: 'مستورد من Google Sheets',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                expenses.push(expense);
            }
            
            console.log(`✅ تم استيراد ${expenses.length} مصروف`);
            return expenses;
            
        } catch (error) {
            console.error('❌ خطأ في استيراد المصروفات:', error);
            throw error;
        }
    }

    // ==================== Import All Data ====================
    async function importAllData(sheetUrl = SHEETS_URLS.sheet1) {
        try {
            console.log('📥 بدء استيراد جميع البيانات من Google Sheets...');
            
            const results = {
                sales: [],
                purchases: [],
                customers: [],
                suppliers: [],
                expenses: [],
                errors: []
            };
            
            // Import each type of data (using different gid values for different sheets)
            try {
                results.sales = await importSalesFromSheet(sheetUrl, 0);
                if (results.sales.length > 0) {
                    APP_EGYPT_CORE.saveData('sales', results.sales);
                }
            } catch (error) {
                results.errors.push({ type: 'sales', error: error.message });
            }
            
            try {
                results.purchases = await importPurchasesFromSheet(sheetUrl, 1);
                if (results.purchases.length > 0) {
                    APP_EGYPT_CORE.saveData('purchases', results.purchases);
                }
            } catch (error) {
                results.errors.push({ type: 'purchases', error: error.message });
            }
            
            try {
                results.customers = await importCustomersFromSheet(sheetUrl, 2);
                if (results.customers.length > 0) {
                    APP_EGYPT_CORE.saveData('customers', results.customers);
                }
            } catch (error) {
                results.errors.push({ type: 'customers', error: error.message });
            }
            
            try {
                results.suppliers = await importSuppliersFromSheet(sheetUrl, 3);
                if (results.suppliers.length > 0) {
                    APP_EGYPT_CORE.saveData('suppliers', results.suppliers);
                }
            } catch (error) {
                results.errors.push({ type: 'suppliers', error: error.message });
            }
            
            try {
                results.expenses = await importExpensesFromSheet(sheetUrl, 4);
                if (results.expenses.length > 0) {
                    APP_EGYPT_CORE.saveData('expenses', results.expenses);
                }
            } catch (error) {
                results.errors.push({ type: 'expenses', error: error.message });
            }
            
            console.log('✅ اكتمل استيراد البيانات');
            console.log('📊 الإحصائيات:', {
                sales: results.sales.length,
                purchases: results.purchases.length,
                customers: results.customers.length,
                suppliers: results.suppliers.length,
                expenses: results.expenses.length,
                errors: results.errors.length
            });
            
            return results;
            
        } catch (error) {
            console.error('❌ خطأ في استيراد البيانات:', error);
            throw error;
        }
    }

    // ==================== Show Import UI ====================
    function showImportDialog() {
        const dialog = `
            <dialog id="import-dialog" class="modal">
                <div class="modal-box w-11/12 max-w-2xl">
                    <h3 class="font-bold text-lg mb-4">📥 استيراد البيانات من Google Sheets</h3>
                    
                    <div class="space-y-4">
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle"></i>
                            <div>
                                <p class="font-bold">ملاحظة مهمة:</p>
                                <p class="text-sm">يجب أن تكون ورقة Google Sheets قابلة للوصول العام أو مشاركة الرابط</p>
                            </div>
                        </div>
                        
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">رابط Google Sheets</span>
                            </label>
                            <input type="text" 
                                   id="sheet-url-input" 
                                   class="input input-bordered w-full" 
                                   placeholder="https://docs.google.com/spreadsheets/d/..." 
                                   value="${SHEETS_URLS.sheet1}" />
                        </div>
                        
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">نوع البيانات</span>
                            </label>
                            <select id="import-type" class="select select-bordered w-full">
                                <option value="all">جميع البيانات</option>
                                <option value="sales">المبيعات فقط</option>
                                <option value="purchases">المشتريات فقط</option>
                                <option value="customers">العملاء فقط</option>
                                <option value="suppliers">الموردين فقط</option>
                                <option value="expenses">المصروفات فقط</option>
                            </select>
                        </div>
                        
                        <div id="import-progress" style="display:none;">
                            <progress class="progress progress-primary w-full"></progress>
                            <p class="text-center mt-2">جاري الاستيراد...</p>
                        </div>
                        
                        <div id="import-results" style="display:none;"></div>
                    </div>
                    
                    <div class="modal-action">
                        <button class="btn" onclick="document.getElementById('import-dialog').close()">إلغاء</button>
                        <button class="btn btn-primary" onclick="APP_EGYPT_IMPORT.startImport()">
                            <i class="bi bi-download"></i>
                            بدء الاستيراد
                        </button>
                    </div>
                </div>
            </dialog>
        `;
        
        // Add to page if not exists
        if (!document.getElementById('import-dialog')) {
            document.body.insertAdjacentHTML('beforeend', dialog);
        }
        
        document.getElementById('import-dialog').showModal();
    }

    // ==================== Start Import Process ====================
    async function startImport() {
        const url = document.getElementById('sheet-url-input').value;
        const type = document.getElementById('import-type').value;
        
        if (!url) {
            alert('يرجى إدخال رابط Google Sheets');
            return;
        }
        
        document.getElementById('import-progress').style.display = 'block';
        document.getElementById('import-results').style.display = 'none';
        
        try {
            let results;
            
            if (type === 'all') {
                results = await importAllData(url);
            } else {
                // Import specific type
                switch(type) {
                    case 'sales':
                        results = { sales: await importSalesFromSheet(url, 0) };
                        break;
                    case 'purchases':
                        results = { purchases: await importPurchasesFromSheet(url, 1) };
                        break;
                    case 'customers':
                        results = { customers: await importCustomersFromSheet(url, 2) };
                        break;
                    case 'suppliers':
                        results = { suppliers: await importSuppliersFromSheet(url, 3) };
                        break;
                    case 'expenses':
                        results = { expenses: await importExpensesFromSheet(url, 4) };
                        break;
                }
            }
            
            // Show results
            document.getElementById('import-progress').style.display = 'none';
            document.getElementById('import-results').style.display = 'block';
            document.getElementById('import-results').innerHTML = `
                <div class="alert alert-success">
                    <i class="bi bi-check-circle"></i>
                    <div>
                        <p class="font-bold">تم الاستيراد بنجاح!</p>
                        <p class="text-sm">
                            ${results.sales ? `المبيعات: ${results.sales.length} | ` : ''}
                            ${results.purchases ? `المشتريات: ${results.purchases.length} | ` : ''}
                            ${results.customers ? `العملاء: ${results.customers.length} | ` : ''}
                            ${results.suppliers ? `الموردين: ${results.suppliers.length} | ` : ''}
                            ${results.expenses ? `المصروفات: ${results.expenses.length}` : ''}
                        </p>
                    </div>
                </div>
            `;
            
            // Reload page after 2 seconds
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
        } catch (error) {
            document.getElementById('import-progress').style.display = 'none';
            document.getElementById('import-results').style.display = 'block';
            document.getElementById('import-results').innerHTML = `
                <div class="alert alert-error">
                    <i class="bi bi-exclamation-triangle"></i>
                    <div>
                        <p class="font-bold">فشل الاستيراد</p>
                        <p class="text-sm">${error.message}</p>
                        <p class="text-xs mt-2">تأكد من أن الورقة قابلة للوصول العام ومن صحة الرابط</p>
                    </div>
                </div>
            `;
        }
    }

    // ==================== Public API ====================
    return {
        SHEETS_URLS,
        importSalesFromSheet,
        importPurchasesFromSheet,
        importCustomersFromSheet,
        importSuppliersFromSheet,
        importExpensesFromSheet,
        importAllData,
        showImportDialog,
        startImport
    };
})();

// Log when loaded
if (typeof window !== 'undefined') {
    console.log('🇪🇬 نظام استيراد Google Sheets جاهز');
}
