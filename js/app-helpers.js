// ==================== دوال مساعدة عامة ====================
console.log('🔧 تحميل الدوال المساعدة...');

// ==================== حالات الفرص ====================
function getOpportunityStageName(stage) {
    const stages = {
        prospecting: 'استكشاف',
        qualification: 'تأهيل',
        proposal: 'عرض',
        negotiation: 'تفاوض',
        closed: 'مغلقة'
    };
    return stages[stage] || stage;
}

// ==================== الأولويات ====================
function getPriorityName(priority) {
    const priorities = {
        high: 'عالية',
        medium: 'متوسطة',
        low: 'منخفضة'
    };
    return priorities[priority] || priority;
}

// ==================== حالات عروض الأسعار ====================
function getQuotationStatusName(status) {
    const statuses = {
        draft: 'مسودة',
        pending: 'قيد الانتظار',
        approved: 'معتمد',
        closed: 'مغلق',
        po: 'أمر شراء',
        rejected: 'مرفوض'
    };
    return statuses[status] || status;
}

function getQuotationStatusBadge(status) {
    const badges = {
        draft: 'badge-ghost',
        pending: 'badge-warning',
        approved: 'badge-success',
        closed: 'badge-info',
        po: 'badge-primary',
        rejected: 'badge-error'
    };
    return badges[status] || 'badge-ghost';
}

// ==================== حالات طلبات البيع ====================
function getSalesOrderStatusName(status) {
    const statuses = {
        draft: 'مسودة',
        pending: 'قيد الانتظار',
        approved: 'معتمد',
        completed: 'مكتمل',
        cancelled: 'ملغي'
    };
    return statuses[status] || status;
}

function getSalesOrderStatusBadge(status) {
    const badges = {
        draft: 'badge-ghost',
        pending: 'badge-warning',
        approved: 'badge-info',
        completed: 'badge-success',
        cancelled: 'badge-error'
    };
    return badges[status] || 'badge-ghost';
}

// ==================== حالات الدفع ====================
function getPaymentStatusName(status) {
    const statuses = {
        pending: 'معلق',
        partial: 'جزئي',
        paid: 'مدفوع',
        overdue: 'متأخر'
    };
    return statuses[status] || status;
}

function getPaymentStatusBadge(status) {
    const badges = {
        pending: 'badge-warning',
        partial: 'badge-info',
        paid: 'badge-success',
        overdue: 'badge-error'
    };
    return badges[status] || 'badge-ghost';
}

// ==================== حالات المخزون ====================
function getStockStatusName(currentStock, minStock) {
    if (currentStock === 0) return 'نفد';
    if (currentStock <= minStock) return 'منخفض';
    return 'متوفر';
}

function getStockStatusBadge(currentStock, minStock) {
    if (currentStock === 0) return 'badge-error';
    if (currentStock <= minStock) return 'badge-warning';
    return 'badge-success';
}

// ==================== تنسيق الوقت النسبي ====================
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'الآن';
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 604800) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
    return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
}

// ==================== حساب نسبة الإنجاز ====================
function calculateProgressPercentage(current, target) {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
}

