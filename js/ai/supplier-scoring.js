// ==================== تقييم وتصنيف الموردين ====================
const AI_SUPPLIER_SCORING = (function() {
    'use strict';

    // ==================== تصنيفات الموردين ====================
    const SUPPLIER_CATEGORIES = {
        EXCELLENT: {
            name: 'EXCELLENT',
            nameAr: 'مورد ممتاز',
            icon: '⭐',
            color: '#FFD700',
            minScore: 85
        },
        GOOD: {
            name: 'GOOD',
            nameAr: 'مورد جيد',
            icon: '✅',
            color: '#10b981',
            minScore: 70
        },
        AVERAGE: {
            name: 'AVERAGE',
            nameAr: 'مورد متوسط',
            icon: '⚡',
            color: '#f59e0b',
            minScore: 50
        },
        POOR: {
            name: 'POOR',
            nameAr: 'مورد ضعيف',
            icon: '⚠️',
            color: '#ef4444',
            minScore: 0
        }
    };

    // ==================== أوزان التقييم ====================
    const SCORING_WEIGHTS = {
        price: 0.25,          // السعر
        quality: 0.25,        // الجودة
        deliverySpeed: 0.20,  // سرعة التوصيل
        reliability: 0.20,    // الموثوقية
        paymentTerms: 0.10    // شروط الدفع
    };

    // ==================== تقييم مورد واحد ====================
    function scoreSupplier(supplier, purchases) {
        const metrics = calculateSupplierMetrics(supplier, purchases);
        const score = calculateWeightedScore(metrics);
        const category = categorizeByScore(score);
        const insights = generateSupplierInsights(supplier, metrics, category);
        const recommendations = generateSupplierRecommendations(category, metrics);
        
        return {
            supplierId: supplier.id,
            supplierName: supplier.name,
            score: Math.round(score * 10) / 10,
            category,
            metrics,
            insights,
            recommendations,
            bestFor: determineBestUse(metrics)
        };
    }

    // ==================== حساب مؤشرات المورد ====================
    function calculateSupplierMetrics(supplier, purchases) {
        const supplierPurchases = purchases.filter(p => 
            p.supplierId === supplier.id || p.supplierName === supplier.name
        );
        
        // حسابات أساسية
        const totalPurchases = supplierPurchases.reduce((sum, p) => 
            sum + (p.total || p.totalAmount || 0), 0
        );
        const purchaseCount = supplierPurchases.length;
        const avgPurchaseValue = purchaseCount > 0 ? totalPurchases / purchaseCount : 0;
        
        // آخر عملية شراء
        const lastPurchase = supplierPurchases.length > 0
            ? supplierPurchases.reduce((latest, p) => 
                new Date(p.date) > new Date(latest.date) ? p : latest
              )
            : null;
        
        const daysSinceLastPurchase = lastPurchase
            ? Math.floor((new Date() - new Date(lastPurchase.date)) / (1000 * 60 * 60 * 24))
            : 999;
        
        // تكرار الشراء
        const purchasesPerMonth = calculatePurchaseFrequency(supplierPurchases);
        
        // تقييمات الأداء
        const priceScore = calculatePriceScore(supplier, supplierPurchases);
        const qualityScore = calculateQualityScore(supplier);
        const deliveryScore = calculateDeliveryScore(supplier, supplierPurchases);
        const reliabilityScore = calculateReliabilityScore(supplier, supplierPurchases);
        const paymentTermsScore = calculatePaymentTermsScore(supplier);
        
        // مؤشرات مالية
        const totalOwed = supplier.balance || supplier.currentBalance || 0;
        const paymentStatus = totalOwed > 10000 ? 'pending' : 'clear';
        
        // اتجاه الأسعار
        const priceTrend = analyzePriceTrend(supplierPurchases);
        
        return {
            // أساسي
            totalPurchases,
            purchaseCount,
            avgPurchaseValue,
            
            // التكرار
            purchasesPerMonth,
            daysSinceLastPurchase,
            lastPurchaseDate: lastPurchase ? lastPurchase.date : null,
            
            // الأداء
            priceScore,
            qualityScore,
            deliveryScore,
            reliabilityScore,
            paymentTermsScore,
            
            // المالية
            totalOwed,
            paymentStatus,
            paymentTerms: supplier.paymentTerms || 30,
            
            // الاتجاهات
            priceTrend
        };
    }

    // ==================== حساب تكرار الشراء ====================
    function calculatePurchaseFrequency(purchases) {
        if (purchases.length < 2) return 0;
        
        const sortedPurchases = [...purchases].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
        
        const firstDate = new Date(sortedPurchases[0].date);
        const lastDate = new Date(sortedPurchases[sortedPurchases.length - 1].date);
        
        const monthsDiff = (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 30);
        
        return monthsDiff > 0 ? purchases.length / monthsDiff : 0;
    }

    // ==================== حساب نقاط السعر ====================
    function calculatePriceScore(supplier, purchases) {
        // مقارنة مع متوسط السوق (يمكن تحسينها)
        // حالياً نستخدم تقييم ثابت من بيانات المورد
        if (supplier.rating === 'excellent') return 0.9;
        if (supplier.rating === 'good') return 0.8;
        if (supplier.rating === 'average') return 0.7;
        return 0.6;
    }

    // ==================== حساب نقاط الجودة ====================
    function calculateQualityScore(supplier) {
        // بناءً على التقييم الموجود
        if (supplier.rating === 'excellent') return 1.0;
        if (supplier.rating === 'good') return 0.85;
        if (supplier.rating === 'average') return 0.7;
        return 0.5;
    }

    // ==================== حساب نقاط التوصيل ====================
    function calculateDeliveryScore(supplier, purchases) {
        // تقييم افتراضي (يمكن تحسينه ببيانات حقيقية)
        const baseScore = 0.85;
        
        // مكافأة على التكرار (موثوقية)
        if (purchases.length > 10) return Math.min(1.0, baseScore + 0.1);
        if (purchases.length > 5) return baseScore;
        
        return baseScore - 0.1;
    }

    // ==================== حساب نقاط الموثوقية ====================
    function calculateReliabilityScore(supplier, purchases) {
        let score = 0.8; // baseline
        
        // زيادة بناءً على عدد المشتريات الناجحة
        if (purchases.length > 15) {
            score = 0.95;
        } else if (purchases.length > 10) {
            score = 0.9;
        } else if (purchases.length > 5) {
            score = 0.85;
        }
        
        // تقليل إذا كان هناك مشاكل (يمكن إضافة منطق لتتبع المشاكل)
        
        return score;
    }

    // ==================== حساب نقاط شروط الدفع ====================
    function calculatePaymentTermsScore(supplier) {
        const paymentTerms = supplier.paymentTerms || 30;
        
        // كلما كانت المدة أطول، كان أفضل للتدفق النقدي
        if (paymentTerms >= 60) return 1.0;
        if (paymentTerms >= 45) return 0.9;
        if (paymentTerms >= 30) return 0.8;
        if (paymentTerms >= 15) return 0.7;
        return 0.6;
    }

    // ==================== تحليل اتجاه الأسعار ====================
    function analyzePriceTrend(purchases) {
        if (purchases.length < 3) return 'stable';
        
        const sortedPurchases = [...purchases].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
        
        const prices = sortedPurchases.map(p => 
            (p.total || p.totalAmount || 0) / Math.max(1, p.quantity || 1)
        );
        
        const firstHalf = prices.slice(0, Math.floor(prices.length / 2));
        const secondHalf = prices.slice(Math.floor(prices.length / 2));
        
        const firstAvg = firstHalf.reduce((sum, p) => sum + p, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, p) => sum + p, 0) / secondHalf.length;
        
        const change = (secondAvg - firstAvg) / firstAvg;
        
        if (change > 0.1) return 'increasing';
        if (change < -0.1) return 'decreasing';
        return 'stable';
    }

    // ==================== حساب النقاط الموزونة ====================
    function calculateWeightedScore(metrics) {
        const scores = {
            price: metrics.priceScore,
            quality: metrics.qualityScore,
            deliverySpeed: metrics.deliveryScore,
            reliability: metrics.reliabilityScore,
            paymentTerms: metrics.paymentTermsScore
        };
        
        let totalScore = 0;
        for (const key in SCORING_WEIGHTS) {
            totalScore += (scores[key] || 0) * SCORING_WEIGHTS[key];
        }
        
        return totalScore * 100;
    }

    // ==================== تصنيف حسب النقاط ====================
    function categorizeByScore(score) {
        if (score >= SUPPLIER_CATEGORIES.EXCELLENT.minScore) {
            return SUPPLIER_CATEGORIES.EXCELLENT;
        } else if (score >= SUPPLIER_CATEGORIES.GOOD.minScore) {
            return SUPPLIER_CATEGORIES.GOOD;
        } else if (score >= SUPPLIER_CATEGORIES.AVERAGE.minScore) {
            return SUPPLIER_CATEGORIES.AVERAGE;
        } else {
            return SUPPLIER_CATEGORIES.POOR;
        }
    }

    // ==================== توليد رؤى عن المورد ====================
    function generateSupplierInsights(supplier, metrics, category) {
        const insights = [];
        
        // رؤية عامة
        insights.push({
            type: 'category',
            icon: category.icon,
            title: category.nameAr,
            message: `مصنف كـ ${category.nameAr}`,
            severity: category.name === 'POOR' ? 'warning' : 'info'
        });
        
        // رؤى عن الجودة
        if (metrics.qualityScore >= 0.9) {
            insights.push({
                type: 'quality',
                icon: '⭐',
                title: 'جودة ممتازة',
                message: 'منتجات عالية الجودة',
                severity: 'success'
            });
        }
        
        // رؤى عن السعر
        if (metrics.priceScore >= 0.85) {
            insights.push({
                type: 'price',
                icon: '💰',
                title: 'أسعار تنافسية',
                message: 'أسعار جيدة مقارنة بالسوق',
                severity: 'success'
            });
        }
        
        // رؤى عن اتجاه الأسعار
        if (metrics.priceTrend === 'increasing') {
            insights.push({
                type: 'trend',
                icon: '📈',
                title: 'ارتفاع الأسعار',
                message: 'الأسعار في ازدياد - فكر في بدائل',
                severity: 'warning'
            });
        } else if (metrics.priceTrend === 'decreasing') {
            insights.push({
                type: 'trend',
                icon: '📉',
                title: 'انخفاض الأسعار',
                message: 'الأسعار في انخفاض - فرصة جيدة',
                severity: 'success'
            });
        }
        
        // رؤى عن التوصيل
        if (metrics.deliveryScore >= 0.9) {
            insights.push({
                type: 'delivery',
                icon: '🚚',
                title: 'توصيل سريع',
                message: 'توصيل موثوق وسريع',
                severity: 'success'
            });
        }
        
        // رؤى عن الموثوقية
        if (metrics.reliabilityScore >= 0.9) {
            insights.push({
                type: 'reliability',
                icon: '🤝',
                title: 'مورد موثوق',
                message: `${metrics.purchaseCount} عملية شراء ناجحة`,
                severity: 'success'
            });
        }
        
        // رؤى عن شروط الدفع
        if (metrics.paymentTerms >= 60) {
            insights.push({
                type: 'payment',
                icon: '💵',
                title: 'شروط دفع مرنة',
                message: `${metrics.paymentTerms} يوم للدفع`,
                severity: 'success'
            });
        }
        
        // رؤى عن المستحقات
        if (metrics.totalOwed > 10000) {
            insights.push({
                type: 'balance',
                icon: '⚠️',
                title: 'مبالغ مستحقة',
                message: `${formatCurrency(metrics.totalOwed)} مستحق الدفع`,
                severity: 'warning'
            });
        }
        
        return insights;
    }

    // ==================== التوصيات ====================
    function generateSupplierRecommendations(category, metrics) {
        const recommendations = [];
        
        // توصيات حسب التصنيف
        if (category.name === 'EXCELLENT') {
            recommendations.push({
                priority: 'high',
                action: 'مورد مفضل',
                details: 'استخدمه كمورد رئيسي'
            });
        } else if (category.name === 'POOR') {
            recommendations.push({
                priority: 'urgent',
                action: 'ابحث عن بديل',
                details: 'الأداء ضعيف - ابحث عن موردين أفضل'
            });
        }
        
        // توصيات بناءً على الأسعار
        if (metrics.priceTrend === 'increasing') {
            recommendations.push({
                priority: 'medium',
                action: 'راقب الأسعار',
                details: 'الأسعار ترتفع - قارن مع موردين آخرين'
            });
        }
        
        // توصيات بناءً على المستحقات
        if (metrics.totalOwed > 10000) {
            recommendations.push({
                priority: 'high',
                action: 'سدد المستحقات',
                details: 'تجنب المشاكل مع المورد'
            });
        }
        
        // توصيات بناءً على التكرار
        if (metrics.purchasesPerMonth < 0.5) {
            recommendations.push({
                priority: 'low',
                action: 'مورد احتياطي',
                details: 'شراء نادر - احتفظ به كخيار احتياطي'
            });
        }
        
        return recommendations;
    }

    // ==================== تحديد الاستخدام الأمثل ====================
    function determineBestUse(metrics) {
        const uses = [];
        
        if (metrics.qualityScore >= 0.9 && metrics.priceScore >= 0.8) {
            uses.push('منتجات عالية الجودة');
        }
        
        if (metrics.priceScore >= 0.9) {
            uses.push('مشتريات كبيرة الحجم');
        }
        
        if (metrics.deliveryScore >= 0.9) {
            uses.push('طلبات عاجلة');
        }
        
        if (metrics.paymentTermsScore >= 0.9) {
            uses.push('تحسين التدفق النقدي');
        }
        
        if (uses.length === 0) {
            uses.push('مورد احتياطي');
        }
        
        return uses;
    }

    // ==================== مقارنة الموردين ====================
    function compareSuppliers(suppliers, purchases) {
        const scoredSuppliers = suppliers.map(supplier => 
            scoreSupplier(supplier, purchases)
        );
        
        // ترتيب حسب النقاط
        scoredSuppliers.sort((a, b) => b.score - a.score);
        
        return {
            ranked: scoredSuppliers,
            best: scoredSuppliers[0],
            worst: scoredSuppliers[scoredSuppliers.length - 1],
            comparison: generateComparison(scoredSuppliers)
        };
    }

    function generateComparison(scoredSuppliers) {
        if (scoredSuppliers.length < 2) return null;
        
        return {
            bestPrice: findBest(scoredSuppliers, 'priceScore'),
            bestQuality: findBest(scoredSuppliers, 'qualityScore'),
            fastestDelivery: findBest(scoredSuppliers, 'deliveryScore'),
            mostReliable: findBest(scoredSuppliers, 'reliabilityScore'),
            bestPaymentTerms: findBest(scoredSuppliers, 'paymentTermsScore')
        };
    }

    function findBest(suppliers, metricKey) {
        let best = suppliers[0];
        suppliers.forEach(supplier => {
            if (supplier.metrics[metricKey] > best.metrics[metricKey]) {
                best = supplier;
            }
        });
        return {
            name: best.supplierName,
            score: best.metrics[metricKey]
        };
    }

    // ==================== اقتراح أفضل مورد لمنتج ====================
    function suggestBestSupplierForProduct(productCategory, suppliers, purchases) {
        const scoredSuppliers = suppliers.map(supplier => 
            scoreSupplier(supplier, purchases)
        );
        
        // فلترة حسب الفئة (إذا كانت متاحة)
        // حالياً نرجع الأفضل بشكل عام
        const sorted = scoredSuppliers.sort((a, b) => b.score - a.score);
        
        return {
            recommended: sorted[0],
            alternatives: sorted.slice(1, 4),
            reason: `أفضل مورد بنقاط ${sorted[0].score.toFixed(1)}`
        };
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
        scoreSupplier,
        compareSuppliers,
        suggestBestSupplierForProduct,
        SUPPLIER_CATEGORIES,
        SCORING_WEIGHTS
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.AI_SUPPLIER_SCORING = AI_SUPPLIER_SCORING;
}
