// ==================== محرك الذكاء الاصطناعي الأساسي ====================
const APP_AI_ENGINE = (function() {
    'use strict';

    // ==================== Constants ====================
    const AI_VERSION = '1.0.0';
    const AI_NAME = 'محرك الذكاء الاصطناعي - CRM6';
    
    const STORAGE_KEYS = {
        models: 'crm6_ai_models',
        history: 'crm6_ai_history',
        settings: 'crm6_ai_settings'
    };

    // ==================== State ====================
    let aiState = {
        initialized: false,
        modelsLoaded: false,
        lastUpdate: null,
        enabled: true
    };

    // ==================== Models Storage ====================
    let aiModels = {
        customerScoring: {
            weights: {
                totalSales: 0.30,
                orderFrequency: 0.25,
                paymentSpeed: 0.20,
                profitMargin: 0.15,
                collectionRate: 0.10
            },
            trained: false,
            lastTrain: null
        },
        supplierScoring: {
            weights: {
                price: 0.25,
                quality: 0.25,
                deliverySpeed: 0.20,
                reliability: 0.20,
                paymentTerms: 0.10
            },
            trained: false,
            lastTrain: null
        },
        salesPrediction: {
            coefficients: [],
            intercept: 0,
            trained: false,
            lastTrain: null,
            accuracy: 0
        }
    };

    // ==================== Initialize ====================
    function initialize() {
        console.log('%c🤖 تهيئة محرك الذكاء الاصطناعي...', 'color: #8b5cf6; font-size: 14px; font-weight: bold;');
        
        // تحميل النماذج المحفوظة
        loadModels();
        
        // التحقق من توفر البيانات
        checkDataAvailability();
        
        aiState.initialized = true;
        aiState.lastUpdate = new Date().toISOString();
        
        console.log('✅ محرك AI جاهز');
        
        return {
            version: AI_VERSION,
            name: AI_NAME,
            initialized: true,
            enabled: aiState.enabled
        };
    }

    // ==================== Load Models ====================
    function loadModels() {
        try {
            const savedModels = localStorage.getItem(STORAGE_KEYS.models);
            if (savedModels) {
                const models = JSON.parse(savedModels);
                aiModels = { ...aiModels, ...models };
                aiState.modelsLoaded = true;
                console.log('📦 تم تحميل النماذج المحفوظة');
            }
        } catch (e) {
            console.warn('⚠️ لا يمكن تحميل النماذج:', e);
        }
    }

    // ==================== Save Models ====================
    function saveModels() {
        try {
            localStorage.setItem(STORAGE_KEYS.models, JSON.stringify(aiModels));
            console.log('💾 تم حفظ النماذج');
            return true;
        } catch (e) {
            console.error('❌ خطأ في حفظ النماذج:', e);
            return false;
        }
    }

    // ==================== Check Data Availability ====================
    function checkDataAvailability() {
        const dataStatus = {
            hasCustomers: false,
            hasSales: false,
            hasSuppliers: false,
            hasPurchases: false,
            readyForAI: false
        };
        
        if (typeof APP_UNIFIED !== 'undefined') {
            const customers = APP_UNIFIED.getAllCustomers();
            const sales = APP_UNIFIED.getAllSales();
            const suppliers = APP_UNIFIED.getAllSuppliers();
            const purchases = APP_UNIFIED.getAllPurchases();
            
            dataStatus.hasCustomers = customers.length > 0;
            dataStatus.hasSales = sales.length > 0;
            dataStatus.hasSuppliers = suppliers.length > 0;
            dataStatus.hasPurchases = purchases.length > 0;
            
            // نحتاج على الأقل عملاء ومبيعات للتحليل الأساسي
            dataStatus.readyForAI = dataStatus.hasCustomers && dataStatus.hasSales;
        }
        
        return dataStatus;
    }

    // ==================== Statistical Functions ====================
    
    // حساب المتوسط
    function calculateMean(values) {
        if (!values || values.length === 0) return 0;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    }

    // حساب الانحراف المعياري
    function calculateStdDev(values) {
        if (!values || values.length === 0) return 0;
        const mean = calculateMean(values);
        const squareDiffs = values.map(value => Math.pow(value - mean, 2));
        const avgSquareDiff = calculateMean(squareDiffs);
        return Math.sqrt(avgSquareDiff);
    }

    // تطبيع القيم (Normalization)
    function normalize(value, min, max) {
        if (max === min) return 0;
        return (value - min) / (max - min);
    }

    // حساب معامل الارتباط (Correlation)
    function calculateCorrelation(x, y) {
        if (!x || !y || x.length !== y.length || x.length === 0) return 0;
        
        const n = x.length;
        const meanX = calculateMean(x);
        const meanY = calculateMean(y);
        
        let numerator = 0;
        let denomX = 0;
        let denomY = 0;
        
        for (let i = 0; i < n; i++) {
            const diffX = x[i] - meanX;
            const diffY = y[i] - meanY;
            numerator += diffX * diffY;
            denomX += diffX * diffX;
            denomY += diffY * diffY;
        }
        
        if (denomX === 0 || denomY === 0) return 0;
        return numerator / Math.sqrt(denomX * denomY);
    }

    // ==================== Linear Regression ====================
    function linearRegression(x, y) {
        if (!x || !y || x.length !== y.length || x.length < 2) {
            return { slope: 0, intercept: 0, r2: 0 };
        }
        
        const n = x.length;
        const meanX = calculateMean(x);
        const meanY = calculateMean(y);
        
        let numerator = 0;
        let denominator = 0;
        
        for (let i = 0; i < n; i++) {
            numerator += (x[i] - meanX) * (y[i] - meanY);
            denominator += Math.pow(x[i] - meanX, 2);
        }
        
        const slope = denominator !== 0 ? numerator / denominator : 0;
        const intercept = meanY - slope * meanX;
        
        // حساب R² (معامل التحديد)
        let ssRes = 0;
        let ssTot = 0;
        for (let i = 0; i < n; i++) {
            const predicted = slope * x[i] + intercept;
            ssRes += Math.pow(y[i] - predicted, 2);
            ssTot += Math.pow(y[i] - meanY, 2);
        }
        
        const r2 = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;
        
        return { slope, intercept, r2 };
    }

    // ==================== K-Means Clustering ====================
    function kMeansClustering(data, k = 3, maxIterations = 100) {
        if (!data || data.length === 0 || k <= 0) return [];
        
        // تهيئة المراكز عشوائياً
        const centroids = [];
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(k, data.length); i++) {
            centroids.push({ ...shuffled[i] });
        }
        
        let assignments = new Array(data.length).fill(0);
        let iterations = 0;
        let changed = true;
        
        while (changed && iterations < maxIterations) {
            changed = false;
            iterations++;
            
            // تعيين كل نقطة لأقرب مركز
            for (let i = 0; i < data.length; i++) {
                let minDist = Infinity;
                let cluster = 0;
                
                for (let j = 0; j < centroids.length; j++) {
                    const dist = euclideanDistance(data[i], centroids[j]);
                    if (dist < minDist) {
                        minDist = dist;
                        cluster = j;
                    }
                }
                
                if (assignments[i] !== cluster) {
                    assignments[i] = cluster;
                    changed = true;
                }
            }
            
            // تحديث المراكز
            for (let j = 0; j < centroids.length; j++) {
                const clusterPoints = data.filter((_, i) => assignments[i] === j);
                if (clusterPoints.length > 0) {
                    centroids[j] = calculateCentroid(clusterPoints);
                }
            }
        }
        
        return assignments;
    }

    // حساب المسافة الإقليدية
    function euclideanDistance(point1, point2) {
        let sum = 0;
        for (const key in point1) {
            if (typeof point1[key] === 'number' && typeof point2[key] === 'number') {
                sum += Math.pow(point1[key] - point2[key], 2);
            }
        }
        return Math.sqrt(sum);
    }

    // حساب مركز المجموعة
    function calculateCentroid(points) {
        if (points.length === 0) return {};
        
        const centroid = {};
        const firstPoint = points[0];
        
        for (const key in firstPoint) {
            if (typeof firstPoint[key] === 'number') {
                const values = points.map(p => p[key]).filter(v => typeof v === 'number');
                centroid[key] = calculateMean(values);
            }
        }
        
        return centroid;
    }

    // ==================== Time Series Analysis ====================
    function analyzeTimeSeries(data, dateKey, valueKey) {
        if (!data || data.length < 2) {
            return {
                trend: 'stable',
                seasonality: false,
                growth: 0
            };
        }
        
        // ترتيب البيانات حسب التاريخ
        const sorted = [...data].sort((a, b) => 
            new Date(a[dateKey]) - new Date(b[dateKey])
        );
        
        // استخراج القيم
        const values = sorted.map(item => item[valueKey] || 0);
        const timePoints = sorted.map((_, i) => i);
        
        // حساب الاتجاه
        const regression = linearRegression(timePoints, values);
        const growthRate = regression.slope / calculateMean(values);
        
        let trend = 'stable';
        if (regression.slope > 0.05 * calculateMean(values)) {
            trend = 'increasing';
        } else if (regression.slope < -0.05 * calculateMean(values)) {
            trend = 'decreasing';
        }
        
        return {
            trend,
            seasonality: false, // يمكن تحسينها لاحقاً
            growth: growthRate,
            slope: regression.slope,
            r2: regression.r2
        };
    }

    // ==================== Scoring Function ====================
    function calculateScore(metrics, weights) {
        let score = 0;
        let totalWeight = 0;
        
        for (const metric in weights) {
            if (metrics[metric] !== undefined && metrics[metric] !== null) {
                const normalizedValue = Math.max(0, Math.min(1, metrics[metric]));
                score += normalizedValue * weights[metric];
                totalWeight += weights[metric];
            }
        }
        
        return totalWeight > 0 ? (score / totalWeight) * 100 : 0;
    }

    // ==================== Prediction Functions ====================
    function predictNextValue(historicalData, dateKey, valueKey, daysAhead = 30) {
        if (!historicalData || historicalData.length < 2) {
            return {
                predicted: 0,
                confidence: 0
            };
        }
        
        const sorted = [...historicalData].sort((a, b) => 
            new Date(a[dateKey]) - new Date(b[dateKey])
        );
        
        const values = sorted.map(item => item[valueKey] || 0);
        const timePoints = sorted.map((_, i) => i);
        
        const regression = linearRegression(timePoints, values);
        const nextTimePoint = timePoints.length + (daysAhead / 30);
        const predicted = regression.slope * nextTimePoint + regression.intercept;
        
        return {
            predicted: Math.max(0, predicted),
            confidence: regression.r2,
            trend: regression.slope > 0 ? 'up' : regression.slope < 0 ? 'down' : 'stable'
        };
    }

    // ==================== Enable/Disable AI ====================
    function setEnabled(enabled) {
        aiState.enabled = enabled;
        console.log(`🤖 AI ${enabled ? 'مفعّل' : 'معطّل'}`);
    }

    // ==================== Export/Import Models ====================
    function exportModels() {
        return {
            models: aiModels,
            state: aiState,
            exportDate: new Date().toISOString()
        };
    }

    function importModels(exportedData) {
        try {
            if (exportedData.models) {
                aiModels = { ...aiModels, ...exportedData.models };
                saveModels();
                console.log('✅ تم استيراد النماذج');
                return true;
            }
            return false;
        } catch (e) {
            console.error('❌ خطأ في استيراد النماذج:', e);
            return false;
        }
    }

    // ==================== Public API ====================
    return {
        // Initialization
        initialize,
        checkDataAvailability,
        
        // State Management
        getState: () => ({ ...aiState }),
        setEnabled,
        
        // Statistical Functions
        calculateMean,
        calculateStdDev,
        normalize,
        calculateCorrelation,
        
        // Machine Learning
        linearRegression,
        kMeansClustering,
        analyzeTimeSeries,
        calculateScore,
        predictNextValue,
        
        // Models Management
        getModels: () => ({ ...aiModels }),
        saveModels,
        exportModels,
        importModels,
        
        // Version
        version: AI_VERSION,
        name: AI_NAME
    };
})();

// تهيئة تلقائية عند تحميل السكريبت
if (typeof window !== 'undefined') {
    window.APP_AI_ENGINE = APP_AI_ENGINE;
}