// ==================== توليد لون عشوائي ====================
function getRandomColor() {
    const colors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ==================== تنسيق رقم الهاتف ====================
function formatPhoneNumber(phone) {
    if (!phone) return '';
    // إزالة الأحرف غير الرقمية
    const cleaned = phone.replace(/\D/g, '');
    // تنسيق: +966 50 123 4567
    if (cleaned.length === 12 && cleaned.startsWith('966')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    }
    return phone;
}

// ==================== التحقق من صلاحية البريد الإلكتروني ====================
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==================== تحويل النص لصيغة URL-friendly ====================
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

// ==================== نسخ نص للحافظة ====================
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            APP_CORE.showToast('تم النسخ إلى الحافظة', 'success');
        }).catch(err => {
            console.error('فشل النسخ:', err);
            APP_CORE.showToast('فشل النسخ', 'error');
        });
    } else {
        // طريقة بديلة للمتصفحات القديمة
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            APP_CORE.showToast('تم النسخ إلى الحافظة', 'success');
        } catch (err) {
            console.error('فشل النسخ:', err);
            APP_CORE.showToast('فشل النسخ', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// ==================== تحويل رقم إلى كلمات (عربي) ====================
function numberToArabicWords(num) {
    // نسخة مبسطة - يمكن توسيعها
    const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
    const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    const hundreds = ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة'];
    
    if (num === 0) return 'صفر';
    if (num < 10) return ones[num];
    if (num < 100) {
        const tensDigit = Math.floor(num / 10);
        const onesDigit = num % 10;
        return tens[tensDigit] + (onesDigit ? ' و' + ones[onesDigit] : '');
    }
    
    return num.toLocaleString('ar-SA');
}

// ==================== الحصول على اسم اليوم ====================
function getDayName(date) {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[new Date(date).getDay()];
}

// ==================== الحصول على اسم الشهر ====================
function getMonthName(date) {
    const months = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return months[new Date(date).getMonth()];
}

console.log('✅ الدوال المساعدة جاهزة');
// ==================== دوال العملة المصرية ====================

// تنسيق العملة المصرية
function formatEgyptianCurrency(amount, options) {
    options = options || {};
    const currency = options.currency || 'EGP';
    const showSymbol = options.showSymbol !== false;
    const decimals = options.decimals !== undefined ? options.decimals : 2;

    if (amount === null || amount === undefined || isNaN(amount)) {
        amount = 0;
    }

    let formatted = Math.abs(amount).toFixed(decimals);
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formatted = parts.join('.');

    if (showSymbol) {
        const symbol = currency === 'EGP' ? 'ج.م' : '$';
        formatted = formatted + ' ' + symbol;
    }

    if (amount < 0) {
        formatted = '-' + formatted;
    }

    return formatted;
}

window.formatCurrency = function(amount) {
    return formatEgyptianCurrency(amount, { currency: 'EGP', showSymbol: true });
};

// تنسيق الدولار
function formatUSDCurrency(amount, showCurrency = true, decimals = 2) {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return showCurrency ? '$0.00' : '0.00';
    }
    
    const formatted = parseFloat(amount).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return showCurrency ? `$${formatted}` : formatted;
}

// تحويل من جنيه لدولار
function convertEGPToUSD(amountEGP, exchangeRate = null) {
    if (!exchangeRate) {
        const settings = APP_CORE.getData('settings') || {};
        exchangeRate = settings.financial?.exchangeRate || 30.90;
    }
    return amountEGP / exchangeRate;
}

// تحويل من دولار لجنيه
function convertUSDToEGP(amountUSD, exchangeRate = null) {
    if (!exchangeRate) {
        const settings = APP_CORE.getData('settings') || {};
        exchangeRate = settings.financial?.exchangeRate || 30.90;
    }
    return amountUSD * exchangeRate;
}

// عرض العملتين معاً
function formatDualCurrency(amountEGP, showBoth = true) {
    const egp = formatEgyptianCurrency(amountEGP);
    
    if (!showBoth) {
        return egp;
    }
    
    const usd = convertEGPToUSD(amountEGP);
    const usdFormatted = formatUSDCurrency(usd);
    
    return `${egp} <span class="text-sm opacity-70">(≈ ${usdFormatted})</span>`;
}

// حساب ضريبة القيمة المضافة المصرية (14%)
function calculateEgyptianTax(amount, includesTax = false) {
    const taxRate = 0.14; // 14%
    
    if (includesTax) {
        // المبلغ يشمل الضريبة - نستخرج الضريبة
        const baseAmount = amount / (1 + taxRate);
        const taxAmount = amount - baseAmount;
        return {
            baseAmount: baseAmount,
            taxAmount: taxAmount,
            totalAmount: amount,
            taxRate: taxRate * 100
        };
    } else {
        // المبلغ لا يشمل الضريبة - نضيف الضريبة
        const taxAmount = amount * taxRate;
        const totalAmount = amount + taxAmount;
        return {
            baseAmount: amount,
            taxAmount: taxAmount,
            totalAmount: totalAmount,
            taxRate: taxRate * 100
        };
    }
}

// تحويل الأرقام لكلمات بالعربي (للفواتير)
function numberToArabicWords(num) {
    if (num === 0) return 'صفر';
    
    const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
    const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
    const thousands = ['', 'ألف', 'ألفان', 'آلاف'];
    
    // تنسيق بسيط للأرقام الصغيرة
    if (num < 10) return ones[num];
    if (num < 20) {
        const special = {
            10: 'عشرة', 11: 'أحد عشر', 12: 'اثنا عشر', 13: 'ثلاثة عشر',
            14: 'أربعة عشر', 15: 'خمسة عشر', 16: 'ستة عشر', 17: 'سبعة عشر',
            18: 'ثمانية عشر', 19: 'تسعة عشر'
        };
        return special[num];
    }
    if (num < 100) {
        const tensPlace = Math.floor(num / 10);
        const onesPlace = num % 10;
        return tens[tensPlace] + (onesPlace > 0 ? ' و' + ones[onesPlace] : '');
    }
    
    // للأرقام الكبيرة نستخدم التنسيق الرقمي
    return num.toLocaleString('ar-EG');
}

// تنسيق التاريخ المصري
function formatEgyptianDate(dateString, format = 'full') {
    const date = new Date(dateString);
    
    const options = {
        timeZone: 'Africa/Cairo',
        locale: 'ar-EG'
    };
    
    switch(format) {
        case 'short':
            return date.toLocaleDateString('ar-EG', { 
                ...options,
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            });
        case 'medium':
            return date.toLocaleDateString('ar-EG', { 
                ...options,
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
        case 'long':
            return date.toLocaleDateString('ar-EG', { 
                ...options,
                weekday: 'long',
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
        case 'time':
            return date.toLocaleTimeString('ar-EG', { 
                ...options,
                hour: '2-digit', 
                minute: '2-digit' 
            });
        case 'full':
        default:
            return date.toLocaleString('ar-EG', { 
                ...options,
                weekday: 'long',
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
    }
}

// الحصول على الوقت الحالي في القاهرة
function getCurrentEgyptianTime() {
    return new Date().toLocaleString('ar-EG', {
        timeZone: 'Africa/Cairo',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// دالة لعرض معلومات الفاتورة الضريبية المصرية
function generateTaxInvoiceInfo(invoice) {
    const settings = APP_CORE.getData('settings') || {};
    const company = settings.company || {};
    const financial = settings.financial || {};
    
    const taxCalc = calculateEgyptianTax(invoice.subtotal, false);
    
    return {
        companyName: company.name,
        taxNumber: financial.taxRegistrationNumber || company.taxNumber,
        commercialRecord: company.commercialRecord,
        address: company.address,
        phone: company.phone,
        invoiceNumber: invoice.number,
        date: formatEgyptianDate(invoice.date, 'medium'),
        subtotal: formatEgyptianCurrency(taxCalc.baseAmount),
        taxRate: '14%',
        taxAmount: formatEgyptianCurrency(taxCalc.taxAmount),
        totalAmount: formatEgyptianCurrency(taxCalc.totalAmount),
        totalInWords: numberToArabicWords(Math.floor(taxCalc.totalAmount)) + ' جنيه مصري'
    };
}

// تصدير الدوال للاستخدام العام
window.formatCurrency = function(amount) {
    return formatEgyptianCurrency(amount, { currency: 'EGP', showSymbol: true });
};
window.formatUSDCurrency = formatUSDCurrency;
window.convertEGPToUSD = convertEGPToUSD;
window.convertUSDToEGP = convertUSDToEGP;
window.formatDualCurrency = formatDualCurrency;
window.calculateEgyptianTax = calculateEgyptianTax;
window.numberToArabicWords = numberToArabicWords;
window.formatEgyptianDate = formatEgyptianDate;
window.getCurrentEgyptianTime = getCurrentEgyptianTime;
window.generateTaxInvoiceInfo = generateTaxInvoiceInfo;

console.log('✅ دوال العملة المصرية جاهزة');