// ==================== تحسين الأسعار وهامش الربح ====================
const AI_PRICING_OPTIMIZER = (function() {
    'use strict';

    // ==================== حساب السعر الأمثل ====================
    function calculateOptimalPrice(product, customer, context = {}) {
        const basePrice = product.price || product.basePrice || 0;
        
        // عوامل التسعير
        const customerFactor = getCustomerPricingFactor(customer);
        const volumeFactor = getVolumePricingFactor(context.quantity || 1);
        const seasonalFactor = getSeasonalFactor(context.season);
        const loyaltyFactor = getLoyaltyFactor(customer);
        const competitionFactor = getCompetitionFactor(context.competitorPrice);
        
        // السعر الأمثل
        let optimalPrice = basePrice * (
            customerFactor *
            volumeFactor *
            seasonalFactor *
            loyaltyFactor *
            competitionFactor
        );
        
        // حد أدنى (لا نبيع بخسارة)
        const minPrice = product.cost ? product.cost * 1.1 : basePrice * 0.8;
        optimalPrice = Math.max(optimalPrice, minPrice);
        
        // حد أقصى (لا نبالغ)
        const maxPrice = basePrice * 1.3;
        optimalPrice = Math.min(optimalPrice, maxPrice);
        
        // الخصم المقترح
        const discount = basePrice - optimalPrice;
        const discountPercent = (discount / basePrice) * 100;
        
        return {
            basePrice,
            optimalPrice: Math.round(optimalPrice * 100) / 100,
            discount: Math.round(discount * 100) / 100,
            discountPercent: Math.round(discountPercent * 10) / 10,
            factors: {
                customer: customerFactor,
                volume: volumeFactor,
                seasonal: seasonalFactor,
                loyalty: loyaltyFactor,
                competition: competitionFactor
            },
            recommendation: discount > 0 ? 'خصم مقترح' : 'سعر قياسي',
            profitMargin: calculateProfitMargin(optimalPrice, product.cost || basePrice * 0.7)
        };
    }

    // ==================== عامل تسعير العميل ====================
    function getCustomerPricingFactor(customer) {
        if (!customer) return 1.0;
        
        // VIP customers get better prices
        if (customer.classification === 'vip' || customer.score >= 80) {
            return 0.92; // 8% discount
        }
        
        // Active customers get good prices
        if (customer.classification === 'active' || customer.score >= 60) {
            return 0.95; // 5% discount
        }
        
        // Risky customers pay more (or no discount)
        if (customer.classification === 'risky' || customer.score < 40) {
            return 1.0; // no discount
        }
        
        return 0.97; // 3% discount for others
    }

    // ==================== عامل تسعير الكمية ====================
    function getVolumePricingFactor(quantity) {
        if (quantity >= 100) return 0.90; // 10% discount for bulk
        if (quantity >= 50) return 0.93;  // 7% discount
        if (quantity >= 20) return 0.95;  // 5% discount
        if (quantity >= 10) return 0.97;  // 3% discount
        return 1.0; // no volume discount
    }

    // ==================== عامل الموسمية ====================
    function getSeasonalFactor(season) {
        // يمكن تخصيصها حسب المنتج
        const seasonalFactors = {
            high: 1.1,    // موسم عالي - أسعار أعلى
            normal: 1.0,  // موسم عادي
            low: 0.95     // موسم منخفض - خصم لتحفيز المبيعات
        };
        
        return seasonalFactors[season] || 1.0;
    }

    // ==================== عامل الولاء ====================
    function getLoyaltyFactor(customer) {
        if (!customer || !customer.metrics) return 1.0;
        
        const { orderCount, totalSales } = customer.metrics;
        
        // عملاء قدامى ومخلصين
        if (orderCount >= 20 && totalSales >= 100000) {
            return 0.93; // 7% loyalty discount
        }
        
        if (orderCount >= 10 && totalSales >= 50000) {
            return 0.95; // 5% loyalty discount
        }
        
        if (orderCount >= 5) {
            return 0.97; // 3% loyalty discount
        }
        
        return 1.0;
    }

    // ==================== عامل المنافسة ====================
    function getCompetitionFactor(competitorPrice) {
        if (!competitorPrice) return 1.0;
        
        // نحاول أن نكون أقل بقليل من المنافس
        // لكن ليس بنسبة كبيرة
        return 0.98; // 2% أقل من السوق
    }

    // ==================== حساب هامش الربح ====================
    function calculateProfitMargin(price, cost) {
        if (!price || !cost) return 0;
        const margin = ((price - cost) / price) * 100;
        return Math.round(margin * 10) / 10;
    }

    // ==================== اقتراح خصم ذكي ====================
    function suggestSmartDiscount(customer, orderValue, context = {}) {
        let discountPercent = 0;
        const reasons = [];
        
        // خصم على أساس تصنيف العميل
        if (customer.classification === 'vip') {
            discountPercent += 8;
            reasons.push('عميل VIP');
        } else if (customer.classification === 'active') {
            discountPercent += 5;
            reasons.push('عميل نشط');
        }
        
        // خصم على أساس حجم الطلب
        if (orderValue >= 50000) {
            discountPercent += 7;
            reasons.push('طلب كبير الحجم');
        } else if (orderValue >= 20000) {
            discountPercent += 5;
            reasons.push('طلب متوسط');
        } else if (orderValue >= 10000) {
            discountPercent += 3;
            reasons.push('طلب جيد');
        }
        
        // خصم على أساس سجل الدفع
        if (customer.metrics && customer.metrics.collectionRate >= 0.95) {
            discountPercent += 2;
            reasons.push('دفع ممتاز');
        }
        
        // خصم موسمي
        if (context.isLowSeason) {
            discountPercent += 5;
            reasons.push('عرض موسمي');
        }
        
        // خصم لإعادة التنشيط
        if (customer.classification === 'sleeping') {
            discountPercent += 10;
            reasons.push('عرض إعادة تنشيط');
        }
        
        // حد أقصى للخصم
        discountPercent = Math.min(discountPercent, 25);
        
        const discountAmount = (orderValue * discountPercent) / 100;
        const finalAmount = orderValue - discountAmount;
        
        return {
            originalAmount: orderValue,
            discountPercent: Math.round(discountPercent * 10) / 10,
            discountAmount: Math.round(discountAmount * 100) / 100,
            finalAmount: Math.round(finalAmount * 100) / 100,
            reasons,
            recommendation: discountPercent > 0 ? `اقترح خصم ${discountPercent}%` : 'لا يوجد خصم مقترح'
        };
    }

    // ==================== حساب نقطة التعادل ====================
    function calculateBreakEven(fixedCosts, variableCostPerUnit, pricePerUnit) {
        if (pricePerUnit <= variableCostPerUnit) {
            return {
                error: 'السعر أقل من التكلفة المتغيرة!',
                units: Infinity
            };
        }
        
        const contributionMargin = pricePerUnit - variableCostPerUnit;
        const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
        const breakEvenRevenue = breakEvenUnits * pricePerUnit;
        
        return {
            units: breakEvenUnits,
            revenue: Math.round(breakEvenRevenue * 100) / 100,
            contributionMargin: Math.round(contributionMargin * 100) / 100,
            message: `يجب بيع ${breakEvenUnits} وحدة لتحقيق التعادل`
        };
    }

    // ==================== تحليل حساسية السعر ====================
    function analyzePriceSensitivity(basePrice, baseDemand, priceChanges = [-20, -10, 0, 10, 20]) {
        // نموذج بسيط لحساسية السعر
        // الطلب ينخفض عندما يرتفع السعر والعكس
        const elasticity = -1.5; // معامل المرونة السعرية
        
        const analysis = priceChanges.map(change => {
            const newPrice = basePrice * (1 + change / 100);
            const demandChange = change * elasticity;
            const newDemand = Math.round(baseDemand * (1 + demandChange / 100));
            const revenue = newPrice * newDemand;
            
            return {
                priceChange: change,
                price: Math.round(newPrice * 100) / 100,
                demand: newDemand,
                revenue: Math.round(revenue * 100) / 100
            };
        });
        
        // إيجاد السعر الأمثل (أعلى إيرادات)
        const optimal = analysis.reduce((best, current) => 
            current.revenue > best.revenue ? current : best
        );
        
        return {
            scenarios: analysis,
            optimal,
            recommendation: optimal.priceChange === 0 
                ? 'السعر الحالي مثالي'
                : `غيّر السعر بنسبة ${optimal.priceChange}% لزيادة الإيرادات`
        };
    }

    // ==================== تسعير ديناميكي ====================
    function dynamicPricing(product, market, time) {
        const basePrice = product.price || 0;
        let adjustedPrice = basePrice;
        const factors = [];
        
        // عامل الطلب
        if (market.demand === 'high') {
            adjustedPrice *= 1.15;
            factors.push('طلب عالي +15%');
        } else if (market.demand === 'low') {
            adjustedPrice *= 0.90;
            factors.push('طلب منخفض -10%');
        }
        
        // عامل المخزون
        if (product.stock < 10) {
            adjustedPrice *= 1.10;
            factors.push('مخزون منخفض +10%');
        } else if (product.stock > 100) {
            adjustedPrice *= 0.95;
            factors.push('مخزون عالي -5%');
        }
        
        // عامل الوقت (ساعات الذروة، أيام نهاية الأسبوع، إلخ)
        const hour = time ? new Date(time).getHours() : new Date().getHours();
        if (hour >= 10 && hour <= 14) {
            adjustedPrice *= 1.05;
            factors.push('ساعات ذروة +5%');
        }
        
        // عامل المنافسة
        if (market.competitorPrice) {
            const competitiveDiff = (basePrice - market.competitorPrice) / market.competitorPrice;
            if (competitiveDiff > 0.1) {
                // أسعارنا أعلى بكثير - نخفض
                adjustedPrice *= 0.95;
                factors.push('منافسة سعرية -5%');
            }
        }
        
        return {
            basePrice,
            dynamicPrice: Math.round(adjustedPrice * 100) / 100,
            adjustment: Math.round((adjustedPrice - basePrice) * 100) / 100,
            adjustmentPercent: Math.round(((adjustedPrice - basePrice) / basePrice) * 1000) / 10,
            factors,
            timestamp: new Date().toISOString()
        };
    }

    // ==================== تحسين حزم المنتجات ====================
    function optimizeProductBundle(products, targetMargin = 0.25) {
        if (!products || products.length < 2) {
            return {
                error: 'يجب اختيار منتجين على الأقل'
            };
        }
        
        // حساب التكاليف والأسعار
        const totalCost = products.reduce((sum, p) => sum + (p.cost || p.price * 0.7), 0);
        const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
        
        // سعر الحزمة مع خصم
        const bundleDiscount = 0.15; // 15% خصم على الحزمة
        const bundlePrice = totalPrice * (1 - bundleDiscount);
        
        // هامش الربح
        const bundleMargin = (bundlePrice - totalCost) / bundlePrice;
        
        // تعديل السعر لتحقيق الهامش المستهدف
        let optimizedPrice = bundlePrice;
        if (bundleMargin < targetMargin) {
            optimizedPrice = totalCost / (1 - targetMargin);
        }
        
        return {
            products: products.map(p => ({ name: p.name, price: p.price })),
            totalIndividualPrice: totalPrice,
            bundlePrice: Math.round(bundlePrice * 100) / 100,
            optimizedPrice: Math.round(optimizedPrice * 100) / 100,
            savings: Math.round((totalPrice - optimizedPrice) * 100) / 100,
            savingsPercent: Math.round(((totalPrice - optimizedPrice) / totalPrice) * 1000) / 10,
            margin: Math.round(bundleMargin * 1000) / 10,
            recommendation: `وفّر ${Math.round(((totalPrice - optimizedPrice) / totalPrice) * 100)}% بشراء الحزمة`
        };
    }

    // ==================== Public API ====================
    return {
        calculateOptimalPrice,
        suggestSmartDiscount,
        calculateBreakEven,
        analyzePriceSensitivity,
        dynamicPricing,
        optimizeProductBundle,
        calculateProfitMargin
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.AI_PRICING_OPTIMIZER = AI_PRICING_OPTIMIZER;
}
