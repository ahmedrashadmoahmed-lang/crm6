// ==================== الإعدادات المصرية ====================
console.log('⚙️ تحميل الإعدادات المصرية...');

const APP_SETTINGS = (function() {
    'use strict';

    let currentSettings = null;

    // ==================== الإعدادات الافتراضية ====================
    function getDefaultSettings() {
        return {
            company: {
                name: 'شركة محاسبي برو - مصر',
                nameEn: 'Accounting Pro Egypt',
                email: 'info@accounting-pro.com.eg',
                phone: '+20 10 1234 5678',
                address: 'القاهرة، جمهورية مصر العربية',
                city: 'القاهرة',
                country: 'مصر',
                countryCode: 'EG',
                taxNumber: '123-456-789',
                commercialRecord: '12345',
                taxCard: '98765-4321',
                logo: null
            },
            financial: {
                currency: 'EGP',
                currencySymbol: 'ج.م',
                currencyName: 'جنيه مصري',
                currencyNameEn: 'Egyptian Pound',
                secondaryCurrency: 'USD',
                secondaryCurrencySymbol: '$',
                secondaryCurrencyName: 'دولار أمريكي',
                exchangeRate: 30.90,
                taxRate: 14,
                taxSystem: 'egyptian',
                taxRegistrationNumber: '123-456-789',
                invoicePrefix: 'INV-EG-',
                quotationPrefix: 'QUO-EG-',
                salesOrderPrefix: 'SO-EG-',
                purchaseOrderPrefix: 'PO-EG-',
                fiscalYearStart: '01-07',
                fiscalYearEnd: '30-06',
                decimalPlaces: 2,
                thousandSeparator: ',',
                decimalSeparator: '.',
                paymentMethods: ['نقدي', 'تحويل بنكي', 'شيك', 'فودافون كاش', 'انستا باي', 'فيزا/ماستركارد', 'آجل']
            },
            regional: {
                timezone: 'Africa/Cairo',
                locale: 'ar-EG',
                dateFormat: 'DD/MM/YYYY',
                timeFormat: '12',
                weekStart: 'saturday',
                workingDays: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
            },
            display: {
                theme: 'light',
                language: 'ar',
                showSecondaryLanguage: true,
                showSecondaryCurrency: false,
                numberFormat: 'egyptian'
            }
        };
    }

    // ==================== الحصول على الإعدادات ====================
    function getSettings() {
        if (!currentSettings) {
            currentSettings = APP_CORE.getData('settings');
            
            if (!currentSettings) {
                currentSettings = getDefaultSettings();
                APP_CORE.setData('settings', currentSettings);
            }
        }
        
        return currentSettings;
    }

    // ==================== حفظ الإعدادات ====================
    function setSettings(settings) {
        currentSettings = settings;
        APP_CORE.setData('settings', settings);
    }

    // ==================== التهيئة ====================
    function initializeSettings() {
        const settings = getSettings();
        
        // فرض العملة المصرية
        if (!settings.financial.currency || (settings.financial.currency !== 'EGP' && settings.financial.currency !== 'USD')) {
            settings.financial.currency = 'EGP';
            settings.financial.currencySymbol = 'ج.م';
            settings.financial.currencyName = 'جنيه مصري';
            setSettings(settings);
        }
        
        updateCurrencyUI();
        console.log('✅ الإعدادات المصرية جاهزة 🇪🇬');
    }

    // ==================== تبديل العملة ====================
    function setCurrency(newCurrency) {
        const settings = getSettings();
        
        if (newCurrency === 'EGP') {
            settings.financial.currency = 'EGP';
            settings.financial.currencySymbol = 'ج.م';
            settings.financial.currencyName = 'جنيه مصري';
        } else if (newCurrency === 'USD') {
            settings.financial.currency = 'USD';
            settings.financial.currencySymbol = '$';
            settings.financial.currencyName = 'دولار أمريكي';
        }
        
        setSettings(settings);
        updateCurrencyUI();
        
        // إعادة تحميل الصفحة
        if (typeof APP_PAGES !== 'undefined') {
            const currentPage = APP_PAGES.getCurrentPage();
            APP_PAGES.navigateTo(currentPage);
        }
        
        console.log('💱 تم تغيير العملة إلى:', newCurrency);
        APP_CORE.showToast(`تم التبديل إلى ${settings.financial.currencyName} ✅`, 'success');
    }

    // ==================== تحديث واجهة العملة ====================
    function updateCurrencyUI() {
        const settings = getSettings();
        const currency = settings.financial.currency;
        
        const checkEGP = document.getElementById('check-egp');
        const checkUSD = document.getElementById('check-usd');
        
        if (checkEGP && checkUSD) {
            if (currency === 'EGP') {
                checkEGP.classList.remove('hidden');
                checkUSD.classList.add('hidden');
            } else {
                checkEGP.classList.add('hidden');
                checkUSD.classList.remove('hidden');
            }
        }
        
        console.log('🎨 تم تحديث واجهة العملة:', currency);
    }

    // ==================== تبديل العملة المزدوجة ====================
    function toggleDualCurrency(enabled) {
        const settings = getSettings();
        settings.display.showSecondaryCurrency = enabled;
        setSettings(settings);
        
        if (typeof APP_PAGES !== 'undefined') {
            const currentPage = APP_PAGES.getCurrentPage();
            APP_PAGES.navigateTo(currentPage);
        }
        
        APP_CORE.showToast(enabled ? 'تم تفعيل العملة المزدوجة ✅' : 'تم إيقاف العملة المزدوجة', 'info');
    }

    // ==================== تحديث سعر الصرف ====================
    function updateExchangeRate() {
        const newRate = prompt('أدخل سعر الصرف الجديد (1$ = ... ج.م):', '30.90');
        
        if (newRate && !isNaN(newRate)) {
            const settings = getSettings();
            settings.financial.exchangeRate = parseFloat(newRate);
            setSettings(settings);
            
            const rateElement = document.getElementById('exchange-rate');
            if (rateElement) {
                rateElement.textContent = newRate;
            }
            
            APP_CORE.showToast(`تم تحديث سعر الصرف: 1$ = ${newRate} ج.م ✅`, 'success');
        }
    }

    // ==================== Public API ====================
    console.log('✅ APP_SETTINGS جاهز');
    
    return {
        initializeSettings,
        setCurrency,
        toggleDualCurrency,
        updateExchangeRate,
        getSettings,
        setSettings,
        getDefaultSettings
    };
})();

if (typeof APP_SETTINGS !== 'undefined') {
    console.log('✅ APP_SETTINGS تم تعريفه بنجاح');
} else {
    console.error('❌ فشل تعريف APP_SETTINGS');
}