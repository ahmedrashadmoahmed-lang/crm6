// ==================== نماذج الإضافة والتعديل ====================
const APP_MODALS = (function() {
    'use strict';

    // ==================== إضافة عميل جديد ====================
    function showAddCustomerModal() {
        const modalHTML = `
            <dialog id="addCustomerModal" class="modal modal-open">
                <div class="modal-box max-w-2xl">
                    <h3 class="font-bold text-lg mb-4">
                        <i class="bi bi-person-plus text-primary"></i>
                        إضافة عميل جديد
                    </h3>
                    
                    <form id="addCustomerForm" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-control">
                                <label class="label"><span class="label-text">اسم العميل *</span></label>
                                <input type="text" name="name" class="input input-bordered" required />
                            </div>
                            
                            <div class="form-control">
                                <label class="label"><span class="label-text">الاسم بالإنجليزية</span></label>
                                <input type="text" name="nameEn" class="input input-bordered" />
                            </div>
                            
                            <div class="form-control">
                                <label class="label"><span class="label-text">نوع العميل</span></label>
                                <select name="type" class="select select-bordered">
                                    <option value="company">شركة</option>
                                    <option value="individual">فرد</option>
                                </select>
                            </div>
                            
                            <div class="form-control">
                                <label class="label"><span class="label-text">جهة الاتصال</span></label>
                                <input type="text" name="contactPerson" class="input input-bordered" />
                            </div>
                            
                            <div class="form-control">
                                <label class="label"><span class="label-text">البريد الإلكتروني</span></label>
                                <input type="email" name="email" class="input input-bordered" />
                            </div>
                            
                            <div class="form-control">
                                <label class="label"><span class="label-text">رقم الهاتف *</span></label>
                                <input type="tel" name="phone" class="input input-bordered" required />
                            </div>
                            
                            <div class="form-control md:col-span-2">
                                <label class="label"><span class="label-text">العنوان</span></label>
                                <textarea name="address" class="textarea textarea-bordered" rows="2"></textarea>
                            </div>
                            
                            <div class="form-control">
                                <label class="label"><span class="label-text">حد الائتمان</span></label>
                                <input type="number" name="creditLimit" class="input input-bordered" value="100000" />
                            </div>
                            
                            <div class="form-control">
                                <label class="label"><span class="label-text">مندوب المبيعات</span></label>
                                <select name="salesAgent" class="select select-bordered">
                                    <option value="sales_agent1">محمد عبدالله</option>
                                    <option value="sales_agent2">سارة علي</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="modal-action">
                            <button type="button" class="btn btn-ghost" onclick="APP_MODALS.closeModal('addCustomerModal')">إلغاء</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-check-lg"></i>
                                حفظ العميل
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button onclick="APP_MODALS.closeModal('addCustomerModal')">close</button>
                </form>
            </dialog>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        document.getElementById('addCustomerForm').onsubmit = function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const customer = {
                id: APP_CORE.generateId('cust'),
                name: formData.get('name'),
                nameEn: formData.get('nameEn'),
                type: formData.get('type'),
                contactPerson: formData.get('contactPerson'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                creditLimit: parseFloat(formData.get('creditLimit')) || 0,
                currentBalance: 0,
                salesAgent: formData.get('salesAgent'),
                status: 'active',
                createdAt: new Date().toISOString()
            };
            
            APP_CORE.addItem('customers', customer);
            APP_CORE.showToast('تم إضافة العميل بنجاح ✅', 'success');
            APP_MODALS.closeModal('addCustomerModal');
            APP_PAGES.navigateTo('customers');
        };
    }

    // ==================== إضافة عرض سعر جديد ====================
    function showAddQuotationModal() {
        const customers = APP_CORE.getData('customers') || [];
        
        const modalHTML = `
            <dialog id="addQuotationModal" class="modal modal-open">
                <div class="modal-box max-w-4xl">
                    <h3 class="font-bold text-lg mb-4">
                        <i class="bi bi-file-earmark-plus text-primary"></i>
                        إنشاء عرض سعر جديد
                    </h3>
                    
                    <form id="addQuotationForm" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-control">
                                <label class="label"><span class="label-text">العميل *</span></label>
                                <select name="customerId" class="select select-bordered" required>
                                    <option value="">اختر العميل</option>
                                    ${customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                </select>
                            </div>
                            
                            <div class="form-control">
                                <label class="label"><span class="label-text">التاريخ *</span></label>
                                <input type="date" name="date" class="input input-bordered" value="${new Date().toISOString().split('T')[0]}" required />
                            </div>
                            
                            <div class="form-control md:col-span-2">
                                <label class="label"><span class="label-text">تفاصيل العرض *</span></label>
                                <textarea name="details" class="textarea textarea-bordered" rows="2" required></textarea>
                            </div>
                            
                            <div class="form-control">
                                <label class="label"><span class="label-text">التكلفة *</span></label>
                                <input type="number" name="cost" class="input input-bordered" step="0.01" required />
                            </div>
                            
                            <div class="form-control">
                                <label class="label"><span class="label-text">سعر العميل *</span></label>
                                <input type="number" name="customerPrice" class="input input-bordered" step="0.01" required />
                            </div>
                            
                            <div class="form-control md:col-span-2">
                                <label class="label"><span class="label-text">الموردين</span></label>
                                <input type="text" name="suppliers" class="input input-bordered" placeholder="مثال: Rahma - Fayka - Kimo" />
                            </div>
                        </div>
                        
                        <div class="modal-action">
                            <button type="button" class="btn btn-ghost" onclick="APP_MODALS.closeModal('addQuotationModal')">إلغاء</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-check-lg"></i>
                                حفظ العرض
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button onclick="APP_MODALS.closeModal('addQuotationModal')">close</button>
                </form>
            </dialog>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        document.getElementById('addQuotationForm').onsubmit = function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const cost = parseFloat(formData.get('cost')) || 0;
            const customerPrice = parseFloat(formData.get('customerPrice')) || 0;
            const profit = customerPrice - cost;
            
            const quotation = {
                id: APP_CORE.generateId('quo'),
                number: APP_SALES.generateQuotationNumber(),
                date: new Date(formData.get('date')).toISOString(),
                customerId: formData.get('customerId'),
                salesAgent: APP_CORE.appState.currentUser?.id,
                salesPerson: APP_CORE.appState.currentUser?.name,
                details: formData.get('details'),
                suppliers: formData.get('suppliers'),
                cost: cost,
                customerPrice: customerPrice,
                profit: profit,
                status: 'draft',
                availability: 'Yes',
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
            
            APP_CORE.addItem('quotations', quotation);
            APP_CORE.showToast('تم إنشاء عرض السعر بنجاح ✅', 'success');
            APP_MODALS.closeModal('addQuotationModal');
            APP_PAGES.navigateTo('quotations');
        };
    }

    // ==================== إغلاق Modal ====================
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
    }

    // ==================== Public API ====================
    return {
        showAddCustomerModal,
        showAddQuotationModal,
        closeModal
    };
})();

// ==================== تحديث APP_PAGES لاستخدام Modals ====================
if (typeof APP_PAGES !== 'undefined') {
    APP_PAGES.showAddCustomerModal = APP_MODALS.showAddCustomerModal;
    APP_PAGES.showAddQuotationModal = APP_MODALS.showAddQuotationModal;
}