// ==================== محرك التوصيات الذكية ====================
const APP_AI_RECOMMENDATIONS = (function() {
    'use strict';

    // ==================== توليد جميع التوصيات ====================
    function generateAllRecommendations() {
        const recommendations = {
            daily: generateDailyRecommendations(),
            customers: generateCustomerRecommendations(),
            suppliers: generateSupplierRecommendations(),
            pricing: generatePricingRecommendations(),
            opportunities: generateOpportunityRecommendations(),
            operations: generateOperationalRecommendations()
        };
        
        // دمج جميع التوصيات وترتيبها
        const allRecommendations = [
            ...recommendations.daily,
            ...recommendations.customers,
            ...recommendations.suppliers,
            ...recommendations.pricing,
            ...recommendations.opportunities,
            ...recommendations.operations
        ].sort((a, b) => {
            const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        return {
            total: allRecommendations.length,
            byPriority: {
                urgent: allRecommendations.filter(r => r.priority === 'urgent').length,
                high: allRecommendations.filter(r => r.priority === 'high').length,
                medium: allRecommendations.filter(r => r.priority === 'medium').length,
                low: allRecommendations.filter(r => r.priority === 'low').length
            },
            byCategory: {
                daily: recommendations.daily.length,
                customers: recommendations.customers.length,
                suppliers: recommendations.suppliers.length,
                pricing: recommendations.pricing.length,
                opportunities: recommendations.opportunities.length,
                operations: recommendations.operations.length
            },
            top10: allRecommendations.slice(0, 10),
            all: allRecommendations
        };
    }

    // ==================== التوصيات اليومية ====================
    function generateDailyRecommendations() {
        const recommendations = [];
        const today = new Date();
        const dayName = today.toLocaleDateString('ar-EG', { weekday: 'long' });
        
        recommendations.push({
            category: 'daily',
            categoryAr: 'يومية',
            icon: '📅',
            title: `مهام ${dayName}`,
            description: 'راجع الفرص الساخنة والعملاء المحتملين',
            priority: 'high',
            actions: [
                'راجع العملاء الخاملين',
                'تابع الفرص العالية القيمة',
                'راجع المستحقات المتأخرة'
            ]
        });
        
        // إضافة توصيات بناءً على اليوم
        if (today.getDay() === 1) { // الاثنين
            recommendations.push({
                category: 'daily',
                categoryAr: 'أسبوعية',
                icon: '📊',
                title: 'مراجعة أسبوعية',
                description: 'راجع أداء الأسبوع الماضي وخطط للأسبوع الجديد',
                priority: 'medium',
                actions: [
                    'قارن المبيعات بالهدف',
                    'حدد أهداف الأسبوع',
                    'راجع أداء الفريق'
                ]
            });
        }
        
        return recommendations;
    }

    // ==================== توصيات العملاء ====================
    function generateCustomerRecommendations() {
        if (typeof APP_UNIFIED === 'undefined') return [];
        
        const recommendations = [];
        const customers = APP_UNIFIED.getAllCustomers();
        const sales = APP_UNIFIED.getAllSales();
        
        // تحليل العملاء
        let riskyCustomers = 0;
        let sleepingCustomers = 0;
        let vipCustomers = 0;
        
        customers.forEach(customer => {
            const customerSales = sales.filter(s => 
                s.customerId === customer.id || s.customerName === customer.name
            );
            
            if (typeof AI_CUSTOMER_SCORING !== 'undefined') {
                const scoring = AI_CUSTOMER_SCORING.scoreCustomer(customer, sales);
                
                if (scoring.category.name === 'RISKY') {
                    riskyCustomers++;
                } else if (scoring.category.name === 'SLEEPING') {
                    sleepingCustomers++;
                } else if (scoring.category.name === 'VIP') {
                    vipCustomers++;
                }
            }
        });
        
        // توصيات بناءً على التحليل
        if (riskyCustomers > 0) {
            recommendations.push({
                category: 'customers',
                categoryAr: 'عملاء',
                icon: '⚠️',
                title: 'عملاء محفوفون بالمخاطر',
                description: `${riskyCustomers} عميل يحتاج مراجعة فورية`,
                priority: 'urgent',
                actions: [
                    'راجع حسابات العملاء المحفوفة بالمخاطر',
                    'حدد شروط دفع جديدة',
                    'اطلب ضمانات إضافية'
                ],
                count: riskyCustomers
            });
        }
        
        if (sleepingCustomers > 5) {
            recommendations.push({
                category: 'customers',
                categoryAr: 'عملاء',
                icon: '😴',
                title: 'عملاء خاملين',
                description: `${sleepingCustomers} عميل لم يطلب منذ فترة`,
                priority: 'high',
                actions: [
                    'أطلق حملة إعادة تنشيط',
                    'قدم عروض خاصة',
                    'تواصل مباشرة'
                ],
                count: sleepingCustomers
            });
        }
        
        if (vipCustomers > 0) {
            recommendations.push({
                category: 'customers',
                categoryAr: 'عملاء',
                icon: '👑',
                title: 'عملاء VIP',
                description: `${vipCustomers} عميل VIP يحتاج اهتمام خاص`,
                priority: 'high',
                actions: [
                    'قدم خدمة مميزة',
                    'اقترح عروض حصرية',
                    'تابع بشكل شخصي'
                ],
                count: vipCustomers
            });
        }
        
        return recommendations;
    }

    // ==================== توصيات الموردين ====================
    function generateSupplierRecommendations() {
        if (typeof APP_UNIFIED === 'undefined') return [];
        
        const recommendations = [];
        const suppliers = APP_UNIFIED.getAllSuppliers();
        const purchases = APP_UNIFIED.getAllPurchases();
        
        let poorSuppliers = 0;
        let excellentSuppliers = 0;
        
        suppliers.forEach(supplier => {
            if (typeof AI_SUPPLIER_SCORING !== 'undefined') {
                const scoring = AI_SUPPLIER_SCORING.scoreSupplier(supplier, purchases);
                
                if (scoring.category.name === 'POOR') {
                    poorSuppliers++;
                } else if (scoring.category.name === 'EXCELLENT') {
                    excellentSuppliers++;
                }
            }
        });
        
        if (poorSuppliers > 0) {
            recommendations.push({
                category: 'suppliers',
                categoryAr: 'موردين',
                icon: '⚠️',
                title: 'موردين ضعيفي الأداء',
                description: `${poorSuppliers} مورد يحتاج مراجعة أو استبدال`,
                priority: 'high',
                actions: [
                    'ابحث عن موردين بديلين',
                    'راجع الأسعار والجودة',
                    'أعد التفاوض'
                ],
                count: poorSuppliers
            });
        }
        
        if (excellentSuppliers > 0) {
            recommendations.push({
                category: 'suppliers',
                categoryAr: 'موردين',
                icon: '⭐',
                title: 'موردين ممتازين',
                description: `${excellentSuppliers} مورد ممتاز - حافظ عليهم`,
                priority: 'medium',
                actions: [
                    'عزز العلاقة',
                    'فاوض على شروط أفضل',
                    'زد حجم الطلبات'
                ],
                count: excellentSuppliers
            });
        }
        
        return recommendations;
    }

    // ==================== توصيات التسعير ====================
    function generatePricingRecommendations() {
        const recommendations = [];
        
        // توصيات عامة للتسعير
        recommendations.push({
            category: 'pricing',
            categoryAr: 'تسعير',
            icon: '💰',
            title: 'راجع استراتيجية التسعير',
            description: 'حسّن الأسعار لزيادة الربحية',
            priority: 'medium',
            actions: [
                'استخدم التسعير الديناميكي',
                'قدم خصومات ذكية للعملاء المخلصين',
                'راجع هوامش الربح'
            ]
        });
        
        return recommendations;
    }

    // ==================== توصيات الفرص ====================
    function generateOpportunityRecommendations() {
        if (typeof AI_OPPORTUNITY_FINDER === 'undefined') return [];
        
        const recommendations = [];
        const opportunities = AI_OPPORTUNITY_FINDER.findAllOpportunities();
        
        if (opportunities.total > 0) {
            recommendations.push({
                category: 'opportunities',
                categoryAr: 'فرص',
                icon: '🎯',
                title: 'فرص تجارية متاحة',
                description: `${opportunities.total} فرصة بقيمة متوقعة عالية`,
                priority: 'high',
                actions: [
                    'راجع الفرص العالية القيمة',
                    'خطط لحملات مستهدفة',
                    'تابع مع العملاء المحتملين'
                ],
                count: opportunities.total,
                details: {
                    crossSell: opportunities.byType.crossSell,
                    upsell: opportunities.byType.upsell,
                    reactivation: opportunities.byType.reactivation
                }
            });
        }
        
        return recommendations;
    }

    // ==================== توصيات تشغيلية ====================
    function generateOperationalRecommendations() {
        const recommendations = [];
        
        // توصيات عامة
        recommendations.push({
            category: 'operations',
            categoryAr: 'تشغيلية',
            icon: '⚙️',
            title: 'حسّن العمليات',
            description: 'راجع وحسّن كفاءة العمليات',
            priority: 'low',
            actions: [
                'أتمت المهام المتكررة',
                'راجع سير العمل',
                'درّب الفريق على النظام'
            ]
        });
        
        return recommendations;
    }

    // ==================== توصيات مخصصة حسب الدور ====================
    function getRecommendationsForRole(role) {
        const allRecommendations = generateAllRecommendations();
        
        // فلترة حسب الدور
        switch (role) {
            case 'sales_manager':
                return {
                    ...allRecommendations,
                    all: allRecommendations.all.filter(r => 
                        ['customers', 'opportunities', 'pricing'].includes(r.category)
                    )
                };
            
            case 'accountant':
                return {
                    ...allRecommendations,
                    all: allRecommendations.all.filter(r => 
                        ['suppliers', 'pricing', 'operations'].includes(r.category)
                    )
                };
            
            default:
                return allRecommendations;
        }
    }

    // ==================== تنفيذ توصية ====================
    function executeRecommendation(recommendationId, action) {
        // يمكن إضافة منطق لتتبع التوصيات المنفذة
        console.log(`تنفيذ التوصية ${recommendationId}: ${action}`);
        
        return {
            success: true,
            message: 'تم تسجيل الإجراء',
            timestamp: new Date().toISOString()
        };
    }

    // ==================== Public API ====================
    return {
        generateAllRecommendations,
        generateDailyRecommendations,
        generateCustomerRecommendations,
        generateSupplierRecommendations,
        generatePricingRecommendations,
        generateOpportunityRecommendations,
        generateOperationalRecommendations,
        getRecommendationsForRole,
        executeRecommendation
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.APP_AI_RECOMMENDATIONS = APP_AI_RECOMMENDATIONS;
}
