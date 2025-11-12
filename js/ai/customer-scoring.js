// ==================== تقييم وتصنيف العملاء ====================
const AI_CUSTOMER_SCORING = (function() {
    'use strict';

    // ==================== تصنيفات العملاء ====================
    const CUSTOMER_CATEGORIES = {
        VIP: {
            name: 'VIP',
            nameAr: 'عميل مميز جداً',
            icon: '👑',
            color: '#FFD700',
            minScore: 80,
            benefits: ['أولوية قصوى', 'خصم خاص', 'دعم مخصص']
        },
        ACTIVE: {
            name: 'ACTIVE',
            nameAr: 'عميل نشط',
            icon: '✅',
            color: '#10b981',
            minScore: 60,
            benefits: ['متابعة منتظمة', 'عروض موسمية']
        },
        SLEEPING: {
            name: 'SLEEPING',
            nameAr: 'عميل خامل',
            icon: '😴',
            color: '#f59e0b',
            minScore: 40,
            benefits: ['إعادة تنشيط', 'عروض خاصة']
        },
        RISKY: {
            name: 'RISKY',
            nameAr: 'عميل محفوف بالمخاطر',
            icon: '⚠️',
            color: '#ef4444',
            minScore: 0,
            benefits: ['مراجعة الحساب', 'تحديد شروط دفع']
        }
    };

    // ==================== أوزان التقييم ====================
    const SCORING_WEIGHTS = {
        totalSales: 0.30,      // إجمالي المبيعات
        orderFrequency: 0.25,  // تكرار الطلبات
        paymentSpeed: 0.20,    // سرعة الدفع
        profitMargin: 0.15,    // هامش الربح
        collectionRate: 0.10   // نسبة التحصيل
    };

    // ==================== تقييم عميل واحد ====================
    function scoreCustomer(customer, sales) {
        const metrics = calculateDetailedMetrics(customer, sales);
        const score = calculateWeightedScore(metrics);
        const category = categorizeByScore(score);
        const insights = generateDetailedInsights(customer, metrics, category);
        const predictions = predictCustomerBehavior(metrics);
        
        return {
            customerId: customer.id,
            customerName: customer.name,
            score: Math.round(score * 10) / 10,
            category,
            metrics,
            insights,
            predictions,
            recommendations: generateRecommendations(category, metrics, predictions)
        };
    }

    // ==================== حساب المؤشرات التفصيلية ====================
    function calculateDetailedMetrics(customer, sales) {
        const now = new Date();
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        
        // تصفية المبيعات
        const allTimeSales = sales.filter(s => 
            s.customerId === customer.id || s.customerName === customer.name
        );
        
        const lastMonthSales = allTimeSales.filter(s => new Date(s.date) >= oneMonthAgo);
        const last3MonthsSales = allTimeSales.filter(s => new Date(s.date) >= threeMonthsAgo);
        const last6MonthsSales = allTimeSales.filter(s => new Date(s.date) >= sixMonthsAgo);
        const lastYearSales = allTimeSales.filter(s => new Date(s.date) >= oneYearAgo);
        
        // حسابات أساسية
        const totalSales = allTimeSales.reduce((sum, s) => sum + (s.total || s.totalAmount || 0), 0);
        const orderCount = allTimeSales.length;
        const avgOrderValue = orderCount > 0 ? totalSales / orderCount : 0;
        
        // آخر طلب
        const lastOrder = allTimeSales.length > 0 
            ? allTimeSales.reduce((latest, s) => 
                new Date(s.date) > new Date(latest.date) ? s : latest
              )
            : null;
        
        const daysSinceLastOrder = lastOrder 
            ? Math.floor((now - new Date(lastOrder.date)) / (1000 * 60 * 60 * 24))
            : 999;
        
        // معدل الطلبات
        const ordersPerMonth = orderCount > 0 && lastYearSales.length > 0
            ? (lastYearSales.length / 12)
            : 0;
        
        // نسبة التحصيل
        const totalPaid = customer.totalPaid || 0;
        const collectionRate = totalSales > 0 ? (totalPaid / totalSales) : 1;
        
        // سرعة الدفع (متوسط الأيام للدفع)
        const avgPaymentDays = customer.paymentTerms || 30;
        const paymentSpeedScore = Math.max(0, 1 - (avgPaymentDays / 90));
        
        // هامش الربح التقديري
        const profitMargin = calculateProfitMargin(allTimeSales);
        
        // القيمة الدائمة للعميل (CLV)
        const customerLifetimeValue = totalSales;
        
        // معدل النمو
        const growthRate = calculateGrowthRate(lastYearSales);
        
        return {
            // أساسي
            totalSales,
            orderCount,
            avgOrderValue,
            
            // التكرار
            ordersLastMonth: lastMonthSales.length,
            ordersLast3Months: last3MonthsSales.length,
            ordersLast6Months: last6MonthsSales.length,
            ordersLastYear: lastYearSales.length,
            ordersPerMonth,
            
            // الحداثة
            daysSinceLastOrder,
            lastOrderDate: lastOrder ? lastOrder.date : null,
            lastOrderValue: lastOrder ? (lastOrder.total || lastOrder.totalAmount || 0) : 0,
            
            // المالية
            collectionRate,
            paymentSpeedScore,
            profitMargin,
            balance: customer.balance || customer.currentBalance || 0,
            
            // متقدم
            customerLifetimeValue,
            growthRate,
            
            // اتجاه
            trend: growthRate > 0.1 ? 'increasing' : growthRate < -0.1 ? 'decreasing' : 'stable'
        };
    }

    // ==================== حساب هامش الربح ====================
    function calculateProfitMargin(sales) {
        // يمكن تحسينها بناءً على بيانات التكاليف الحقيقية
        // حالياً نستخدم هامش تقديري
        if (sales.length === 0) return 0.25;
        
        // إذا كانت هناك بيانات مشتريات مرتبطة
        let totalRevenue = 0;
        let totalCost = 0;
        
        sales.forEach(sale => {
            totalRevenue += sale.total || sale.totalAmount || 0;
            // يمكن إضافة منطق لحساب التكلفة من المشتريات المرتبطة
            if (sale.linkedPurchase && typeof APP_UNIFIED !== 'undefined') {
                const purchases = APP_UNIFIED.getAllPurchases();
                const linkedPurchase = purchases.find(p => p.id === sale.linkedPurchase);
                if (linkedPurchase) {
                    totalCost += linkedPurchase.total || 0;
                }
            }
        });
        
        if (totalCost === 0) return 0.25; // هامش افتراضي
        
        return totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) : 0;
    }

    // ==================== حساب معدل النمو ====================
    function calculateGrowthRate(sales) {
        if (sales.length < 2) return 0;
        
        // تقسيم إلى نصفين
        const midPoint = Math.floor(sales.length / 2);
        const firstHalf = sales.slice(0, midPoint);
        const secondHalf = sales.slice(midPoint);
        
        const firstHalfTotal = firstHalf.reduce((sum, s) => sum + (s.total || 0), 0);
        const secondHalfTotal = secondHalf.reduce((sum, s) => sum + (s.total || 0), 0);
        
        if (firstHalfTotal === 0) return 0;
        
        return (secondHalfTotal - firstHalfTotal) / firstHalfTotal;
    }

    // ==================== حساب النقاط الموزونة ====================
    function calculateWeightedScore(metrics) {
        const scores = {
            totalSales: normalizeValue(metrics.totalSales, 0, 100000),
            orderFrequency: normalizeValue(metrics.ordersPerMonth, 0, 5),
            paymentSpeed: metrics.paymentSpeedScore,
            profitMargin: metrics.profitMargin,
            collectionRate: metrics.collectionRate
        };
        
        let totalScore = 0;
        for (const key in SCORING_WEIGHTS) {
            totalScore += (scores[key] || 0) * SCORING_WEIGHTS[key];
        }
        
        // خصم بناءً على الحداثة
        if (metrics.daysSinceLastOrder > 90) {
            totalScore *= 0.8;
        } else if (metrics.daysSinceLastOrder > 180) {
            totalScore *= 0.6;
        }
        
        // مكافأة على النمو
        if (metrics.growthRate > 0.2) {
            totalScore *= 1.1;
        }
        
        return Math.min(100, totalScore * 100);
    }

    // ==================== تطبيع القيم ====================
    function normalizeValue(value, min, max) {
        if (max === min) return 0;
        return Math.max(0, Math.min(1, (value - min) / (max - min)));
    }

    // ==================== تصنيف حسب النقاط ====================
    function categorizeByScore(score) {
        if (score >= CUSTOMER_CATEGORIES.VIP.minScore) {
            return CUSTOMER_CATEGORIES.VIP;
        } else if (score >= CUSTOMER_CATEGORIES.ACTIVE.minScore) {
            return CUSTOMER_CATEGORIES.ACTIVE;
        } else if (score >= CUSTOMER_CATEGORIES.SLEEPING.minScore) {
            return CUSTOMER_CATEGORIES.SLEEPING;
        } else {
            return CUSTOMER_CATEGORIES.RISKY;
        }
    }

    // ==================== توليد رؤى تفصيلية ====================
    function generateDetailedInsights(customer, metrics, category) {
        const insights = [];
        
        // رؤى عامة
        insights.push({
            type: 'category',
            icon: category.icon,
            title: category.nameAr,
            message: `العميل مصنف كـ ${category.nameAr}`,
            severity: category.name === 'RISKY' ? 'warning' : 'info'
        });
        
        // رؤى عن المبيعات
        if (metrics.totalSales > 50000) {
            insights.push({
                type: 'sales',
                icon: '💰',
                title: 'مبيعات مرتفعة',
                message: `إجمالي المبيعات: ${formatCurrency(metrics.totalSales)}`,
                severity: 'success'
            });
        }
        
        // رؤى عن التكرار
        if (metrics.ordersPerMonth >= 3) {
            insights.push({
                type: 'frequency',
                icon: '🔥',
                title: 'عميل منتظم',
                message: `معدل ${metrics.ordersPerMonth.toFixed(1)} طلب شهرياً`,
                severity: 'success'
            });
        } else if (metrics.ordersPerMonth < 0.5) {
            insights.push({
                type: 'frequency',
                icon: '⏰',
                title: 'طلبات نادرة',
                message: 'يحتاج متابعة لزيادة التكرار',
                severity: 'warning'
            });
        }
        
        // رؤى عن الحداثة
        if (metrics.daysSinceLastOrder > 90) {
            insights.push({
                type: 'recency',
                icon: '📅',
                title: 'لم يطلب منذ فترة',
                message: `آخر طلب منذ ${metrics.daysSinceLastOrder} يوم`,
                severity: 'warning'
            });
        }
        
        // رؤى عن التحصيل
        if (metrics.collectionRate < 0.7) {
            insights.push({
                type: 'collection',
                icon: '⚠️',
                title: 'مشكلة في التحصيل',
                message: `نسبة التحصيل: ${(metrics.collectionRate * 100).toFixed(1)}%`,
                severity: 'error'
            });
        } else if (metrics.collectionRate > 0.95) {
            insights.push({
                type: 'collection',
                icon: '✅',
                title: 'تحصيل ممتاز',
                message: `نسبة التحصيل: ${(metrics.collectionRate * 100).toFixed(1)}%`,
                severity: 'success'
            });
        }
        
        // رؤى عن الرصيد
        if (metrics.balance > 10000) {
            insights.push({
                type: 'balance',
                icon: '💵',
                title: 'رصيد مستحق',
                message: `مبلغ ${formatCurrency(metrics.balance)} مستحق`,
                severity: 'info'
            });
        }
        
        // رؤى عن الاتجاه
        if (metrics.trend === 'increasing') {
            insights.push({
                type: 'trend',
                icon: '📈',
                title: 'اتجاه إيجابي',
                message: 'المبيعات في تزايد',
                severity: 'success'
            });
        } else if (metrics.trend === 'decreasing') {
            insights.push({
                type: 'trend',
                icon: '📉',
                title: 'اتجاه سلبي',
                message: 'المبيعات في تناقص - يحتاج تدخل',
                severity: 'warning'
            });
        }
        
        return insights;
    }

    // ==================== التنبؤ بسلوك العميل ====================
    function predictCustomerBehavior(metrics) {
        // احتمالية الشراء القادم
        const purchaseProbability = calculatePurchaseProbability(metrics);
        
        // التاريخ المتوقع للطلب القادم
        const nextOrderDate = predictNextOrderDate(metrics);
        
        // القيمة المتوقعة للطلب القادم
        const nextOrderValue = metrics.avgOrderValue * (1 + metrics.growthRate);
        
        // احتمالية الخسارة (Churn Risk)
        const churnRisk = calculateChurnRisk(metrics);
        
        return {
            purchaseProbability,
            nextOrderDate,
            nextOrderValue,
            churnRisk,
            lifetime: estimateCustomerLifetime(metrics)
        };
    }

    function calculatePurchaseProbability(metrics) {
        let probability = 0.5; // baseline
        
        // زيادة بناءً على التكرار
        probability += Math.min(0.3, metrics.ordersPerMonth * 0.1);
        
        // تقليل بناءً على آخر طلب
        probability -= Math.min(0.4, metrics.daysSinceLastOrder / 365);
        
        // زيادة بناءً على الاتجاه
        if (metrics.trend === 'increasing') {
            probability += 0.1;
        } else if (metrics.trend === 'decreasing') {
            probability -= 0.1;
        }
        
        return Math.max(0, Math.min(1, probability));
    }

    function predictNextOrderDate(metrics) {
        if (metrics.ordersPerMonth === 0) return null;
        
        const avgDaysBetweenOrders = 30 / metrics.ordersPerMonth;
        const nextOrderDays = Math.round(metrics.daysSinceLastOrder + avgDaysBetweenOrders);
        
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + nextOrderDays);
        
        return nextDate.toISOString().split('T')[0];
    }

    function calculateChurnRisk(metrics) {
        let risk = 0;
        
        // زيادة بناءً على عدم النشاط
        if (metrics.daysSinceLastOrder > 180) {
            risk += 0.5;
        } else if (metrics.daysSinceLastOrder > 90) {
            risk += 0.3;
        }
        
        // زيادة بناءً على الاتجاه السلبي
        if (metrics.trend === 'decreasing') {
            risk += 0.2;
        }
        
        // زيادة بناءً على مشاكل التحصيل
        if (metrics.collectionRate < 0.7) {
            risk += 0.2;
        }
        
        return Math.min(1, risk);
    }

    function estimateCustomerLifetime(metrics) {
        // تقدير بسيط بناءً على النشاط
        if (metrics.ordersPerMonth >= 2) return 'طويل الأمد';
        if (metrics.ordersPerMonth >= 1) return 'متوسط الأمد';
        return 'قصير الأمد';
    }

    // ==================== التوصيات ====================
    function generateRecommendations(category, metrics, predictions) {
        const recommendations = [];
        
        // توصيات حسب التصنيف
        if (category.name === 'VIP') {
            recommendations.push({
                priority: 'high',
                action: 'حافظ على العلاقة',
                details: 'قدم خدمة VIP وعروض حصرية'
            });
        } else if (category.name === 'SLEEPING') {
            recommendations.push({
                priority: 'high',
                action: 'أعد التنشيط',
                details: 'تواصل معه وقدم عرض خاص'
            });
        } else if (category.name === 'RISKY') {
            recommendations.push({
                priority: 'urgent',
                action: 'راجع الحساب',
                details: 'حدد شروط دفع جديدة وحدد حد ائتماني'
            });
        }
        
        // توصيات بناءً على التنبؤات
        if (predictions.churnRisk > 0.6) {
            recommendations.push({
                priority: 'urgent',
                action: 'خطر فقدان العميل',
                details: 'تواصل فوراً لمعرفة المشاكل'
            });
        }
        
        if (predictions.nextOrderDate && predictions.purchaseProbability > 0.7) {
            recommendations.push({
                priority: 'medium',
                action: 'فرصة بيع',
                details: `من المتوقع طلب في ${predictions.nextOrderDate}`
            });
        }
        
        // توصيات بناءً على الرصيد
        if (metrics.balance > 10000) {
            recommendations.push({
                priority: 'medium',
                action: 'متابعة التحصيل',
                details: `مبلغ ${formatCurrency(metrics.balance)} مستحق`
            });
        }
        
        return recommendations;
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
        scoreCustomer,
        CUSTOMER_CATEGORIES,
        SCORING_WEIGHTS
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.AI_CUSTOMER_SCORING = AI_CUSTOMER_SCORING;
}
