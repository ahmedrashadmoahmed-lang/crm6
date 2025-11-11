// ==================== استيراد حي من Google Sheets (عبر CSV) 📊 ====================
console.log('📥 تحميل نظام استيراد Google Sheets...');

const APP_GOOGLE_SHEETS_LIVE = (function() {
    'use strict';

    // تحويل Sheet IDs إلى CSV URLs
    const SHEETS = {
        customers: 'https://docs.google.com/spreadsheets/d/19LODEbd3povVd-yBQFSyVPNCz46GhhEF-LyB0E1eklw/export?format=csv&gid=0',
        quotations: 'https://docs.google.com/spreadsheets/d/1wEmWS4972AbF_tiR01icPHBgu8uJ2Qyx3UbWu02Mwck/export?format=csv&gid=0'
    };

    // ==================== تحويل CSV إلى Array ====================
    function parseCSV(csv) {
        const lines = csv.split('\n');
        const result = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // تقسيم بالفاصلة مع معالجة النصوص بين علامات تنصيص
            const cells = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            result.push(cells.map(cell => cell.replace(/^"|"$/g, '').trim()));
        }
        
        return result;
    }

    // ==================== استيراد العملاء ====================
    async function importCustomers() {
        console.log('📥 استيراد العملاء من Google Sheets...');
        
        try {
            const response = await fetch(SHEETS.customers);
            if (!response.ok) throw new Error('فشل تحميل البيانات');
            
            const csvText = await response.text();
            const rows = parseCSV(csvText);
            
            const customers = [];
            
            // تخطي الصف الأول (العناوين)
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                
                if (!row || !row[1]) continue;
                
                const customer = {
                    id: 'CUST_' + String(i).padStart(4, '0'),
                    name: row[1] || '',
                    nameEn: row[2] || '',
                    phone: row[3] || '',
                    email: row[4] || '',
                    address: row[5] || '',
                    city: row[6] || 'القاهرة',
                    country: 'مصر',
                    countryCode: 'EG',
                    taxNumber: row[7] || '',
                    category: row[8] || 'عادي',
                    status: 'active',
                    currentBalance: parseFloat(row[9] || 0),
                    creditLimit: parseFloat(row[10] || 0),
                    paymentTerms: row[11] || 'نقدي',
                    notes: row[12] || '',
                    createdAt: new Date().toISOString(),
                    createdBy: 'Google Sheets Import'
                };
                
                customers.push(customer);
            }
            
            APP_CORE.setData('customers', customers);
            console.log(`✅ تم استيراد ${customers.length} عميل من Google Sheets`);
            
            return customers.length;
            
        } catch (error) {
            console.error('❌ خطأ في استيراد العملاء:', error);
            
            // استخدام البيانات التجريبية كبديل
            if (typeof APP_REAL_DATA !== 'undefined') {
                console.log('⚠️ استخدام البيانات التجريبية بدلاً من Google Sheets');
                return 0;
            }
            
            return 0;
        }
    }

    // ==================== استيراد عروض الأسعار ====================
    async function importQuotations() {
        console.log('📥 استيراد عروض الأسعار من Google Sheets...');
        
        try {
            const response = await fetch(SHEETS.quotations);
            if (!response.ok) throw new Error('فشل تحميل البيانات');
            
            const csvText = await response.text();
            const rows = parseCSV(csvText);
            
            const quotations = [];
            
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                
                if (!row || !row[1]) continue;
                
                const quotation = {
                    id: 'QUO_' + String(i).padStart(4, '0'),
                    number: row[1] || '',
                    date: row[2] || new Date().toISOString().split('T')[0],
                    customerId: row[3] || '',
                    customerName: row[4] || '',
                    description: row[5] || '',
                    subtotal: parseFloat(row[6] || 0),
                    taxRate: parseFloat(row[7] || 14),
                    taxAmount: parseFloat(row[8] || 0),
                    discount: parseFloat(row[9] || 0),
                    total: parseFloat(row[10] || 0),
                    customerPrice: parseFloat(row[10] || 0),
                    companyCost: parseFloat(row[11] || 0),
                    profit: parseFloat(row[12] || 0),
                    status: row[13] || 'pending',
                    validUntil: row[14] || '',
                    notes: row[15] || '',
                    createdAt: new Date().toISOString(),
                    createdBy: 'Google Sheets Import'
                };
                
                quotations.push(quotation);
            }
            
            APP_CORE.setData('quotations', quotations);
            console.log(`✅ تم استيراد ${quotations.length} عرض سعر من Google Sheets`);
            
            return quotations.length;
            
        } catch (error) {
            console.error('❌ خطأ في استيراد عروض الأسعار:', error);
            return 0;
        }
    }

    // ==================== استيراد جميع البيانات ====================
    async function importAllData() {
        console.log('🔄 بدء استيراد البيانات من Google Sheets...');
        
        const customersCount = await importCustomers();
        const quotationsCount = await importQuotations();
        
        if (customersCount > 0 || quotationsCount > 0) {
            APP_CORE.showToast(`تم استيراد ${customersCount} عميل و ${quotationsCount} عرض ✅`, 'success');
            
            if (typeof APP_PAGES !== 'undefined') {
                setTimeout(() => {
                    const currentPage = APP_PAGES.getCurrentPage();
                    APP_PAGES.navigateTo(currentPage);
                }, 500);
            }
        } else {
            console.log('⚠️ لم يتم استيراد بيانات - سيتم استخدام البيانات التجريبية');
        }
        
        return {
            customers: customersCount,
            quotations: quotationsCount
        };
    }

    // ==================== زر استيراد ====================
    function showImportButton() {
        const button = document.createElement('button');
        button.className = 'btn btn-success btn-sm fixed bottom-4 left-4 z-50 shadow-2xl';
        button.innerHTML = '<i class="bi bi-cloud-download"></i> استيراد Google Sheets';
        button.onclick = () => {
            button.disabled = true;
            button.innerHTML = '<span class="loading loading-spinner"></span> جاري الاستيراد...';
            importAllData().finally(() => {
                button.disabled = false;
                button.innerHTML = '<i class="bi bi-cloud-download"></i> استيراد Google Sheets';
            });
        };
        document.body.appendChild(button);
    }

    console.log('✅ نظام استيراد Google Sheets جاهز 📊');

    return {
        importCustomers,
        importQuotations,
        importAllData,
        showImportButton
    };
})();

if (typeof APP_GOOGLE_SHEETS_LIVE !== 'undefined') {
    console.log('✅ APP_GOOGLE_SHEETS_LIVE تم تعريفه بنجاح');
} else {
    console.error('❌ فشل تعريف APP_GOOGLE_SHEETS_LIVE');
}