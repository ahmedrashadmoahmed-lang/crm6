// ==================== إدارة الموردين المصري ====================
const APP_EGYPT_SUPPLIERS = (function() {
    'use strict';

    // ==================== Real Supplier Data ====================
    const REAL_SUPPLIERS_DATA = [
    {
        id: 'S-202101',
        code: 'S-202101',
        name: 'شرق آسيا',
        nameEn: 'شرق آسيا',
        phone: '+20 10 2234 6000',
        email: 'info@supplier0.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202101',
        totalInvoices: 3,
        totalPurchases: 20414.34,
        totalPaid: 20414.34,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202267',
        code: 'S-202267',
        name: 'Saudi Technology',
        nameEn: 'Saudi Technology',
        phone: '+20 10 2234 6001',
        email: 'info@supplier1.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202267',
        totalInvoices: 1,
        totalPurchases: 17653.3,
        totalPaid: 17653.3,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202132',
        code: 'S-202132',
        name: 'بيتا نتورك',
        nameEn: 'بيتا نتورك',
        phone: '+20 10 2234 6002',
        email: 'info@supplier2.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202132',
        totalInvoices: 1,
        totalPurchases: 8192.65,
        totalPaid: 8192.65,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202134',
        code: 'S-202134',
        name: 'كرنفال',
        nameEn: 'كرنفال',
        phone: '+20 10 2234 6003',
        email: 'info@supplier3.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202134',
        totalInvoices: 2,
        totalPurchases: 17441.91,
        totalPaid: 17441.91,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202105',
        code: 'S-202105',
        name: 'وينر براند',
        nameEn: 'وينر براند',
        phone: '+20 10 2234 6004',
        email: 'info@supplier4.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202105',
        totalInvoices: 1,
        totalPurchases: 7544.13,
        totalPaid: 7544.13,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202114',
        code: 'S-202114',
        name: 'المتحدة',
        nameEn: 'المتحدة',
        phone: '+20 10 2234 6005',
        email: 'info@supplier5.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202114',
        totalInvoices: 5,
        totalPurchases: 46655,
        totalPaid: 46655,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202156',
        code: 'S-202156',
        name: 'الحديثة للتقنية',
        nameEn: 'الحديثة للتقنية',
        phone: '+20 10 2234 6006',
        email: 'info@supplier6.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202156',
        totalInvoices: 0,
        totalPurchases: 0,
        totalPaid: 0,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202178',
        code: 'S-202178',
        name: 'المصرية للتوريدات',
        nameEn: 'المصرية للتوريدات',
        phone: '+20 10 2234 6007',
        email: 'info@supplier7.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202178',
        totalInvoices: 4,
        totalPurchases: 38765.62,
        totalPaid: 38765.62,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202189',
        code: 'S-202189',
        name: 'شركة التميز',
        nameEn: 'شركة التميز',
        phone: '+20 10 2234 6008',
        email: 'info@supplier8.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202189',
        totalInvoices: 1,
        totalPurchases: 21158.1,
        totalPaid: 21158.1,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202102',
        code: 'S-202102',
        name: 'الحمد ستور',
        nameEn: 'الحمد ستور',
        phone: '+20 10 2234 6009',
        email: 'info@supplier9.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202102',
        totalInvoices: 9,
        totalPurchases: 86903.07,
        totalPaid: 86903.07,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202104',
        code: 'S-202104',
        name: 'كيمو ستور',
        nameEn: 'كيمو ستور',
        phone: '+20 10 2234 6010',
        email: 'info@supplier10.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202104',
        totalInvoices: 2,
        totalPurchases: 20856.98,
        totalPaid: 20856.98,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202110',
        code: 'S-202110',
        name: 'شركة النيل للتجارة',
        nameEn: 'شركة النيل للتجارة',
        phone: '+20 10 2234 6011',
        email: 'info@supplier11.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202110',
        totalInvoices: 2,
        totalPurchases: 15443.76,
        totalPaid: 15443.76,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202115',
        code: 'S-202115',
        name: 'التقنية المتقدمة',
        nameEn: 'التقنية المتقدمة',
        phone: '+20 10 2234 6012',
        email: 'info@supplier12.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202115',
        totalInvoices: 2,
        totalPurchases: 22014.63,
        totalPaid: 22014.63,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202120',
        code: 'S-202120',
        name: 'المستقبل للتكنولوجيا',
        nameEn: 'المستقبل للتكنولوجيا',
        phone: '+20 10 2234 6013',
        email: 'info@supplier13.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202120',
        totalInvoices: 1,
        totalPurchases: 13564.18,
        totalPaid: 13564.18,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202125',
        code: 'S-202125',
        name: 'الأمل للتوريدات',
        nameEn: 'الأمل للتوريدات',
        phone: '+20 10 2234 6014',
        email: 'info@supplier14.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202125',
        totalInvoices: 1,
        totalPurchases: 2116.77,
        totalPaid: 2116.77,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202130',
        code: 'S-202130',
        name: 'النجاح التجاري',
        nameEn: 'النجاح التجاري',
        phone: '+20 10 2234 6015',
        email: 'info@supplier15.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202130',
        totalInvoices: 2,
        totalPurchases: 26358.48,
        totalPaid: 26358.48,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202135',
        code: 'S-202135',
        name: 'الرائد للصناعات',
        nameEn: 'الرائد للصناعات',
        phone: '+20 10 2234 6016',
        email: 'info@supplier16.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202135',
        totalInvoices: 1,
        totalPurchases: 13697.26,
        totalPaid: 13697.26,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202140',
        code: 'S-202140',
        name: 'المجد للتقنية',
        nameEn: 'المجد للتقنية',
        phone: '+20 10 2234 6017',
        email: 'info@supplier17.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202140',
        totalInvoices: 2,
        totalPurchases: 22173.08,
        totalPaid: 22173.08,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202145',
        code: 'S-202145',
        name: 'الفجر الجديد',
        nameEn: 'الفجر الجديد',
        phone: '+20 10 2234 6018',
        email: 'info@supplier18.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202145',
        totalInvoices: 4,
        totalPurchases: 33606.09,
        totalPaid: 33606.09,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202150',
        code: 'S-202150',
        name: 'الشروق للتجارة',
        nameEn: 'الشروق للتجارة',
        phone: '+20 10 2234 6019',
        email: 'info@supplier19.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202150',
        totalInvoices: 3,
        totalPurchases: 26355.3,
        totalPaid: 26355.3,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202155',
        code: 'S-202155',
        name: 'الأفق التجاري',
        nameEn: 'الأفق التجاري',
        phone: '+20 10 2234 6020',
        email: 'info@supplier20.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202155',
        totalInvoices: 3,
        totalPurchases: 24086.49,
        totalPaid: 24086.49,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202160',
        code: 'S-202160',
        name: 'البداية للتوريدات',
        nameEn: 'البداية للتوريدات',
        phone: '+20 10 2234 6021',
        email: 'info@supplier21.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202160',
        totalInvoices: 5,
        totalPurchases: 47561.53,
        totalPaid: 47561.53,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202165',
        code: 'S-202165',
        name: 'النهضة التجارية',
        nameEn: 'النهضة التجارية',
        phone: '+20 10 2234 6022',
        email: 'info@supplier22.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202165',
        totalInvoices: 2,
        totalPurchases: 21288.29,
        totalPaid: 21288.29,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202170',
        code: 'S-202170',
        name: 'التطور للتقنية',
        nameEn: 'التطور للتقنية',
        phone: '+20 10 2234 6023',
        email: 'info@supplier23.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202170',
        totalInvoices: 4,
        totalPurchases: 45475.7,
        totalPaid: 45475.7,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202175',
        code: 'S-202175',
        name: 'الازدهار التجاري',
        nameEn: 'الازدهار التجاري',
        phone: '+20 10 2234 6024',
        email: 'info@supplier24.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202175',
        totalInvoices: 2,
        totalPurchases: 19496.97,
        totalPaid: 19496.97,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202180',
        code: 'S-202180',
        name: 'الرخاء للتوريدات',
        nameEn: 'الرخاء للتوريدات',
        phone: '+20 10 2234 6025',
        email: 'info@supplier25.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202180',
        totalInvoices: 2,
        totalPurchases: 14424.8,
        totalPaid: 14424.8,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202185',
        code: 'S-202185',
        name: 'الانطلاقة التجارية',
        nameEn: 'الانطلاقة التجارية',
        phone: '+20 10 2234 6026',
        email: 'info@supplier26.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202185',
        totalInvoices: 2,
        totalPurchases: 16073.28,
        totalPaid: 16073.28,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202190',
        code: 'S-202190',
        name: 'التقدم للتقنية',
        nameEn: 'التقدم للتقنية',
        phone: '+20 10 2234 6027',
        email: 'info@supplier27.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202190',
        totalInvoices: 1,
        totalPurchases: 12949.09,
        totalPaid: 12949.09,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202195',
        code: 'S-202195',
        name: 'الريادة التجارية',
        nameEn: 'الريادة التجارية',
        phone: '+20 10 2234 6028',
        email: 'info@supplier28.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202195',
        totalInvoices: 0,
        totalPurchases: 0,
        totalPaid: 0,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202200',
        code: 'S-202200',
        name: 'الابتكار للتوريدات',
        nameEn: 'الابتكار للتوريدات',
        phone: '+20 10 2234 6029',
        email: 'info@supplier29.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202200',
        totalInvoices: 4,
        totalPurchases: 63948.28,
        totalPaid: 63948.28,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202205',
        code: 'S-202205',
        name: 'المبادرة التجارية',
        nameEn: 'المبادرة التجارية',
        phone: '+20 10 2234 6030',
        email: 'info@supplier30.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202205',
        totalInvoices: 6,
        totalPurchases: 50210.38,
        totalPaid: 50210.38,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202210',
        code: 'S-202210',
        name: 'الطموح للتقنية',
        nameEn: 'الطموح للتقنية',
        phone: '+20 10 2234 6031',
        email: 'info@supplier31.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202210',
        totalInvoices: 3,
        totalPurchases: 34809.53,
        totalPaid: 34809.53,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202215',
        code: 'S-202215',
        name: 'الهدف التجاري',
        nameEn: 'الهدف التجاري',
        phone: '+20 10 2234 6032',
        email: 'info@supplier32.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202215',
        totalInvoices: 4,
        totalPurchases: 39990.12,
        totalPaid: 39990.12,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202220',
        code: 'S-202220',
        name: 'الغاية للتوريدات',
        nameEn: 'الغاية للتوريدات',
        phone: '+20 10 2234 6033',
        email: 'info@supplier33.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202220',
        totalInvoices: 3,
        totalPurchases: 23979,
        totalPaid: 23979,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202225',
        code: 'S-202225',
        name: 'المسار التجاري',
        nameEn: 'المسار التجاري',
        phone: '+20 10 2234 6034',
        email: 'info@supplier34.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202225',
        totalInvoices: 3,
        totalPurchases: 25922.36,
        totalPaid: 25922.36,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202230',
        code: 'S-202230',
        name: 'الوجهة للتقنية',
        nameEn: 'الوجهة للتقنية',
        phone: '+20 10 2234 6035',
        email: 'info@supplier35.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202230',
        totalInvoices: 1,
        totalPurchases: 5623.37,
        totalPaid: 5623.37,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202235',
        code: 'S-202235',
        name: 'المنارة التجارية',
        nameEn: 'المنارة التجارية',
        phone: '+20 10 2234 6036',
        email: 'info@supplier36.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202235',
        totalInvoices: 1,
        totalPurchases: 11358,
        totalPaid: 11358,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202240',
        code: 'S-202240',
        name: 'الشعاع للتوريدات',
        nameEn: 'الشعاع للتوريدات',
        phone: '+20 10 2234 6037',
        email: 'info@supplier37.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202240',
        totalInvoices: 1,
        totalPurchases: 9293.81,
        totalPaid: 9293.81,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202245',
        code: 'S-202245',
        name: 'الضياء التجاري',
        nameEn: 'الضياء التجاري',
        phone: '+20 10 2234 6038',
        email: 'info@supplier38.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202245',
        totalInvoices: 4,
        totalPurchases: 26837.14,
        totalPaid: 26837.14,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202250',
        code: 'S-202250',
        name: 'الإشراق للتقنية',
        nameEn: 'الإشراق للتقنية',
        phone: '+20 10 2234 6039',
        email: 'info@supplier39.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202250',
        totalInvoices: 3,
        totalPurchases: 27938.82,
        totalPaid: 27938.82,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202255',
        code: 'S-202255',
        name: 'الصباح التجاري',
        nameEn: 'الصباح التجاري',
        phone: '+20 10 2234 6040',
        email: 'info@supplier40.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202255',
        totalInvoices: 4,
        totalPurchases: 34091.68,
        totalPaid: 34091.68,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202260',
        code: 'S-202260',
        name: 'النور للتوريدات',
        nameEn: 'النور للتوريدات',
        phone: '+20 10 2234 6041',
        email: 'info@supplier41.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202260',
        totalInvoices: 3,
        totalPurchases: 28662.64,
        totalPaid: 28662.64,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202265',
        code: 'S-202265',
        name: 'اللمعة التجارية',
        nameEn: 'اللمعة التجارية',
        phone: '+20 10 2234 6042',
        email: 'info@supplier42.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202265',
        totalInvoices: 3,
        totalPurchases: 32863.91,
        totalPaid: 32863.91,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202270',
        code: 'S-202270',
        name: 'البريق للتقنية',
        nameEn: 'البريق للتقنية',
        phone: '+20 10 2234 6043',
        email: 'info@supplier43.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202270',
        totalInvoices: 0,
        totalPurchases: 0,
        totalPaid: 0,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'S-202275',
        code: 'S-202275',
        name: 'الوميض التجاري',
        nameEn: 'الوميض التجاري',
        phone: '+20 10 2234 6044',
        email: 'info@supplier44.eg',
        address: 'القاهرة، مصر',
        taxNumber: 'TAX-S-202275',
        totalInvoices: 1,
        totalPurchases: 15299.32,
        totalPaid: 15299.32,
        balance: 0,
        rating: 'excellent',
        paymentTerms: 30,
        notes: 'تم السداد بالكامل',
        status: 'active',
        createdAt: '2024-01-01'
    }
];

    // ==================== Initialize ====================
    function initialize() {
        console.log('🏭 تهيئة نظام الموردين المصري...');
        
        // Load existing suppliers or use sample data
        let suppliers = APP_EGYPT_CORE.getData('suppliers');
        if (!suppliers || suppliers.length === 0) {
            console.log('📥 تحميل البيانات النموذجية للموردين');
            suppliers = REAL_SUPPLIERS_DATA;
            APP_EGYPT_CORE.saveData('suppliers', suppliers);
        }
        
        return {
            initialized: true,
            count: suppliers.length,
            totalPayables: calculateTotalPayables()
        };
    }

    // ==================== Create Supplier ====================
    function createSupplier(data) {
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        
        const supplier = {
            id: APP_EGYPT_CORE.generateId('S-'),
            code: data.code || `S-${Date.now()}`,
            name: data.name,
            nameEn: data.nameEn || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            taxNumber: data.taxNumber || '',
            totalInvoices: 0,
            totalPurchases: 0,
            totalPaid: 0,
            balance: 0,
            rating: data.rating || 'new',
            paymentTerms: data.paymentTerms || 30,
            notes: data.notes || '',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        suppliers.push(supplier);
        APP_EGYPT_CORE.saveData('suppliers', suppliers);
        
        return supplier;
    }

    // ==================== Update Supplier ====================
    function updateSupplier(id, updates) {
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        const index = suppliers.findIndex(s => s.id === id);
        
        if (index === -1) {
            return { success: false, message: 'المورد غير موجود' };
        }
        
        suppliers[index] = {
            ...suppliers[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        APP_EGYPT_CORE.saveData('suppliers', suppliers);
        
        return { success: true, supplier: suppliers[index] };
    }

    // ==================== Delete Supplier ====================
    function deleteSupplier(id) {
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        const index = suppliers.findIndex(s => s.id === id);
        
        if (index === -1) {
            return { success: false, message: 'المورد غير موجود' };
        }
        
        // Check if supplier has invoices
        const supplier = suppliers[index];
        if (supplier.totalInvoices > 0) {
            return { 
                success: false, 
                message: 'لا يمكن حذف مورد لديه فواتير. يرجى حذف الفواتير أولاً.' 
            };
        }
        
        suppliers.splice(index, 1);
        APP_EGYPT_CORE.saveData('suppliers', suppliers);
        
        return { success: true, message: 'تم حذف المورد' };
    }

    // ==================== Get Suppliers ====================
    function getAllSuppliers(filters = {}) {
        let suppliers = APP_EGYPT_CORE.getData('suppliers');
        
        // Apply filters
        if (filters.status) {
            suppliers = suppliers.filter(s => s.status === filters.status);
        }
        
        if (filters.rating) {
            suppliers = suppliers.filter(s => s.rating === filters.rating);
        }
        
        if (filters.search) {
            const search = filters.search.toLowerCase();
            suppliers = suppliers.filter(s => 
                s.name.toLowerCase().includes(search) ||
                s.code.toLowerCase().includes(search) ||
                (s.phone && s.phone.includes(search))
            );
        }
        
        // Sort by name
        suppliers.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        
        return suppliers;
    }

    function getSupplierById(id) {
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        return suppliers.find(s => s.id === id);
    }

    // ==================== Statistics ====================
    function calculateTotalPayables() {
        const suppliers = getAllSuppliers();
        return suppliers.reduce((sum, s) => sum + (s.balance || 0), 0);
    }

    function getSupplierStatistics() {
        const suppliers = getAllSuppliers();
        
        const totalSuppliers = suppliers.length;
        const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
        const totalPayables = calculateTotalPayables();
        const excellentSuppliers = suppliers.filter(s => s.rating === 'excellent').length;
        
        return {
            totalSuppliers,
            activeSuppliers,
            totalPayables,
            excellentSuppliers,
            averageBalance: totalSuppliers > 0 ? totalPayables / totalSuppliers : 0
        };
    }

    // ==================== Supplier Statement ====================
    function getSupplierStatement(supplierId, dateFrom, dateTo) {
        const supplier = getSupplierById(supplierId);
        if (!supplier) {
            return null;
        }
        
        let purchases = [];
        if (window.APP_EGYPT_PURCHASES) {
            purchases = APP_EGYPT_PURCHASES.getAllPurchases({ 
                supplierId, 
                dateFrom, 
                dateTo 
            });
        }
        
        return {
            supplier,
            purchases,
            summary: {
                totalInvoices: purchases.length,
                totalAmount: purchases.reduce((sum, p) => sum + p.total, 0),
                paidAmount: purchases.filter(p => p.status === 'paid')
                    .reduce((sum, p) => sum + p.total, 0),
                pendingAmount: purchases.filter(p => p.status === 'pending')
                    .reduce((sum, p) => sum + p.total, 0)
            }
        };
    }

    // ==================== Update Supplier Balance ====================
    function updateSupplierBalance(supplierId, amount, increment = true) {
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        const supplier = suppliers.find(s => s.id === supplierId);
        
        if (supplier) {
            if (increment) {
                supplier.balance = (supplier.balance || 0) + amount;
                supplier.totalPurchases = (supplier.totalPurchases || 0) + amount;
                supplier.totalInvoices = (supplier.totalInvoices || 0) + 1;
            } else {
                supplier.balance = amount;
            }
            
            APP_EGYPT_CORE.saveData('suppliers', suppliers);
            return true;
        }
        
        return false;
    }

    function recordPayment(supplierId, amount) {
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        const supplier = suppliers.find(s => s.id === supplierId);
        
        if (supplier) {
            supplier.balance = (supplier.balance || 0) - amount;
            supplier.totalPaid = (supplier.totalPaid || 0) + amount;
            
            APP_EGYPT_CORE.saveData('suppliers', suppliers);
            return true;
        }
        
        return false;
    }

    // ==================== Render Suppliers List ====================
    function renderSuppliersList(containerId = 'suppliers-list') {
        const suppliers = getAllSuppliers();
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        if (suppliers.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="bi bi-building text-6xl text-gray-300"></i>
                    <p class="mt-4 text-gray-500">لا يوجد موردين</p>
                </div>
            `;
            return;
        }
        
        const html = suppliers.map(supplier => {
            const ratingBadge = {
                'excellent': '<span class="badge badge-success">ممتاز</span>',
                'good': '<span class="badge badge-info">جيد</span>',
                'average': '<span class="badge badge-warning">متوسط</span>',
                'poor': '<span class="badge badge-error">ضعيف</span>',
                'new': '<span class="badge badge-ghost">جديد</span>'
            };
            
            return `
                <tr>
                    <td>${supplier.code}</td>
                    <td>${supplier.name}</td>
                    <td>${supplier.phone || '-'}</td>
                    <td>${supplier.totalInvoices}</td>
                    <td>${APP_EGYPT_CORE.formatCurrency(supplier.totalPurchases)}</td>
                    <td>${APP_EGYPT_CORE.formatCurrency(supplier.totalPaid)}</td>
                    <td class="${supplier.balance > 0 ? 'text-error' : 'text-success'} font-bold">
                        ${APP_EGYPT_CORE.formatCurrency(supplier.balance)}
                    </td>
                    <td>${ratingBadge[supplier.rating] || ratingBadge['new']}</td>
                    <td>
                        <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_SUPPLIERS.viewSupplier('${supplier.id}')">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_SUPPLIERS.editSupplier('${supplier.id}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        
        container.innerHTML = html;
    }

    // ==================== Public API ====================
    return {
        initialize,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        getAllSuppliers,
        getSupplierById,
        calculateTotalPayables,
        getSupplierStatistics,
        getSupplierStatement,
        updateSupplierBalance,
        recordPayment,
        renderSuppliersList,
        REAL_SUPPLIERS_DATA
    };
})();

// Log when loaded
if (typeof window !== 'undefined') {
    console.log('🇪🇬 نظام الموردين المصري جاهز');
}
