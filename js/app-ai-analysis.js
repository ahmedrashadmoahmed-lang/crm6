// ==================== تحليل البيانات بالذكاء الاصطناعي ====================
const APP_AI_ANALYSIS = (function() {
    'use strict';

    // ==================== Customer Analysis ====================
    
    /**
     * تحليل شامل للعملاء
     */
    function analyzeCustomers() {
        if (typeof APP_UNIFIED === 'undefined') {
            console.error('❌ النظام الموحد غير متاح');
            return null;
        }
        
        const customers = APP_UNIFIED.getAllCustomers();
        const sales = APP_UNIFIED.getAllSales();
        
        if (customers.length === 0) {
            return {
                total: 0,
                analyzed: [],
                summary: {
                    vip: 0,
                    active: 0,
                    sleeping: 0,
                    risky: 0
                }
            };
        }
        
        const analyzed = customers.map(customer => {
            const customerSales = sales.filter(s => 
                s.customerId === customer.id || s.customerName === customer.name
            );
            
            const metrics = calculateCustomerMetrics(customer, customerSales);
            const classification = classifyCustomer(metrics);
            const score = calculateCustomerScore(metrics);
            
            return {
                ...customer,
                metrics,
                classification,
                score,
                aiInsights: generateCustomerInsights(customer, metrics, classification)
            };
        });
        
        // ترتيب حسب النقاط
        analyzed.sort((a, b) => b.score - a.score);
        
        // ملخص
        const summary = {
            vip: analyzed.filter(c => c.classification === 'vip').length,
            active: analyzed.filter(c => c.classification === 'active').length,
            sleeping: analyzed.filter(c => c.classification === 'sleeping').length,
            risky: analyzed.filter(c => c.classification === 'risky').length
        };
        
        return {
            total: customers.length,
            analyzed,
            summary,
            topCustomers: analyzed.slice(0, 10)
        };
    }

    /**
     * حساب مؤشرات العميل
     */
    function calculateCustomerMetrics(customer, sales) {
        const totalSales = sales.reduce((sum, s) => sum + (s.total || s.totalAmount || 0), 0);
        const orderCount = sales.length;
        const avgOrderValue = orderCount > 0 ? totalSales / orderCount : 0;
        
        // حساب تكرار الطلبات (عدد الطلبات في آخر 3 أشهر)
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const recentOrders = sales.filter(s => new Date(s.date) >= threeMonthsAgo).length;
        
        // حساب آخر طلب
        const lastOrderDate = sales.length > 0 
            ? new Date(Math.max(...sales.map(s => new Date(s.date).getTime())))
            : null;
        const daysSinceLastOrder = lastOrderDate 
            ? Math.floor((new Date() - lastOrderDate) / (1000 * 60 * 60 * 24))
            : 999;
        
        // نسبة التحصيل
        const totalPaid = customer.totalPaid || 0;
        const collectionRate = totalSales > 0 ? (totalPaid / totalSales) : 1;
        
        // هامش الربح (تقديري)
        const profitMargin = 0.25; // يمكن حسابه من البيانات الحقيقية
        
        // سرعة الدفع (بالأيام)
        const paymentSpeed = customer.paymentTerms || 30;
        
        return {
            totalSales,
            orderCount,
            avgOrderValue,
            recentOrders,
            daysSinceLastOrder,
            collectionRate,
            profitMargin,
            paymentSpeed,
            balance: customer.balance || customer.currentBalance || 0
        };
    }

    /**
     * تصنيف العميل
     */
    function classifyCustomer(metrics) {
        const { totalSales, recentOrders, daysSinceLastOrder, collectionRate } = metrics;
        
        // VIP: مبيعات عالية + طلبات حديثة + تحصيل جيد
        if (totalSales > 50000 && recentOrders >= 2 && collectionRate > 0.9) {
            return 'vip';
        }
        
        // Active: طلبات حديثة + تحصيل جيد
        if (recentOrders >= 1 && collectionRate > 0.8 && daysSinceLastOrder < 90) {
            return 'active';
        }
        
        // Risky: تحصيل ضعيف
        if (collectionRate < 0.7) {
            return 'risky';
        }
        
        // Sleeping: لا يوجد طلبات حديثة
        if (daysSinceLastOrder > 90) {
            return 'sleeping';
        }
        
        return 'active';
    }

    /**
     * حساب نقاط العميل (0-100)
     */
    function calculateCustomerScore(metrics) {
        if (typeof APP_AI_ENGINE === 'undefined') {
            // حساب بسيط بدون AI Engine
            return Math.min(100, (
                (metrics.totalSales / 1000) * 0.3 +
                (metrics.recentOrders * 10) * 0.25 +
                (metrics.collectionRate * 100) * 0.20 +
                (Math.max(0, 100 - metrics.daysSinceLastOrder)) * 0.15 +
                (metrics.profitMargin * 100) * 0.10
            ));
        }
        
        // استخدام AI Engine للحساب
        const weights = {
            totalSalesNorm: 0.30,
            orderFrequency: 0.25,
            collectionRate: 0.20,
            recency: 0.15,
            profitMargin: 0.10
        };
        
        const normalizedMetrics = {
            totalSalesNorm: APP_AI_ENGINE.normalize(metrics.totalSales, 0, 100000),
            orderFrequency: APP_AI_ENGINE.normalize(metrics.recentOrders, 0, 10),
            collectionRate: metrics.collectionRate,
            recency: APP_AI_ENGINE.normalize(Math.max(0, 90 - metrics.daysSinceLastOrder), 0, 90),
            profitMargin: metrics.profitMargin
        };
        
        return APP_AI_ENGINE.calculateScore(normalizedMetrics, weights);
    }

    /**
     * توليد رؤى ذكية عن العميل
     */
    function generateCustomerInsights(customer, metrics, classification) {
        const insights = [];
        
        // رؤى حسب التصنيف
        switch (classification) {
            case 'vip':
                insights.push('✨ عميل VIP - أولوية قصوى');
                insights.push('💎 حافظ على علاقة ممتازة');
                break;
            case 'active':
                insights.push('✅ عميل نشط - متابعة منتظمة');
                break;
            case 'sleeping':
                insights.push('😴 عميل خامل - يحتاج تواصل');
                insights.push(`📅 آخر طلب منذ ${metrics.daysSinceLastOrder} يوم`);
                break;
            case 'risky':
                insights.push('⚠️ عميل محفوف بالمخاطر');
                insights.push(`💰 نسبة التحصيل: ${(metrics.collectionRate * 100).toFixed(1)}%`);
                break;
        }
        
        // رؤى عن حجم المبيعات
        if (metrics.totalSales > 50000) {
            insights.push(`🎯 مبيعات مرتفعة: ${formatCurrency(metrics.totalSales)}`);
        }
        
        // رؤى عن التحصيل
        if (metrics.balance > 10000) {
            insights.push(`💵 رصيد مستحق: ${formatCurrency(metrics.balance)}`);
        }
        
        // رؤى عن معدل الطلبات
        if (metrics.recentOrders >= 3) {
            insights.push('🔥 معدل طلبات عالي');
        }
        
        return insights;
    }

    // ==================== Supplier Analysis ====================
    
    /**
     * تحليل شامل للموردين
     */
    function analyzeSuppliers() {
        if (typeof APP_UNIFIED === 'undefined') {
            return null;
        }
        
        const suppliers = APP_UNIFIED.getAllSuppliers();
        const purchases = APP_UNIFIED.getAllPurchases();
        
        if (suppliers.length === 0) {
            return {
                total: 0,
                analyzed: [],
                summary: {}
            };
        }
        
        const analyzed = suppliers.map(supplier => {
            const supplierPurchases = purchases.filter(p => 
                p.supplierId === supplier.id || p.supplierName === supplier.name
            );
            
            const metrics = calculateSupplierMetrics(supplier, supplierPurchases);
            const score = calculateSupplierScore(metrics);
            
            return {
                ...supplier,
                metrics,
                score,
                aiInsights: generateSupplierInsights(supplier, metrics)
            };
        });
        
        // ترتيب حسب النقاط
        analyzed.sort((a, b) => b.score - a.score);
        
        return {
            total: suppliers.length,
            analyzed,
            topSuppliers: analyzed.slice(0, 10)
        };
    }

    /**
     * حساب مؤشرات المورد
     */
    function calculateSupplierMetrics(supplier, purchases) {
        const totalPurchases = purchases.reduce((sum, p) => sum + (p.total || p.totalAmount || 0), 0);
        const purchaseCount = purchases.length;
        const avgPurchaseValue = purchaseCount > 0 ? totalPurchases / purchaseCount : 0;
        
        // تقييمات تقديرية (يمكن تحسينها بناءً على بيانات حقيقية)
        const priceScore = 0.8; // نسبة السعر للسوق
        const qualityScore = supplier.rating === 'excellent' ? 1.0 : 
                           supplier.rating === 'good' ? 0.8 : 0.6;
        const deliveryScore = 0.85;
        const reliabilityScore = 0.9;
        
        return {
            totalPurchases,
            purchaseCount,
            avgPurchaseValue,
            priceScore,
            qualityScore,
            deliveryScore,
            reliabilityScore,
            paymentTerms: supplier.paymentTerms || 30
        };
    }

    /**
     * حساب نقاط المورد (0-100)
     */
    function calculateSupplierScore(metrics) {
        if (typeof APP_AI_ENGINE === 'undefined') {
            return (
                metrics.priceScore * 25 +
                metrics.qualityScore * 25 +
                metrics.deliveryScore * 20 +
                metrics.reliabilityScore * 20 +
                (1 - metrics.paymentTerms / 90) * 10
            ) * 100;
        }
        
        const weights = {
            priceScore: 0.25,
            qualityScore: 0.25,
            deliveryScore: 0.20,
            reliabilityScore: 0.20,
            paymentTerms: 0.10
        };
        
        const normalizedMetrics = {
            priceScore: metrics.priceScore,
            qualityScore: metrics.qualityScore,
            deliveryScore: metrics.deliveryScore,
            reliabilityScore: metrics.reliabilityScore,
            paymentTerms: 1 - APP_AI_ENGINE.normalize(metrics.paymentTerms, 0, 90)
        };
        
        return APP_AI_ENGINE.calculateScore(normalizedMetrics, weights);
    }

    /**
     * توليد رؤى عن المورد
     */
    function generateSupplierInsights(supplier, metrics) {
        const insights = [];
        
        if (metrics.qualityScore >= 0.9) {
            insights.push('⭐ جودة ممتازة');
        }
        
        if (metrics.priceScore >= 0.85) {
            insights.push('💰 أسعار تنافسية');
        }
        
        if (metrics.deliveryScore >= 0.9) {
            insights.push('🚚 توصيل سريع');
        }
        
        if (metrics.purchaseCount > 5) {
            insights.push('🤝 شراكة طويلة الأمد');
        }
        
        return insights;
    }

    // ==================== Sales Analysis ====================
    
    /**
     * تحليل اتجاهات المبيعات
     */
    function analyzeSalesTrends() {
        if (typeof APP_UNIFIED === 'undefined' || typeof APP_AI_ENGINE === 'undefined') {
            return null;
        }
        
        const sales = APP_UNIFIED.getAllSales();
        
        if (sales.length < 2) {
            return {
                trend: 'insufficient_data',
                message: 'بيانات غير كافية للتحليل'
            };
        }
        
        const analysis = APP_AI_ENGINE.analyzeTimeSeries(sales, 'date', 'total');
        
        return {
            trend: analysis.trend,
            growth: (analysis.growth * 100).toFixed(2) + '%',
            confidence: (analysis.r2 * 100).toFixed(1) + '%',
            recommendation: getTrendRecommendation(analysis)
        };
    }

    function getTrendRecommendation(analysis) {
        if (analysis.trend === 'increasing') {
            return 'اتجاه إيجابي! استمر في نفس الاستراتيجية';
        } else if (analysis.trend === 'decreasing') {
            return 'تحذير: اتجاه سلبي. راجع استراتيجية المبيعات';
        } else {
            return 'اتجاه مستقر. فكر في فرص النمو';
        }
    }

    // ==================== Helper Functions ====================
    
    function formatCurrency(amount) {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // ==================== Public API ====================
    return {
        // Customer Analysis
        analyzeCustomers,
        calculateCustomerMetrics,
        classifyCustomer,
        calculateCustomerScore,
        
        // Supplier Analysis
        analyzeSuppliers,
        calculateSupplierMetrics,
        calculateSupplierScore,
        
        // Sales Analysis
        analyzeSalesTrends
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.APP_AI_ANALYSIS = APP_AI_ANALYSIS;
}
