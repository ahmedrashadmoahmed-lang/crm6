// ==================== محرك التنبؤات ====================
const APP_AI_PREDICTIONS = (function() {
    'use strict';

    // ==================== التنبؤ بالمبيعات ====================
    function predictSales(timeframe = 'monthly', periods = 3) {
        if (typeof APP_UNIFIED === 'undefined' || typeof APP_AI_ENGINE === 'undefined') {
            return null;
        }
        
        const sales = APP_UNIFIED.getAllSales();
        
        if (sales.length < 3) {
            return {
                error: 'بيانات غير كافية للتنبؤ',
                minRequired: 3,
                current: sales.length
            };
        }
        
        // تجميع المبيعات حسب الفترة الزمنية
        const aggregated = aggregateSalesByPeriod(sales, timeframe);
        
        // استخدام Linear Regression للتنبؤ
        const x = aggregated.map((_, i) => i);
        const y = aggregated.map(item => item.value);
        
        const regression = APP_AI_ENGINE.linearRegression(x, y);
        
        // توليد التنبؤات
        const predictions = [];
        for (let i = 1; i <= periods; i++) {
            const nextX = x.length + i - 1;
            const predictedValue = regression.slope * nextX + regression.intercept;
            
            predictions.push({
                period: i,
                date: getNextPeriodDate(timeframe, i),
                predicted: Math.max(0, Math.round(predictedValue)),
                confidence: Math.round(regression.r2 * 100),
                trend: regression.slope > 0 ? 'increasing' : regression.slope < 0 ? 'decreasing' : 'stable'
            });
        }
        
        return {
            timeframe,
            historical: aggregated,
            predictions,
            model: {
                slope: regression.slope,
                intercept: regression.intercept,
                r2: regression.r2,
                accuracy: Math.round(regression.r2 * 100) + '%'
            },
            summary: generateSalesPredictionSummary(predictions)
        };
    }

    // ==================== التنبؤ بالتدفق النقدي ====================
    function predictCashFlow(months = 3) {
        if (typeof APP_UNIFIED === 'undefined') return null;
        
        const sales = APP_UNIFIED.getAllSales();
        const purchases = APP_UNIFIED.getAllPurchases();
        const expenses = APP_UNIFIED.getAllExpenses();
        
        // التدفق النقدي الحالي
        const currentInflow = sales.reduce((sum, s) => sum + (s.total || 0), 0);
        const currentOutflow = purchases.reduce((sum, p) => sum + (p.total || 0), 0) +
                              expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        
        const currentCashFlow = currentInflow - currentOutflow;
        
        // التنبؤ بالتدفق النقدي
        const salesPrediction = predictSales('monthly', months);
        
        const predictions = [];
        for (let i = 1; i <= months; i++) {
            const predictedSales = salesPrediction && salesPrediction.predictions[i - 1] 
                ? salesPrediction.predictions[i - 1].predicted 
                : currentInflow / 3;
            
            // افتراض نسبة ثابتة للمصروفات
            const predictedExpenses = currentOutflow / 3;
            const predictedCashFlow = predictedSales - predictedExpenses;
            
            predictions.push({
                month: i,
                date: getNextPeriodDate('monthly', i),
                inflow: Math.round(predictedSales),
                outflow: Math.round(predictedExpenses),
                netCashFlow: Math.round(predictedCashFlow),
                cumulativeCashFlow: Math.round(currentCashFlow + predictedCashFlow * i)
            });
        }
        
        return {
            current: {
                inflow: Math.round(currentInflow),
                outflow: Math.round(currentOutflow),
                net: Math.round(currentCashFlow)
            },
            predictions,
            warnings: generateCashFlowWarnings(predictions)
        };
    }

    // ==================== التنبؤ باحتياجات المخزون ====================
    function predictInventoryNeeds(productId, months = 3) {
        if (typeof APP_UNIFIED === 'undefined') return null;
        
        const sales = APP_UNIFIED.getAllSales();
        
        // استخراج المبيعات المتعلقة بالمنتج
        const productSales = extractProductSales(sales, productId);
        
        if (productSales.length < 2) {
            return {
                error: 'بيانات غير كافية لهذا المنتج',
                productId
            };
        }
        
        // حساب متوسط الطلب الشهري
        const monthlyDemand = calculateMonthlyDemand(productSales);
        
        // التنبؤ بالاحتياجات
        const predictions = [];
        for (let i = 1; i <= months; i++) {
            predictions.push({
                month: i,
                date: getNextPeriodDate('monthly', i),
                estimatedDemand: Math.round(monthlyDemand * 1.1), // مع هامش أمان 10%
                recommendedOrder: Math.round(monthlyDemand * 1.2), // مع مخزون أمان 20%
                minStock: Math.round(monthlyDemand * 0.5) // حد أدنى للمخزون
            });
        }
        
        return {
            productId,
            currentDemand: Math.round(monthlyDemand),
            predictions,
            recommendation: `احتفظ بمخزون لا يقل عن ${Math.round(monthlyDemand * 0.5)} وحدة`
        };
    }

    // ==================== التنبؤ بمشاكل التحصيل ====================
    function predictCollectionIssues() {
        if (typeof APP_UNIFIED === 'undefined') return null;
        
        const customers = APP_UNIFIED.getAllCustomers();
        const sales = APP_UNIFIED.getAllSales();
        
        const riskyCustomers = [];
        
        customers.forEach(customer => {
            const balance = customer.balance || customer.currentBalance || 0;
            
            if (balance > 0) {
                const customerSales = sales.filter(s => 
                    s.customerId === customer.id || s.customerName === customer.name
                );
                
                const totalSales = customerSales.reduce((sum, s) => 
                    sum + (s.total || s.totalAmount || 0), 0
                );
                
                const collectionRate = totalSales > 0 
                    ? ((totalSales - balance) / totalSales) 
                    : 0;
                
                // عملاء لديهم مشاكل تحصيل
                if (collectionRate < 0.7 || balance > 10000) {
                    riskyCustomers.push({
                        customer: {
                            id: customer.id,
                            name: customer.name
                        },
                        balance,
                        collectionRate: Math.round(collectionRate * 100),
                        risk: balance > 20000 ? 'high' : balance > 10000 ? 'medium' : 'low',
                        recommendation: balance > 20000 
                            ? 'تواصل فوراً وحدد خطة دفع'
                            : 'تابع التحصيل بانتظام'
                    });
                }
            }
        });
        
        // ترتيب حسب الرصيد
        riskyCustomers.sort((a, b) => b.balance - a.balance);
        
        const totalAtRisk = riskyCustomers.reduce((sum, c) => sum + c.balance, 0);
        
        return {
            total: riskyCustomers.length,
            totalAmountAtRisk: Math.round(totalAtRisk),
            highRisk: riskyCustomers.filter(c => c.risk === 'high').length,
            mediumRisk: riskyCustomers.filter(c => c.risk === 'medium').length,
            customers: riskyCustomers,
            actions: [
                'راجع سياسة الائتمان',
                'حدث شروط الدفع',
                'تابع التحصيل بانتظام'
            ]
        };
    }

    // ==================== التنبؤ بأفضل أوقات البيع ====================
    function predictBestSellingTimes() {
        if (typeof APP_UNIFIED === 'undefined') return null;
        
        const sales = APP_UNIFIED.getAllSales();
        
        if (sales.length < 10) {
            return { error: 'بيانات غير كافية' };
        }
        
        // تحليل المبيعات حسب الشهر
        const monthlyPattern = {};
        sales.forEach(sale => {
            const date = new Date(sale.date);
            const month = date.getMonth();
            monthlyPattern[month] = (monthlyPattern[month] || 0) + 1;
        });
        
        // تحليل المبيعات حسب يوم الأسبوع
        const weekdayPattern = {};
        sales.forEach(sale => {
            const date = new Date(sale.date);
            const weekday = date.getDay();
            weekdayPattern[weekday] = (weekdayPattern[weekday] || 0) + 1;
        });
        
        // إيجاد الأفضل
        const bestMonth = Object.keys(monthlyPattern).reduce((a, b) => 
            monthlyPattern[a] > monthlyPattern[b] ? a : b
        );
        
        const bestWeekday = Object.keys(weekdayPattern).reduce((a, b) => 
            weekdayPattern[a] > weekdayPattern[b] ? a : b
        );
        
        const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                           'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const weekdayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        
        return {
            bestMonth: {
                number: parseInt(bestMonth),
                name: monthNames[bestMonth],
                sales: monthlyPattern[bestMonth]
            },
            bestWeekday: {
                number: parseInt(bestWeekday),
                name: weekdayNames[bestWeekday],
                sales: weekdayPattern[bestWeekday]
            },
            monthlyPattern,
            weekdayPattern,
            recommendation: `أفضل وقت للعروض: ${monthNames[bestMonth]} أيام ${weekdayNames[bestWeekday]}`
        };
    }

    // ==================== التنبؤ بالموسمية ====================
    function detectSeasonality() {
        if (typeof APP_UNIFIED === 'undefined') return null;
        
        const sales = APP_UNIFIED.getAllSales();
        
        if (sales.length < 12) {
            return { 
                error: 'يجب وجود بيانات لسنة كاملة على الأقل',
                hasSeasonality: false 
            };
        }
        
        // تجميع المبيعات حسب الشهر
        const monthlyTotals = {};
        sales.forEach(sale => {
            const month = new Date(sale.date).getMonth();
            monthlyTotals[month] = (monthlyTotals[month] || 0) + (sale.total || sale.totalAmount || 0);
        });
        
        // حساب التباين
        const values = Object.values(monthlyTotals);
        const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        const coefficientOfVariation = stdDev / mean;
        
        // إذا كان معامل التباين > 0.3 فهناك موسمية
        const hasSeasonality = coefficientOfVariation > 0.3;
        
        // تحديد المواسم
        const seasons = {
            high: [],
            normal: [],
            low: []
        };
        
        const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                           'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        
        for (const [month, total] of Object.entries(monthlyTotals)) {
            if (total > mean + stdDev) {
                seasons.high.push(monthNames[month]);
            } else if (total < mean - stdDev) {
                seasons.low.push(monthNames[month]);
            } else {
                seasons.normal.push(monthNames[month]);
            }
        }
        
        return {
            hasSeasonality,
            strength: hasSeasonality ? 'قوية' : 'ضعيفة',
            coefficientOfVariation: Math.round(coefficientOfVariation * 100) / 100,
            seasons,
            recommendation: hasSeasonality 
                ? `استغل المواسم العالية: ${seasons.high.join(', ')}`
                : 'المبيعات مستقرة على مدار العام'
        };
    }

    // ==================== Helper Functions ====================
    
    function aggregateSalesByPeriod(sales, timeframe) {
        const aggregated = {};
        
        sales.forEach(sale => {
            const date = new Date(sale.date);
            let key;
            
            if (timeframe === 'daily') {
                key = date.toISOString().split('T')[0];
            } else if (timeframe === 'weekly') {
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toISOString().split('T')[0];
            } else { // monthly
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }
            
            aggregated[key] = (aggregated[key] || 0) + (sale.total || sale.totalAmount || 0);
        });
        
        return Object.entries(aggregated)
            .map(([date, value]) => ({ date, value }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    function getNextPeriodDate(timeframe, periodsAhead) {
        const now = new Date();
        
        if (timeframe === 'daily') {
            now.setDate(now.getDate() + periodsAhead);
        } else if (timeframe === 'weekly') {
            now.setDate(now.getDate() + (periodsAhead * 7));
        } else { // monthly
            now.setMonth(now.getMonth() + periodsAhead);
        }
        
        return now.toISOString().split('T')[0];
    }

    function generateSalesPredictionSummary(predictions) {
        const total = predictions.reduce((sum, p) => sum + p.predicted, 0);
        const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
        
        return {
            totalPredicted: Math.round(total),
            averageConfidence: Math.round(avgConfidence),
            trend: predictions[0].trend,
            message: `متوقع ${formatCurrency(total)} بثقة ${Math.round(avgConfidence)}%`
        };
    }

    function generateCashFlowWarnings(predictions) {
        const warnings = [];
        
        predictions.forEach(pred => {
            if (pred.netCashFlow < 0) {
                warnings.push({
                    month: pred.month,
                    date: pred.date,
                    severity: 'high',
                    message: `تدفق نقدي سلبي متوقع: ${formatCurrency(pred.netCashFlow)}`
                });
            } else if (pred.cumulativeCashFlow < 0) {
                warnings.push({
                    month: pred.month,
                    date: pred.date,
                    severity: 'medium',
                    message: 'التدفق النقدي التراكمي سلبي'
                });
            }
        });
        
        return warnings;
    }

    function extractProductSales(sales, productId) {
        const productSales = [];
        
        sales.forEach(sale => {
            if (sale.items && Array.isArray(sale.items)) {
                sale.items.forEach(item => {
                    if (item.id === productId || item.productId === productId) {
                        productSales.push({
                            date: sale.date,
                            quantity: item.quantity || 1
                        });
                    }
                });
            }
        });
        
        return productSales;
    }

    function calculateMonthlyDemand(productSales) {
        if (productSales.length === 0) return 0;
        
        const totalQuantity = productSales.reduce((sum, s) => sum + s.quantity, 0);
        
        // حساب عدد الأشهر
        const dates = productSales.map(s => new Date(s.date));
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        const months = (maxDate - minDate) / (1000 * 60 * 60 * 24 * 30);
        
        return months > 0 ? totalQuantity / Math.max(1, months) : totalQuantity;
    }

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
        predictSales,
        predictCashFlow,
        predictInventoryNeeds,
        predictCollectionIssues,
        predictBestSellingTimes,
        detectSeasonality
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.APP_AI_PREDICTIONS = APP_AI_PREDICTIONS;
}
