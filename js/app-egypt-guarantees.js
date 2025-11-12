// ==================== نظام خطابات الضمان المصري ====================
const APP_EGYPT_GUARANTEES = (function() {
    'use strict';

    // ==================== Real Guarantees Data ====================
    const REAL_GUARANTEES_DATA = {
        total: 140875,
        active: 34579,
        returned: 106296,
        count: 25
    };

    // ==================== Initialize ====================
    function initialize() {
        console.log('📜 تهيئة نظام خطابات الضمان المصري...');
        
        // Load existing guarantees or create sample data
        let guarantees = APP_EGYPT_CORE.getData('guarantees');
        if (!guarantees || guarantees.length === 0) {
            console.log('📥 تحميل البيانات النموذجية لخطابات الضمان');
            guarantees = generateSampleGuarantees();
            APP_EGYPT_CORE.saveData('guarantees', guarantees);
        }
        
        return {
            initialized: true,
            count: guarantees.length,
            total: calculateTotalGuarantees()
        };
    }

    // ==================== Generate Sample Guarantees ====================
    function generateSampleGuarantees() {
        const guarantees = [];
        const year = 2025;
        
        // Create 25 guarantee letters with realistic distribution
        const guaranteeData = [
            { amount: 12000, duration: 180, status: 'returned' },
            { amount: 8500, duration: 90, status: 'active' },
            { amount: 15000, duration: 120, status: 'returned' },
            { amount: 6700, duration: 60, status: 'active' },
            { amount: 9800, duration: 150, status: 'returned' },
            { amount: 4300, duration: 45, status: 'active' },
            { amount: 11200, duration: 100, status: 'returned' },
            { amount: 7600, duration: 75, status: 'active' },
            { amount: 13500, duration: 200, status: 'returned' },
            { amount: 5200, duration: 30, status: 'active' },
            { amount: 10500, duration: 180, status: 'returned' },
            { amount: 3900, duration: 60, status: 'active' },
            { amount: 8700, duration: 120, status: 'returned' },
            { amount: 6100, duration: 90, status: 'returned' },
            { amount: 9300, duration: 150, status: 'returned' },
            { amount: 4800, duration: 45, status: 'active' },
            { amount: 7200, duration: 100, status: 'returned' },
            { amount: 5500, duration: 75, status: 'returned' },
            { amount: 12800, duration: 200, status: 'returned' },
            { amount: 3600, duration: 30, status: 'returned' },
            { amount: 11000, duration: 180, status: 'returned' },
            { amount: 4700, duration: 60, status: 'active' },
            { amount: 8200, duration: 120, status: 'returned' },
            { amount: 6400, duration: 90, status: 'returned' },
            { amount: 9600, duration: 150, status: 'returned' }
        ];
        
        guaranteeData.forEach((g, index) => {
            const issueDate = new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            const expiryDate = new Date(issueDate);
            expiryDate.setDate(expiryDate.getDate() + g.duration);
            
            const returnDate = g.status === 'returned' 
                ? new Date(expiryDate.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
                : null;
            
            guarantees.push({
                id: APP_EGYPT_CORE.generateId('LG-'),
                letterNumber: `LG-${year}-${String(index + 1).padStart(3, '0')}`,
                customerId: ['C-202103', 'C-202105', 'C-202107', 'C-202109', 'C-202111'][Math.floor(Math.random() * 5)],
                customerName: ['جمعية رجال الأعمال', 'مركز القلب الدولي', 'شركة التجارة المتحدة', 'مستشفى النور', 'معهد التدريب المهني'][Math.floor(Math.random() * 5)],
                amount: g.amount,
                bankName: ['بنك مصر', 'البنك الأهلي المصري', 'بنك القاهرة', 'البنك التجاري الدولي'][Math.floor(Math.random() * 4)],
                issueDate: issueDate.toISOString().split('T')[0],
                expiryDate: expiryDate.toISOString().split('T')[0],
                duration: g.duration,
                status: g.status,
                returnDate: returnDate ? returnDate.toISOString().split('T')[0] : null,
                projectName: `مشروع ${index + 1}`,
                notes: g.status === 'returned' ? 'تم استرداد الخطاب' : 'خطاب ساري',
                createdAt: issueDate.toISOString(),
                updatedAt: new Date().toISOString()
            });
        });
        
        return guarantees;
    }

    // ==================== Create Guarantee ====================
    function createGuarantee(data) {
        const guarantees = APP_EGYPT_CORE.getData('guarantees');
        
        const issueDate = new Date(data.issueDate);
        const expiryDate = new Date(issueDate);
        expiryDate.setDate(expiryDate.getDate() + (data.duration || 90));
        
        const guarantee = {
            id: APP_EGYPT_CORE.generateId('LG-'),
            letterNumber: data.letterNumber || `LG-${Date.now()}`,
            customerId: data.customerId,
            customerName: data.customerName,
            amount: Number(data.amount),
            bankName: data.bankName || '',
            issueDate: data.issueDate,
            expiryDate: expiryDate.toISOString().split('T')[0],
            duration: data.duration || 90,
            status: 'active',
            returnDate: null,
            projectName: data.projectName || '',
            notes: data.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        guarantees.push(guarantee);
        APP_EGYPT_CORE.saveData('guarantees', guarantees);
        
        return guarantee;
    }

    // ==================== Update Guarantee ====================
    function updateGuarantee(id, updates) {
        const guarantees = APP_EGYPT_CORE.getData('guarantees');
        const index = guarantees.findIndex(g => g.id === id);
        
        if (index === -1) {
            return { success: false, message: 'خطاب الضمان غير موجود' };
        }
        
        guarantees[index] = {
            ...guarantees[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        APP_EGYPT_CORE.saveData('guarantees', guarantees);
        
        return { success: true, guarantee: guarantees[index] };
    }

    // ==================== Return Guarantee ====================
    function returnGuarantee(id, returnDate) {
        return updateGuarantee(id, {
            status: 'returned',
            returnDate: returnDate || new Date().toISOString().split('T')[0]
        });
    }

    // ==================== Delete Guarantee ====================
    function deleteGuarantee(id) {
        const guarantees = APP_EGYPT_CORE.getData('guarantees');
        const index = guarantees.findIndex(g => g.id === id);
        
        if (index === -1) {
            return { success: false, message: 'خطاب الضمان غير موجود' };
        }
        
        guarantees.splice(index, 1);
        APP_EGYPT_CORE.saveData('guarantees', guarantees);
        
        return { success: true, message: 'تم حذف خطاب الضمان' };
    }

    // ==================== Get Guarantees ====================
    function getAllGuarantees(filters = {}) {
        let guarantees = APP_EGYPT_CORE.getData('guarantees');
        
        // Apply filters
        if (filters.status) {
            guarantees = guarantees.filter(g => g.status === filters.status);
        }
        
        if (filters.customerId) {
            guarantees = guarantees.filter(g => g.customerId === filters.customerId);
        }
        
        if (filters.expiringIn) {
            const daysFromNow = new Date();
            daysFromNow.setDate(daysFromNow.getDate() + filters.expiringIn);
            const expiryThreshold = daysFromNow.toISOString().split('T')[0];
            
            guarantees = guarantees.filter(g => 
                g.status === 'active' && g.expiryDate <= expiryThreshold
            );
        }
        
        // Sort by expiry date
        guarantees.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        
        return guarantees;
    }

    function getGuaranteeById(id) {
        const guarantees = APP_EGYPT_CORE.getData('guarantees');
        return guarantees.find(g => g.id === id);
    }

    // ==================== Statistics ====================
    function calculateTotalGuarantees(status = null) {
        const filters = status ? { status } : {};
        const guarantees = getAllGuarantees(filters);
        return guarantees.reduce((sum, g) => sum + g.amount, 0);
    }

    function getGuaranteeStatistics() {
        const allGuarantees = getAllGuarantees();
        const activeGuarantees = getAllGuarantees({ status: 'active' });
        const returnedGuarantees = getAllGuarantees({ status: 'returned' });
        const expiringSoon = getAllGuarantees({ status: 'active', expiringIn: 30 });
        
        return {
            total: {
                count: allGuarantees.length,
                amount: calculateTotalGuarantees()
            },
            active: {
                count: activeGuarantees.length,
                amount: calculateTotalGuarantees('active')
            },
            returned: {
                count: returnedGuarantees.length,
                amount: calculateTotalGuarantees('returned')
            },
            expiringSoon: {
                count: expiringSoon.length,
                amount: expiringSoon.reduce((sum, g) => sum + g.amount, 0)
            }
        };
    }

    // ==================== Render Guarantees List ====================
    function renderGuaranteesList(containerId = 'guarantees-list', filters = {}) {
        const guarantees = getAllGuarantees(filters);
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        if (guarantees.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="bi bi-shield-check text-6xl text-gray-300"></i>
                    <p class="mt-4 text-gray-500">لا توجد خطابات ضمان</p>
                </div>
            `;
            return;
        }
        
        const html = guarantees.map(guarantee => {
            const isExpiringSoon = guarantee.status === 'active' && 
                new Date(guarantee.expiryDate) - new Date() < 30 * 24 * 60 * 60 * 1000;
            
            return `
                <tr class="${isExpiringSoon ? 'bg-yellow-50' : ''}">
                    <td>${guarantee.letterNumber}</td>
                    <td>${guarantee.customerName}</td>
                    <td>${guarantee.projectName}</td>
                    <td class="font-bold">${APP_EGYPT_CORE.formatCurrency(guarantee.amount)}</td>
                    <td>${guarantee.bankName}</td>
                    <td>${APP_EGYPT_CORE.formatDate(guarantee.issueDate, 'short')}</td>
                    <td>${APP_EGYPT_CORE.formatDate(guarantee.expiryDate, 'short')}</td>
                    <td>
                        ${guarantee.status === 'active' 
                            ? `<span class="badge badge-success">ساري ${isExpiringSoon ? '⚠️' : ''}</span>` 
                            : '<span class="badge badge-ghost">مردود</span>'}
                    </td>
                    <td>
                        ${guarantee.status === 'active' 
                            ? `<button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_GUARANTEES.returnGuarantee('${guarantee.id}')">
                                <i class="bi bi-check-circle"></i> استرداد
                            </button>`
                            : `<span class="text-sm text-gray-500">${APP_EGYPT_CORE.formatDate(guarantee.returnDate, 'short')}</span>`}
                    </td>
                </tr>
            `;
        }).join('');
        
        container.innerHTML = html;
    }

    // ==================== Public API ====================
    return {
        initialize,
        REAL_GUARANTEES_DATA,
        createGuarantee,
        updateGuarantee,
        returnGuarantee,
        deleteGuarantee,
        getAllGuarantees,
        getGuaranteeById,
        calculateTotalGuarantees,
        getGuaranteeStatistics,
        renderGuaranteesList
    };
})();

// Log when loaded
if (typeof window !== 'undefined') {
    console.log('🇪🇬 نظام خطابات الضمان المصري جاهز (140,875 ج.م إجمالي)');
}
