// ==================== اكتشاف الفرص التجارية ====================
const AI_OPPORTUNITY_FINDER = (function() {
    'use strict';

    // ==================== اكتشاف جميع الفرص ====================
    function findAllOpportunities() {
        const opportunities = {
            crossSell: findCrossSellOpportunities(),
            upsell: findUpsellOpportunities(),
            reactivation: findReactivationOpportunities(),
            expansion: findExpansionOpportunities(),
            promotional: findPromotionalOpportunities()
        };
        
        // دمج جميع الفرص وترتيبها حسب القيمة المتوقعة
        const allOpportunities = [
            ...opportunities.crossSell,
            ...opportunities.upsell,
            ...opportunities.reactivation,
            ...opportunities.expansion,
            ...opportunities.promotional
        ].sort((a, b) => b.expectedValue - a.expectedValue);
        
        return {
            total: allOpportunities.length,
            byType: {
                crossSell: opportunities.crossSell.length,
                upsell: opportunities.upsell.length,
                reactivation: opportunities.reactivation.length,
                expansion: opportunities.expansion.length,
                promotional: opportunities.promotional.length
            },
            top10: allOpportunities.slice(0, 10),
            all: allOpportunities
        };
    }

    // ==================== البيع المتقاطع (Cross-Sell) ====================
    function findCrossSellOpportunities() {
        if (typeof APP_UNIFIED === 'undefined') return [];
        
        const customers = APP_UNIFIED.getAllCustomers();
        const sales = APP_UNIFIED.getAllSales();
        const opportunities = [];
        
        customers.forEach(customer => {
            const customerSales = sales.filter(s => 
                s.customerId === customer.id || s.customerName === customer.name
            );
            
            if (customerSales.length === 0) return;
            
            // تحليل المنتجات المشتراة
            const purchasedProducts = extractPurchasedProducts(customerSales);
            
            // اقتراح منتجات متكاملة
            const suggestedProducts = suggestComplementaryProducts(purchasedProducts);
            
            if (suggestedProducts.length > 0) {
                opportunities.push({
                    type: 'crossSell',
                    typeAr: 'بيع متقاطع',
                    customer: {
                        id: customer.id,
                        name: customer.name
                    },
                    suggestions: suggestedProducts,
                    expectedValue: calculateExpectedValue(customer, suggestedProducts),
                    probability: calculateProbability(customer, 'crossSell'),
                    action: 'اقترح منتجات متكاملة',
                    priority: customer.classification === 'vip' ? 'high' : 'medium',
                    reason: `العميل اشترى ${purchasedProducts.length} منتجات ويمكن إضافة منتجات متكاملة`
                });
            }
        });
        
        return opportunities;
    }

    // ==================== البيع الإضافي (Upsell) ====================
    function findUpsellOpportunities() {
        if (typeof APP_UNIFIED === 'undefined') return [];
        
        const customers = APP_UNIFIED.getAllCustomers();
        const sales = APP_UNIFIED.getAllSales();
        const opportunities = [];
        
        customers.forEach(customer => {
            const customerSales = sales.filter(s => 
                s.customerId === customer.id || s.customerName === customer.name
            );
            
            if (customerSales.length === 0) return;
            
            // تحليل آخر الطلبات
            const recentSales = customerSales
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3);
            
            // متوسط قيمة الطلب
            const avgOrderValue = customerSales.reduce((sum, s) => 
                sum + (s.total || s.totalAmount || 0), 0
            ) / customerSales.length;
            
            // إذا كان العميل يشتري بانتظام، اقترح منتجات أعلى جودة/سعر
            if (customerSales.length >= 3 && avgOrderValue > 5000) {
                opportunities.push({
                    type: 'upsell',
                    typeAr: 'بيع إضافي',
                    customer: {
                        id: customer.id,
                        name: customer.name
                    },
                    currentAvgValue: Math.round(avgOrderValue),
                    targetValue: Math.round(avgOrderValue * 1.3),
                    expectedValue: Math.round(avgOrderValue * 0.3),
                    probability: calculateProbability(customer, 'upsell'),
                    action: 'اقترح منتجات أعلى جودة/قيمة',
                    priority: customer.classification === 'vip' ? 'high' : 'medium',
                    reason: `متوسط الطلب ${formatCurrency(avgOrderValue)} - يمكن زيادته`
                });
            }
        });
        
        return opportunities;
    }

    // ==================== إعادة التنشيط ====================
    function findReactivationOpportunities() {
        if (typeof APP_UNIFIED === 'undefined') return [];
        
        const customers = APP_UNIFIED.getAllCustomers();
        const sales = APP_UNIFIED.getAllSales();
        const opportunities = [];
        
        const now = new Date();
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        
        customers.forEach(customer => {
            const customerSales = sales.filter(s => 
                s.customerId === customer.id || s.customerName === customer.name
            );
            
            if (customerSales.length === 0) return;
            
            // آخر طلب
            const lastSale = customerSales.reduce((latest, s) => 
                new Date(s.date) > new Date(latest.date) ? s : latest
            );
            
            const lastSaleDate = new Date(lastSale.date);
            const daysSinceLastOrder = Math.floor((now - lastSaleDate) / (1000 * 60 * 60 * 24));
            
            // عملاء لم يطلبوا منذ 3 أشهر
            if (lastSaleDate < threeMonthsAgo) {
                const totalValue = customerSales.reduce((sum, s) => 
                    sum + (s.total || s.totalAmount || 0), 0
                );
                
                opportunities.push({
                    type: 'reactivation',
                    typeAr: 'إعادة تنشيط',
                    customer: {
                        id: customer.id,
                        name: customer.name
                    },
                    daysSinceLastOrder,
                    historicalValue: Math.round(totalValue),
                    expectedValue: Math.round(totalValue * 0.2), // نتوقع 20% من القيمة التاريخية
                    probability: calculateReactivationProbability(daysSinceLastOrder, totalValue),
                    action: 'تواصل وقدم عرض خاص',
                    priority: totalValue > 50000 ? 'high' : daysSinceLastOrder > 180 ? 'urgent' : 'medium',
                    reason: `لم يطلب منذ ${daysSinceLastOrder} يوم - قيمة تاريخية ${formatCurrency(totalValue)}`
                });
            }
        });
        
        return opportunities.sort((a, b) => b.historicalValue - a.historicalValue);
    }

    // ==================== فرص التوسع ====================
    function findExpansionOpportunities() {
        if (typeof APP_UNIFIED === 'undefined') return [];
        
        const customers = APP_UNIFIED.getAllCustomers();
        const sales = APP_UNIFIED.getAllSales();
        const opportunities = [];
        
        customers.forEach(customer => {
            const customerSales = sales.filter(s => 
                s.customerId === customer.id || s.customerName === customer.name
            );
            
            if (customerSales.length < 3) return;
            
            // تحليل الاتجاه
            const sortedSales = customerSales.sort((a, b) => 
                new Date(a.date) - new Date(b.date)
            );
            
            const midPoint = Math.floor(sortedSales.length / 2);
            const firstHalf = sortedSales.slice(0, midPoint);
            const secondHalf = sortedSales.slice(midPoint);
            
            const firstHalfTotal = firstHalf.reduce((sum, s) => 
                sum + (s.total || s.totalAmount || 0), 0
            );
            const secondHalfTotal = secondHalf.reduce((sum, s) => 
                sum + (s.total || s.totalAmount || 0), 0
            );
            
            const growth = (secondHalfTotal - firstHalfTotal) / firstHalfTotal;
            
            // عملاء في نمو
            if (growth > 0.2) {
                opportunities.push({
                    type: 'expansion',
                    typeAr: 'فرصة توسع',
                    customer: {
                        id: customer.id,
                        name: customer.name
                    },
                    growth: Math.round(growth * 100),
                    currentValue: Math.round(secondHalfTotal),
                    expectedValue: Math.round(secondHalfTotal * 1.5),
                    probability: 0.7,
                    action: 'قدم عقد شراكة أو عرض موسّع',
                    priority: 'high',
                    reason: `نمو ${Math.round(growth * 100)}% - فرصة للتوسع`
                });
            }
        });
        
        return opportunities;
    }

    // ==================== فرص ترويجية ====================
    function findPromotionalOpportunities() {
        if (typeof APP_UNIFIED === 'undefined') return [];
        
        const opportunities = [];
        const now = new Date();
        
        // فرص موسمية
        const month = now.getMonth();
        if (month === 11 || month === 0) {
            opportunities.push({
                type: 'promotional',
                typeAr: 'فرصة ترويجية',
                campaign: 'عروض نهاية العام',
                targetCustomers: 'جميع العملاء',
                expectedValue: 50000,
                probability: 0.6,
                action: 'أطلق حملة عروض نهاية العام',
                priority: 'high',
                reason: 'موسم المبيعات - فرصة ترويجية'
            });
        }
        
        // فرص الأعياد
        // يمكن إضافة المزيد من الفرص الترويجية هنا
        
        return opportunities;
    }

    // ==================== Helper Functions ====================
    
    function extractPurchasedProducts(sales) {
        const products = new Set();
        sales.forEach(sale => {
            if (sale.items && Array.isArray(sale.items)) {
                sale.items.forEach(item => products.add(item.name || item.product));
            }
        });
        return Array.from(products);
    }

    function suggestComplementaryProducts(purchasedProducts) {
        // قاعدة بيانات بسيطة للمنتجات المتكاملة
        // يمكن تحسينها باستخدام Collaborative Filtering
        const complementaryProducts = [
            { bought: 'طابعة', suggest: ['حبر طابعة', 'ورق A4'] },
            { bought: 'كمبيوتر', suggest: ['فأرة', 'لوحة مفاتيح', 'شاشة'] },
            { bought: 'منتجات طبية', suggest: ['مستلزمات طبية', 'معدات وقاية'] }
        ];
        
        const suggestions = [];
        purchasedProducts.forEach(product => {
            complementaryProducts.forEach(rule => {
                if (product.includes(rule.bought)) {
                    suggestions.push(...rule.suggest);
                }
            });
        });
        
        return [...new Set(suggestions)]; // إزالة التكرارات
    }

    function calculateExpectedValue(customer, products) {
        // قيمة متوقعة بسيطة
        const baseValue = 5000; // قيمة افتراضية
        const customerFactor = customer.classification === 'vip' ? 2 : 
                              customer.classification === 'active' ? 1.5 : 1;
        return Math.round(baseValue * customerFactor * products.length);
    }

    function calculateProbability(customer, opportunityType) {
        let probability = 0.5; // baseline
        
        // زيادة حسب تصنيف العميل
        if (customer.classification === 'vip') {
            probability += 0.3;
        } else if (customer.classification === 'active') {
            probability += 0.2;
        }
        
        // زيادة حسب نوع الفرصة
        if (opportunityType === 'crossSell' && customer.metrics && customer.metrics.orderCount > 5) {
            probability += 0.1;
        }
        
        return Math.min(0.95, probability);
    }

    function calculateReactivationProbability(daysSince, historicalValue) {
        let probability = 0.5;
        
        // تقليل مع الوقت
        if (daysSince > 180) {
            probability -= 0.2;
        } else if (daysSince > 365) {
            probability -= 0.3;
        }
        
        // زيادة مع القيمة التاريخية
        if (historicalValue > 100000) {
            probability += 0.2;
        } else if (historicalValue > 50000) {
            probability += 0.1;
        }
        
        return Math.max(0.1, Math.min(0.9, probability));
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // ==================== تقرير الفرص ====================
    function generateOpportunitiesReport() {
        const opportunities = findAllOpportunities();
        
        const totalValue = opportunities.all.reduce((sum, opp) => 
            sum + (opp.expectedValue || 0), 0
        );
        
        const averageProbability = opportunities.all.reduce((sum, opp) => 
            sum + (opp.probability || 0), 0
        ) / Math.max(1, opportunities.all.length);
        
        const expectedRevenue = opportunities.all.reduce((sum, opp) => 
            sum + ((opp.expectedValue || 0) * (opp.probability || 0)), 0
        );
        
        return {
            summary: {
                totalOpportunities: opportunities.total,
                totalPotentialValue: Math.round(totalValue),
                expectedRevenue: Math.round(expectedRevenue),
                averageProbability: Math.round(averageProbability * 100),
                byType: opportunities.byType
            },
            highPriority: opportunities.all.filter(o => o.priority === 'high' || o.priority === 'urgent'),
            topOpportunities: opportunities.top10,
            recommendations: generateActionPlan(opportunities.all)
        };
    }

    function generateActionPlan(opportunities) {
        const actions = [];
        
        // أولوية عاجلة
        const urgent = opportunities.filter(o => o.priority === 'urgent');
        if (urgent.length > 0) {
            actions.push({
                priority: 'urgent',
                action: 'تواصل فوراً',
                count: urgent.length,
                targets: urgent.map(o => o.customer.name).slice(0, 5)
            });
        }
        
        // أولوية عالية
        const high = opportunities.filter(o => o.priority === 'high');
        if (high.length > 0) {
            actions.push({
                priority: 'high',
                action: 'خطط لحملة مستهدفة',
                count: high.length,
                expectedValue: high.reduce((sum, o) => sum + o.expectedValue, 0)
            });
        }
        
        // إعادة التنشيط
        const reactivation = opportunities.filter(o => o.type === 'reactivation');
        if (reactivation.length > 5) {
            actions.push({
                priority: 'medium',
                action: 'حملة إعادة تنشيط',
                count: reactivation.length,
                message: `${reactivation.length} عميل يحتاج إعادة تنشيط`
            });
        }
        
        return actions;
    }

    // ==================== Public API ====================
    return {
        findAllOpportunities,
        findCrossSellOpportunities,
        findUpsellOpportunities,
        findReactivationOpportunities,
        findExpansionOpportunities,
        findPromotionalOpportunities,
        generateOpportunitiesReport
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.AI_OPPORTUNITY_FINDER = AI_OPPORTUNITY_FINDER;
}
