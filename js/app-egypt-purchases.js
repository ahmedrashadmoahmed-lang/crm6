// ==================== نظام المشتريات المصري ====================
const APP_EGYPT_PURCHASES = (function() {
    'use strict';

    // ==================== Sample Real Purchase Data ====================
    const REAL_PURCHASE_DATA = [
    {
        id: 'PUR-23',
        invoiceNumber: '23',
        supplierId: 'S-202130',
        supplierName: 'النجاح التجاري',
        date: '2025-01-03',
        subtotal: 10613.11,
        vat: 1485.84,
        incomeTax: 106.13,
        total: 12205.08,
        linkedSale: 'INV-243-1233',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-24',
        invoiceNumber: '24',
        supplierId: 'S-202102',
        supplierName: 'الحمد ستور',
        date: '2025-01-12',
        subtotal: 6823.82,
        vat: 955.33,
        incomeTax: 68.24,
        total: 7847.39,
        linkedSale: 'INV-243-1234',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-25',
        invoiceNumber: '25',
        supplierId: 'S-202178',
        supplierName: 'المصرية للتوريدات',
        date: '2025-01-08',
        subtotal: 7387.3,
        vat: 1034.22,
        incomeTax: 73.87,
        total: 8495.39,
        linkedSale: 'INV-243-1234',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-26',
        invoiceNumber: '26',
        supplierId: 'S-202210',
        supplierName: 'الطموح للتقنية',
        date: '2025-01-14',
        subtotal: 12440.02,
        vat: 1741.6,
        incomeTax: 124.4,
        total: 14306.02,
        linkedSale: 'INV-243-1235',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-27',
        invoiceNumber: '27',
        supplierId: 'S-202160',
        supplierName: 'البداية للتوريدات',
        date: '2025-01-15',
        subtotal: 8098.64,
        vat: 1133.81,
        incomeTax: 80.99,
        total: 9313.44,
        linkedSale: 'INV-243-1236',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-28',
        invoiceNumber: '28',
        supplierId: 'S-202210',
        supplierName: 'الطموح للتقنية',
        date: '2025-01-20',
        subtotal: 6668.98,
        vat: 933.66,
        incomeTax: 66.69,
        total: 7669.33,
        linkedSale: 'INV-243-1236',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-29',
        invoiceNumber: '29',
        supplierId: 'S-202275',
        supplierName: 'الوميض التجاري',
        date: '2025-01-22',
        subtotal: 13303.75,
        vat: 1862.53,
        incomeTax: 133.04,
        total: 15299.32,
        linkedSale: 'INV-243-1237',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-30',
        invoiceNumber: '30',
        supplierId: 'S-202115',
        supplierName: 'التقنية المتقدمة',
        date: '2025-01-22',
        subtotal: 13581.15,
        vat: 1901.36,
        incomeTax: 135.81,
        total: 15618.32,
        linkedSale: 'INV-243-1238',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-31',
        invoiceNumber: '31',
        supplierId: 'S-202265',
        supplierName: 'اللمعة التجارية',
        date: '2025-01-26',
        subtotal: 5774.91,
        vat: 808.49,
        incomeTax: 57.75,
        total: 6641.15,
        linkedSale: 'INV-243-1239',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-32',
        invoiceNumber: '32',
        supplierId: 'S-202160',
        supplierName: 'البداية للتوريدات',
        date: '2025-01-31',
        subtotal: 6185.15,
        vat: 865.92,
        incomeTax: 61.85,
        total: 7112.92,
        linkedSale: 'INV-243-1239',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-33',
        invoiceNumber: '33',
        supplierId: 'S-202170',
        supplierName: 'التطور للتقنية',
        date: '2025-01-30',
        subtotal: 13603.58,
        vat: 1904.5,
        incomeTax: 136.04,
        total: 15644.12,
        linkedSale: 'INV-243-1240',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-34',
        invoiceNumber: '34',
        supplierId: 'S-202114',
        supplierName: 'المتحدة',
        date: '2025-02-02',
        subtotal: 5423.5,
        vat: 759.29,
        incomeTax: 54.24,
        total: 6237.03,
        linkedSale: 'INV-243-1241',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-35',
        invoiceNumber: '35',
        supplierId: 'S-202180',
        supplierName: 'الرخاء للتوريدات',
        date: '2025-02-08',
        subtotal: 6064.8,
        vat: 849.07,
        incomeTax: 60.65,
        total: 6974.52,
        linkedSale: 'INV-243-1241',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-36',
        invoiceNumber: '36',
        supplierId: 'S-202110',
        supplierName: 'شركة النيل للتجارة',
        date: '2025-02-10',
        subtotal: 6759.66,
        vat: 946.35,
        incomeTax: 67.6,
        total: 7773.61,
        linkedSale: 'INV-243-1242',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-37',
        invoiceNumber: '37',
        supplierId: 'S-202185',
        supplierName: 'الانطلاقة التجارية',
        date: '2025-02-11',
        subtotal: 6712.35,
        vat: 939.73,
        incomeTax: 67.12,
        total: 7719.2,
        linkedSale: 'INV-243-1242',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-38',
        invoiceNumber: '38',
        supplierId: 'S-202110',
        supplierName: 'شركة النيل للتجارة',
        date: '2025-02-11',
        subtotal: 6669.69,
        vat: 933.76,
        incomeTax: 66.7,
        total: 7670.15,
        linkedSale: 'INV-243-1243',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-39',
        invoiceNumber: '39',
        supplierId: 'S-202140',
        supplierName: 'المجد للتقنية',
        date: '2025-02-11',
        subtotal: 5695.57,
        vat: 797.38,
        incomeTax: 56.96,
        total: 6549.91,
        linkedSale: 'INV-243-1243',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-40',
        invoiceNumber: '40',
        supplierId: 'S-202175',
        supplierName: 'الازدهار التجاري',
        date: '2025-02-19',
        subtotal: 11281.36,
        vat: 1579.39,
        incomeTax: 112.81,
        total: 12973.56,
        linkedSale: 'INV-243-1244',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-41',
        invoiceNumber: '41',
        supplierId: 'S-202165',
        supplierName: 'النهضة التجارية',
        date: '2025-02-23',
        subtotal: 15459.26,
        vat: 2164.3,
        incomeTax: 154.59,
        total: 17778.15,
        linkedSale: 'INV-243-1245',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-42',
        invoiceNumber: '42',
        supplierId: 'S-202255',
        supplierName: 'الصباح التجاري',
        date: '2025-02-28',
        subtotal: 6784.29,
        vat: 949.8,
        incomeTax: 67.84,
        total: 7801.93,
        linkedSale: 'INV-243-1246',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-43',
        invoiceNumber: '43',
        supplierId: 'S-202178',
        supplierName: 'المصرية للتوريدات',
        date: '2025-02-22',
        subtotal: 6067.2,
        vat: 849.41,
        incomeTax: 60.67,
        total: 6977.28,
        linkedSale: 'INV-243-1246',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-44',
        invoiceNumber: '44',
        supplierId: 'S-202170',
        supplierName: 'التطور للتقنية',
        date: '2025-03-03',
        subtotal: 6783.84,
        vat: 949.74,
        incomeTax: 67.84,
        total: 7801.42,
        linkedSale: 'INV-243-1247',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-45',
        invoiceNumber: '45',
        supplierId: 'S-202220',
        supplierName: 'الغاية للتوريدات',
        date: '2025-02-26',
        subtotal: 5872.45,
        vat: 822.14,
        incomeTax: 58.72,
        total: 6753.31,
        linkedSale: 'INV-243-1247',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-46',
        invoiceNumber: '46',
        supplierId: 'S-202245',
        supplierName: 'الضياء التجاري',
        date: '2025-03-03',
        subtotal: 5094.04,
        vat: 713.17,
        incomeTax: 50.94,
        total: 5858.15,
        linkedSale: 'INV-243-1248',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-47',
        invoiceNumber: '47',
        supplierId: 'S-202165',
        supplierName: 'النهضة التجارية',
        date: '2025-03-08',
        subtotal: 3052.3,
        vat: 427.32,
        incomeTax: 30.52,
        total: 3510.14,
        linkedSale: 'INV-243-1249',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-48',
        invoiceNumber: '48',
        supplierId: 'S-202178',
        supplierName: 'المصرية للتوريدات',
        date: '2025-03-07',
        subtotal: 2450.72,
        vat: 343.1,
        incomeTax: 24.51,
        total: 2818.33,
        linkedSale: 'INV-243-1249',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-49',
        invoiceNumber: '49',
        supplierId: 'S-202145',
        supplierName: 'الفجر الجديد',
        date: '2025-03-14',
        subtotal: 1957.93,
        vat: 274.11,
        incomeTax: 19.58,
        total: 2251.62,
        linkedSale: 'INV-243-1250',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-50',
        invoiceNumber: '50',
        supplierId: 'S-202125',
        supplierName: 'الأمل للتوريدات',
        date: '2025-03-09',
        subtotal: 1840.67,
        vat: 257.69,
        incomeTax: 18.41,
        total: 2116.77,
        linkedSale: 'INV-243-1250',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-51',
        invoiceNumber: '51',
        supplierId: 'S-202102',
        supplierName: 'الحمد ستور',
        date: '2025-03-19',
        subtotal: 2631.05,
        vat: 368.35,
        incomeTax: 26.31,
        total: 3025.71,
        linkedSale: 'INV-243-1251',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-52',
        invoiceNumber: '52',
        supplierId: 'S-202150',
        supplierName: 'الشروق للتجارة',
        date: '2025-03-17',
        subtotal: 2800.92,
        vat: 392.13,
        incomeTax: 28.01,
        total: 3221.06,
        linkedSale: 'INV-243-1251',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-53',
        invoiceNumber: '53',
        supplierId: 'S-202245',
        supplierName: 'الضياء التجاري',
        date: '2025-03-22',
        subtotal: 4086.29,
        vat: 572.08,
        incomeTax: 40.86,
        total: 4699.23,
        linkedSale: 'INV-243-1252',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-54',
        invoiceNumber: '54',
        supplierId: 'S-202155',
        supplierName: 'الأفق التجاري',
        date: '2025-03-23',
        subtotal: 4801.63,
        vat: 672.23,
        incomeTax: 48.02,
        total: 5521.88,
        linkedSale: 'INV-243-1253',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-55',
        invoiceNumber: '55',
        supplierId: 'S-202114',
        supplierName: 'المتحدة',
        date: '2025-03-26',
        subtotal: 4664.09,
        vat: 652.97,
        incomeTax: 46.64,
        total: 5363.7,
        linkedSale: 'INV-243-1254',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-56',
        invoiceNumber: '56',
        supplierId: 'S-202250',
        supplierName: 'الإشراق للتقنية',
        date: '2025-04-02',
        subtotal: 3136.29,
        vat: 439.08,
        incomeTax: 31.36,
        total: 3606.73,
        linkedSale: 'INV-243-1255',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-57',
        invoiceNumber: '57',
        supplierId: 'S-202205',
        supplierName: 'المبادرة التجارية',
        date: '2025-03-30',
        subtotal: 2548.29,
        vat: 356.76,
        incomeTax: 25.48,
        total: 2930.53,
        linkedSale: 'INV-243-1255',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-58',
        invoiceNumber: '58',
        supplierId: 'S-202267',
        supplierName: 'Saudi Technology',
        date: '2025-04-02',
        subtotal: 15350.69,
        vat: 2149.1,
        incomeTax: 153.51,
        total: 17653.3,
        linkedSale: 'INV-243-1256',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-59',
        invoiceNumber: '59',
        supplierId: 'S-202205',
        supplierName: 'المبادرة التجارية',
        date: '2025-04-06',
        subtotal: 10535.2,
        vat: 1474.93,
        incomeTax: 105.35,
        total: 12115.48,
        linkedSale: 'INV-243-1257',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-60',
        invoiceNumber: '60',
        supplierId: 'S-202230',
        supplierName: 'الوجهة للتقنية',
        date: '2025-04-11',
        subtotal: 4889.89,
        vat: 684.58,
        incomeTax: 48.9,
        total: 5623.37,
        linkedSale: 'INV-243-1258',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-61',
        invoiceNumber: '61',
        supplierId: 'S-202114',
        supplierName: 'المتحدة',
        date: '2025-04-12',
        subtotal: 5715.48,
        vat: 800.17,
        incomeTax: 57.15,
        total: 6572.8,
        linkedSale: 'INV-243-1258',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-62',
        invoiceNumber: '62',
        supplierId: 'S-202160',
        supplierName: 'البداية للتوريدات',
        date: '2025-04-14',
        subtotal: 6629.37,
        vat: 928.11,
        incomeTax: 66.29,
        total: 7623.77,
        linkedSale: 'INV-243-1259',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-63',
        invoiceNumber: '63',
        supplierId: 'S-202134',
        supplierName: 'كرنفال',
        date: '2025-04-14',
        subtotal: 5921.61,
        vat: 829.03,
        incomeTax: 59.22,
        total: 6809.86,
        linkedSale: 'INV-243-1259',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-64',
        invoiceNumber: '64',
        supplierId: 'S-202260',
        supplierName: 'النور للتوريدات',
        date: '2025-04-18',
        subtotal: 5472.32,
        vat: 766.12,
        incomeTax: 54.72,
        total: 6293.16,
        linkedSale: 'INV-243-1260',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-65',
        invoiceNumber: '65',
        supplierId: 'S-202205',
        supplierName: 'المبادرة التجارية',
        date: '2025-04-19',
        subtotal: 5945.83,
        vat: 832.42,
        incomeTax: 59.46,
        total: 6837.71,
        linkedSale: 'INV-243-1260',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-66',
        invoiceNumber: '66',
        supplierId: 'S-202104',
        supplierName: 'كيمو ستور',
        date: '2025-04-22',
        subtotal: 10445.95,
        vat: 1462.43,
        incomeTax: 104.46,
        total: 12012.84,
        linkedSale: 'INV-243-1261',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-67',
        invoiceNumber: '67',
        supplierId: 'S-202205',
        supplierName: 'المبادرة التجارية',
        date: '2025-04-27',
        subtotal: 7265.46,
        vat: 1017.16,
        incomeTax: 72.65,
        total: 8355.27,
        linkedSale: 'INV-243-1262',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-68',
        invoiceNumber: '68',
        supplierId: 'S-202225',
        supplierName: 'المسار التجاري',
        date: '2025-04-29',
        subtotal: 7178.23,
        vat: 1004.95,
        incomeTax: 71.78,
        total: 8254.96,
        linkedSale: 'INV-243-1262',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-69',
        invoiceNumber: '69',
        supplierId: 'S-202215',
        supplierName: 'الهدف التجاري',
        date: '2025-05-01',
        subtotal: 5856.56,
        vat: 819.92,
        incomeTax: 58.57,
        total: 6735.05,
        linkedSale: 'INV-243-1263',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-70',
        invoiceNumber: '70',
        supplierId: 'S-202101',
        supplierName: 'شرق آسيا',
        date: '2025-04-28',
        subtotal: 4714.24,
        vat: 659.99,
        incomeTax: 47.14,
        total: 5421.37,
        linkedSale: 'INV-243-1263',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-71',
        invoiceNumber: '71',
        supplierId: 'S-202250',
        supplierName: 'الإشراق للتقنية',
        date: '2025-05-06',
        subtotal: 13683.83,
        vat: 1915.74,
        incomeTax: 136.84,
        total: 15736.41,
        linkedSale: 'INV-243-1264',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-72',
        invoiceNumber: '72',
        supplierId: 'S-202245',
        supplierName: 'الضياء التجاري',
        date: '2025-05-10',
        subtotal: 6759.1,
        vat: 946.27,
        incomeTax: 67.59,
        total: 7772.96,
        linkedSale: 'INV-243-1265',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-73',
        invoiceNumber: '73',
        supplierId: 'S-202160',
        supplierName: 'البداية للتوريدات',
        date: '2025-05-06',
        subtotal: 6246.6,
        vat: 874.52,
        incomeTax: 62.47,
        total: 7183.59,
        linkedSale: 'INV-243-1265',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-74',
        invoiceNumber: '74',
        supplierId: 'S-202260',
        supplierName: 'النور للتوريدات',
        date: '2025-05-14',
        subtotal: 11403.56,
        vat: 1596.5,
        incomeTax: 114.04,
        total: 13114.1,
        linkedSale: 'INV-243-1266',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-75',
        invoiceNumber: '75',
        supplierId: 'S-202132',
        supplierName: 'بيتا نتورك',
        date: '2025-05-19',
        subtotal: 7124.04,
        vat: 997.37,
        incomeTax: 71.24,
        total: 8192.65,
        linkedSale: 'INV-243-1267',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-76',
        invoiceNumber: '76',
        supplierId: 'S-202245',
        supplierName: 'الضياء التجاري',
        date: '2025-05-17',
        subtotal: 7397.22,
        vat: 1035.61,
        incomeTax: 73.97,
        total: 8506.8,
        linkedSale: 'INV-243-1267',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-77',
        invoiceNumber: '77',
        supplierId: 'S-202260',
        supplierName: 'النور للتوريدات',
        date: '2025-05-21',
        subtotal: 8048.16,
        vat: 1126.74,
        incomeTax: 80.48,
        total: 9255.38,
        linkedSale: 'INV-243-1268',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-78',
        invoiceNumber: '78',
        supplierId: 'S-202255',
        supplierName: 'الصباح التجاري',
        date: '2025-05-19',
        subtotal: 6885.89,
        vat: 964.02,
        incomeTax: 68.86,
        total: 7918.77,
        linkedSale: 'INV-243-1268',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-79',
        invoiceNumber: '79',
        supplierId: 'S-202102',
        supplierName: 'الحمد ستور',
        date: '2025-05-23',
        subtotal: 6516.58,
        vat: 912.32,
        incomeTax: 65.17,
        total: 7494.07,
        linkedSale: 'INV-243-1269',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-80',
        invoiceNumber: '80',
        supplierId: 'S-202205',
        supplierName: 'المبادرة التجارية',
        date: '2025-05-25',
        subtotal: 6376.11,
        vat: 892.66,
        incomeTax: 63.76,
        total: 7332.53,
        linkedSale: 'INV-243-1269',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-81',
        invoiceNumber: '81',
        supplierId: 'S-202189',
        supplierName: 'شركة التميز',
        date: '2025-05-28',
        subtotal: 18398.35,
        vat: 2575.77,
        incomeTax: 183.98,
        total: 21158.1,
        linkedSale: 'INV-243-1270',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-82',
        invoiceNumber: '82',
        supplierId: 'S-202150',
        supplierName: 'الشروق للتجارة',
        date: '2025-05-31',
        subtotal: 13876.99,
        vat: 1942.78,
        incomeTax: 138.77,
        total: 15958.54,
        linkedSale: 'INV-243-1271',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-83',
        invoiceNumber: '83',
        supplierId: 'S-202175',
        supplierName: 'الازدهار التجاري',
        date: '2025-06-02',
        subtotal: 5672.53,
        vat: 794.15,
        incomeTax: 56.73,
        total: 6523.41,
        linkedSale: 'INV-243-1272',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-84',
        invoiceNumber: '84',
        supplierId: 'S-202101',
        supplierName: 'شرق آسيا',
        date: '2025-06-08',
        subtotal: 7354.98,
        vat: 1029.7,
        incomeTax: 73.55,
        total: 8458.23,
        linkedSale: 'INV-243-1272',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-85',
        invoiceNumber: '85',
        supplierId: 'S-202140',
        supplierName: 'المجد للتقنية',
        date: '2025-06-08',
        subtotal: 13585.37,
        vat: 1901.95,
        incomeTax: 135.85,
        total: 15623.17,
        linkedSale: 'INV-243-1273',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-86',
        invoiceNumber: '86',
        supplierId: 'S-202160',
        supplierName: 'البداية للتوريدات',
        date: '2025-06-11',
        subtotal: 14198.1,
        vat: 1987.73,
        incomeTax: 141.98,
        total: 16327.81,
        linkedSale: 'INV-243-1274',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-87',
        invoiceNumber: '87',
        supplierId: 'S-202225',
        supplierName: 'المسار التجاري',
        date: '2025-06-13',
        subtotal: 6990.37,
        vat: 978.65,
        incomeTax: 69.9,
        total: 8038.92,
        linkedSale: 'INV-243-1275',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-88',
        invoiceNumber: '88',
        supplierId: 'S-202250',
        supplierName: 'الإشراق للتقنية',
        date: '2025-06-13',
        subtotal: 7474.5,
        vat: 1046.43,
        incomeTax: 74.75,
        total: 8595.68,
        linkedSale: 'INV-243-1275',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-89',
        invoiceNumber: '89',
        supplierId: 'S-202200',
        supplierName: 'الابتكار للتوريدات',
        date: '2025-06-17',
        subtotal: 14347.29,
        vat: 2008.62,
        incomeTax: 143.47,
        total: 16499.38,
        linkedSale: 'INV-243-1276',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-90',
        invoiceNumber: '90',
        supplierId: 'S-202185',
        supplierName: 'الانطلاقة التجارية',
        date: '2025-06-25',
        subtotal: 7264.42,
        vat: 1017.02,
        incomeTax: 72.64,
        total: 8354.08,
        linkedSale: 'INV-243-1277',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-91',
        invoiceNumber: '91',
        supplierId: 'S-202102',
        supplierName: 'الحمد ستور',
        date: '2025-06-27',
        subtotal: 7109.11,
        vat: 995.28,
        incomeTax: 71.09,
        total: 8175.48,
        linkedSale: 'INV-243-1277',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-92',
        invoiceNumber: '92',
        supplierId: 'S-202102',
        supplierName: 'الحمد ستور',
        date: '2025-07-01',
        subtotal: 4995.32,
        vat: 699.34,
        incomeTax: 49.95,
        total: 5744.61,
        linkedSale: 'INV-243-1278',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-93',
        invoiceNumber: '93',
        supplierId: 'S-202115',
        supplierName: 'التقنية المتقدمة',
        date: '2025-06-25',
        subtotal: 5562.01,
        vat: 778.68,
        incomeTax: 55.62,
        total: 6396.31,
        linkedSale: 'INV-243-1278',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-94',
        invoiceNumber: '94',
        supplierId: 'S-202114',
        supplierName: 'المتحدة',
        date: '2025-07-05',
        subtotal: 13543.09,
        vat: 1896.03,
        incomeTax: 135.43,
        total: 15574.55,
        linkedSale: 'INV-243-1279',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-95',
        invoiceNumber: '95',
        supplierId: 'S-202120',
        supplierName: 'المستقبل للتكنولوجيا',
        date: '2025-07-09',
        subtotal: 11794.94,
        vat: 1651.29,
        incomeTax: 117.95,
        total: 13564.18,
        linkedSale: 'INV-243-1280',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-96',
        invoiceNumber: '96',
        supplierId: 'S-202205',
        supplierName: 'المبادرة التجارية',
        date: '2025-07-10',
        subtotal: 10990.32,
        vat: 1538.64,
        incomeTax: 109.9,
        total: 12638.86,
        linkedSale: 'INV-243-1281',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-97',
        invoiceNumber: '97',
        supplierId: 'S-202215',
        supplierName: 'الهدف التجاري',
        date: '2025-07-16',
        subtotal: 12247.92,
        vat: 1714.71,
        incomeTax: 122.48,
        total: 14085.11,
        linkedSale: 'INV-243-1282',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-98',
        invoiceNumber: '98',
        supplierId: 'S-202145',
        supplierName: 'الفجر الجديد',
        date: '2025-07-15',
        subtotal: 11379.55,
        vat: 1593.14,
        incomeTax: 113.8,
        total: 13086.49,
        linkedSale: 'INV-243-1283',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-99',
        invoiceNumber: '99',
        supplierId: 'S-202114',
        supplierName: 'المتحدة',
        date: '2025-07-18',
        subtotal: 11223.41,
        vat: 1571.28,
        incomeTax: 112.23,
        total: 12906.92,
        linkedSale: 'INV-243-1284',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-100',
        invoiceNumber: '100',
        supplierId: 'S-202210',
        supplierName: 'الطموح للتقنية',
        date: '2025-07-25',
        subtotal: 11160.16,
        vat: 1562.42,
        incomeTax: 111.6,
        total: 12834.18,
        linkedSale: 'INV-243-1285',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-101',
        invoiceNumber: '101',
        supplierId: 'S-202190',
        supplierName: 'التقدم للتقنية',
        date: '2025-07-28',
        subtotal: 11260.08,
        vat: 1576.41,
        incomeTax: 112.6,
        total: 12949.09,
        linkedSale: 'INV-243-1286',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-102',
        invoiceNumber: '102',
        supplierId: 'S-202220',
        supplierName: 'الغاية للتوريدات',
        date: '2025-08-02',
        subtotal: 6112.72,
        vat: 855.78,
        incomeTax: 61.13,
        total: 7029.63,
        linkedSale: 'INV-243-1287',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-103',
        invoiceNumber: '103',
        supplierId: 'S-202150',
        supplierName: 'الشروق للتجارة',
        date: '2025-08-04',
        subtotal: 6239.74,
        vat: 873.56,
        incomeTax: 62.4,
        total: 7175.7,
        linkedSale: 'INV-243-1287',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-104',
        invoiceNumber: '104',
        supplierId: 'S-202102',
        supplierName: 'الحمد ستور',
        date: '2025-08-09',
        subtotal: 13290.76,
        vat: 1860.71,
        incomeTax: 132.91,
        total: 15284.38,
        linkedSale: 'INV-243-1288',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-105',
        invoiceNumber: '105',
        supplierId: 'S-202135',
        supplierName: 'الرائد للصناعات',
        date: '2025-08-10',
        subtotal: 11910.66,
        vat: 1667.49,
        incomeTax: 119.11,
        total: 13697.26,
        linkedSale: 'INV-243-1289',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-106',
        invoiceNumber: '106',
        supplierId: 'S-202178',
        supplierName: 'المصرية للتوريدات',
        date: '2025-08-10',
        subtotal: 17804.02,
        vat: 2492.56,
        incomeTax: 178.04,
        total: 20474.62,
        linkedSale: 'INV-243-1290',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-107',
        invoiceNumber: '107',
        supplierId: 'S-202130',
        supplierName: 'النجاح التجاري',
        date: '2025-08-14',
        subtotal: 12307.31,
        vat: 1723.02,
        incomeTax: 123.07,
        total: 14153.4,
        linkedSale: 'INV-243-1291',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-108',
        invoiceNumber: '108',
        supplierId: 'S-202200',
        supplierName: 'الابتكار للتوريدات',
        date: '2025-08-23',
        subtotal: 18408.16,
        vat: 2577.14,
        incomeTax: 184.08,
        total: 21169.38,
        linkedSale: 'INV-243-1292',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-109',
        invoiceNumber: '109',
        supplierId: 'S-202240',
        supplierName: 'الشعاع للتوريدات',
        date: '2025-08-23',
        subtotal: 8081.57,
        vat: 1131.42,
        incomeTax: 80.82,
        total: 9293.81,
        linkedSale: 'INV-243-1293',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-110',
        invoiceNumber: '110',
        supplierId: 'S-202215',
        supplierName: 'الهدف التجاري',
        date: '2025-08-25',
        subtotal: 9929.8,
        vat: 1390.17,
        incomeTax: 99.3,
        total: 11419.27,
        linkedSale: 'INV-243-1293',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-111',
        invoiceNumber: '111',
        supplierId: 'S-202265',
        supplierName: 'اللمعة التجارية',
        date: '2025-08-27',
        subtotal: 15173.29,
        vat: 2124.26,
        incomeTax: 151.73,
        total: 17449.28,
        linkedSale: 'INV-243-1294',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-112',
        invoiceNumber: '112',
        supplierId: 'S-202102',
        supplierName: 'الحمد ستور',
        date: '2025-09-01',
        subtotal: 15054.04,
        vat: 2107.57,
        incomeTax: 150.54,
        total: 17312.15,
        linkedSale: 'INV-243-1295',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-113',
        invoiceNumber: '113',
        supplierId: 'S-202200',
        supplierName: 'الابتكار للتوريدات',
        date: '2025-09-08',
        subtotal: 11623.21,
        vat: 1627.25,
        incomeTax: 116.23,
        total: 13366.69,
        linkedSale: 'INV-243-1296',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-114',
        invoiceNumber: '114',
        supplierId: 'S-202155',
        supplierName: 'الأفق التجاري',
        date: '2025-09-11',
        subtotal: 6437.65,
        vat: 901.27,
        incomeTax: 64.38,
        total: 7403.3,
        linkedSale: 'INV-243-1297',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-115',
        invoiceNumber: '115',
        supplierId: 'S-202180',
        supplierName: 'الرخاء للتوريدات',
        date: '2025-09-12',
        subtotal: 6478.5,
        vat: 906.99,
        incomeTax: 64.79,
        total: 7450.28,
        linkedSale: 'INV-243-1297',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-116',
        invoiceNumber: '116',
        supplierId: 'S-202170',
        supplierName: 'التطور للتقنية',
        date: '2025-09-10',
        subtotal: 12280.32,
        vat: 1719.24,
        incomeTax: 122.8,
        total: 14122.36,
        linkedSale: 'INV-243-1298',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-117',
        invoiceNumber: '117',
        supplierId: 'S-202104',
        supplierName: 'كيمو ستور',
        date: '2025-09-18',
        subtotal: 7690.55,
        vat: 1076.68,
        incomeTax: 76.91,
        total: 8844.14,
        linkedSale: 'INV-243-1299',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-118',
        invoiceNumber: '118',
        supplierId: 'S-202170',
        supplierName: 'التطور للتقنية',
        date: '2025-09-20',
        subtotal: 6876.35,
        vat: 962.69,
        incomeTax: 68.76,
        total: 7907.8,
        linkedSale: 'INV-243-1299',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-119',
        invoiceNumber: '119',
        supplierId: 'S-202225',
        supplierName: 'المسار التجاري',
        date: '2025-09-21',
        subtotal: 8372.59,
        vat: 1172.16,
        incomeTax: 83.73,
        total: 9628.48,
        linkedSale: 'INV-243-1300',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-120',
        invoiceNumber: '120',
        supplierId: 'S-202255',
        supplierName: 'الصباح التجاري',
        date: '2025-09-20',
        subtotal: 7572.44,
        vat: 1060.14,
        incomeTax: 75.72,
        total: 8708.3,
        linkedSale: 'INV-243-1300',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-121',
        invoiceNumber: '121',
        supplierId: 'S-202155',
        supplierName: 'الأفق التجاري',
        date: '2025-09-28',
        subtotal: 9705.49,
        vat: 1358.77,
        incomeTax: 97.05,
        total: 11161.31,
        linkedSale: 'INV-243-1301',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-122',
        invoiceNumber: '122',
        supplierId: 'S-202200',
        supplierName: 'الابتكار للتوريدات',
        date: '2025-09-27',
        subtotal: 11228.54,
        vat: 1572,
        incomeTax: 112.29,
        total: 12912.83,
        linkedSale: 'INV-243-1301',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-123',
        invoiceNumber: '123',
        supplierId: 'S-202145',
        supplierName: 'الفجر الجديد',
        date: '2025-09-28',
        subtotal: 8446.14,
        vat: 1182.46,
        incomeTax: 84.46,
        total: 9713.06,
        linkedSale: 'INV-243-1302',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-124',
        invoiceNumber: '124',
        supplierId: 'S-202145',
        supplierName: 'الفجر الجديد',
        date: '2025-09-26',
        subtotal: 7439.06,
        vat: 1041.47,
        incomeTax: 74.39,
        total: 8554.92,
        linkedSale: 'INV-243-1302',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-125',
        invoiceNumber: '125',
        supplierId: 'S-202265',
        supplierName: 'اللمعة التجارية',
        date: '2025-10-01',
        subtotal: 7629.11,
        vat: 1068.08,
        incomeTax: 76.29,
        total: 8773.48,
        linkedSale: 'INV-243-1303',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-126',
        invoiceNumber: '126',
        supplierId: 'S-202255',
        supplierName: 'الصباح التجاري',
        date: '2025-10-03',
        subtotal: 8402.33,
        vat: 1176.33,
        incomeTax: 84.02,
        total: 9662.68,
        linkedSale: 'INV-243-1303',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-127',
        invoiceNumber: '127',
        supplierId: 'S-202235',
        supplierName: 'المنارة التجارية',
        date: '2025-10-05',
        subtotal: 9876.52,
        vat: 1382.71,
        incomeTax: 98.77,
        total: 11358,
        linkedSale: 'INV-243-1304',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-128',
        invoiceNumber: '128',
        supplierId: 'S-202102',
        supplierName: 'الحمد ستور',
        date: '2025-10-10',
        subtotal: 13659.43,
        vat: 1912.32,
        incomeTax: 136.59,
        total: 15708.34,
        linkedSale: 'INV-243-1305',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-129',
        invoiceNumber: '129',
        supplierId: 'S-202134',
        supplierName: 'كرنفال',
        date: '2025-10-12',
        subtotal: 9245.26,
        vat: 1294.34,
        incomeTax: 92.45,
        total: 10632.05,
        linkedSale: 'INV-243-1306',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-130',
        invoiceNumber: '130',
        supplierId: 'S-202220',
        supplierName: 'الغاية للتوريدات',
        date: '2025-10-19',
        subtotal: 8866.14,
        vat: 1241.26,
        incomeTax: 88.66,
        total: 10196.06,
        linkedSale: 'INV-243-1307',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-131',
        invoiceNumber: '131',
        supplierId: 'S-202105',
        supplierName: 'وينر براند',
        date: '2025-10-19',
        subtotal: 6560.11,
        vat: 918.42,
        incomeTax: 65.6,
        total: 7544.13,
        linkedSale: 'INV-243-1308',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-132',
        invoiceNumber: '132',
        supplierId: 'S-202101',
        supplierName: 'شرق آسيا',
        date: '2025-10-22',
        subtotal: 5682.39,
        vat: 795.53,
        incomeTax: 56.82,
        total: 6534.74,
        linkedSale: 'INV-243-1308',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم تسليم اشعار الخصم'
    },
    {
        id: 'PUR-133',
        invoiceNumber: '133',
        supplierId: 'S-202102',
        supplierName: 'الحمد ستور',
        date: '2025-10-29',
        subtotal: 5487.77,
        vat: 768.29,
        incomeTax: 54.88,
        total: 6310.94,
        linkedSale: 'INV-243-1309',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    },
    {
        id: 'PUR-134',
        invoiceNumber: '134',
        supplierId: 'S-202215',
        supplierName: 'الهدف التجاري',
        date: '2025-10-26',
        subtotal: 6739.73,
        vat: 943.56,
        incomeTax: 67.4,
        total: 7750.69,
        linkedSale: 'INV-243-1309',
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'مدفوع'
    }
];

    // ==================== Initialize ====================
    function initialize() {
        console.log('🛒 تهيئة نظام المشتريات المصري...');
        
        // Load existing purchases or use sample data
        let purchases = APP_EGYPT_CORE.getData('purchases');
        if (!purchases || purchases.length === 0) {
            console.log('📥 تحميل البيانات النموذجية للمشتريات');
            purchases = REAL_PURCHASE_DATA;
            APP_EGYPT_CORE.saveData('purchases', purchases);
        }
        
        return {
            initialized: true,
            count: purchases.length,
            total: calculateTotalPurchases()
        };
    }

    // ==================== Create New Purchase ====================
    function createPurchaseInvoice(data) {
        const purchases = APP_EGYPT_CORE.getData('purchases');
        
        // Calculate taxes
        const taxData = APP_EGYPT_TAX.calculateAllTaxes(data.subtotal);
        
        const invoice = {
            id: APP_EGYPT_CORE.generateId('PUR-'),
            invoiceNumber: data.invoiceNumber || APP_EGYPT_CORE.generateInvoiceNumber('purchases'),
            supplierId: data.supplierId,
            supplierName: data.supplierName,
            date: data.date || new Date().toISOString().split('T')[0],
            items: data.items || [],
            subtotal: taxData.subtotal,
            vat: taxData.vat,
            incomeTax: taxData.incomeTax,
            total: taxData.total,
            linkedSale: data.linkedSale || null,
            status: data.status || 'pending',
            paymentMethod: data.paymentMethod || null,
            notes: data.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        purchases.push(invoice);
        APP_EGYPT_CORE.saveData('purchases', purchases);
        
        // Update supplier balance
        updateSupplierBalance(invoice.supplierId, invoice.total);
        
        return invoice;
    }

    // ==================== Update Purchase ====================
    function updatePurchaseInvoice(id, updates) {
        const purchases = APP_EGYPT_CORE.getData('purchases');
        const index = purchases.findIndex(inv => inv.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الفاتورة غير موجودة' };
        }
        
        const invoice = purchases[index];
        
        // Recalculate if subtotal changed
        if (updates.subtotal && updates.subtotal !== invoice.subtotal) {
            const taxData = APP_EGYPT_TAX.calculateAllTaxes(updates.subtotal);
            updates.vat = taxData.vat;
            updates.incomeTax = taxData.incomeTax;
            updates.total = taxData.total;
        }
        
        // Update invoice
        purchases[index] = {
            ...invoice,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        APP_EGYPT_CORE.saveData('purchases', purchases);
        
        return { success: true, invoice: purchases[index] };
    }

    // ==================== Delete Purchase ====================
    function deletePurchaseInvoice(id) {
        const purchases = APP_EGYPT_CORE.getData('purchases');
        const index = purchases.findIndex(inv => inv.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الفاتورة غير موجودة' };
        }
        
        const invoice = purchases[index];
        
        // Update supplier balance
        updateSupplierBalance(invoice.supplierId, -invoice.total);
        
        purchases.splice(index, 1);
        APP_EGYPT_CORE.saveData('purchases', purchases);
        
        return { success: true, message: 'تم حذف الفاتورة' };
    }

    // ==================== Get Purchases ====================
    function getAllPurchases(filters = {}) {
        let purchases = APP_EGYPT_CORE.getData('purchases');
        
        // Apply filters
        if (filters.supplierId) {
            purchases = purchases.filter(inv => inv.supplierId === filters.supplierId);
        }
        
        if (filters.status) {
            purchases = purchases.filter(inv => inv.status === filters.status);
        }
        
        if (filters.dateFrom) {
            purchases = purchases.filter(inv => inv.date >= filters.dateFrom);
        }
        
        if (filters.dateTo) {
            purchases = purchases.filter(inv => inv.date <= filters.dateTo);
        }
        
        // Sort by date descending
        purchases.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return purchases;
    }

    function getPurchaseById(id) {
        const purchases = APP_EGYPT_CORE.getData('purchases');
        return purchases.find(inv => inv.id === id);
    }

    // ==================== Statistics ====================
    function calculateTotalPurchases(filters = {}) {
        const purchases = getAllPurchases(filters);
        return purchases.reduce((sum, inv) => sum + inv.total, 0);
    }

    function calculatePurchasesStatistics(year = new Date().getFullYear()) {
        const purchases = getAllPurchases().filter(inv => {
            const invYear = new Date(inv.date).getFullYear();
            return invYear === year;
        });
        
        const totalPurchases = purchases.reduce((sum, inv) => sum + inv.total, 0);
        const totalVAT = purchases.reduce((sum, inv) => sum + inv.vat, 0);
        const totalIncomeTax = purchases.reduce((sum, inv) => sum + inv.incomeTax, 0);
        const paidInvoices = purchases.filter(inv => inv.status === 'paid');
        const pendingInvoices = purchases.filter(inv => inv.status === 'pending');
        
        return {
            year,
            totalInvoices: purchases.length,
            totalPurchases,
            totalVAT,
            totalIncomeTax,
            paidInvoices: {
                count: paidInvoices.length,
                total: paidInvoices.reduce((sum, inv) => sum + inv.total, 0)
            },
            pendingInvoices: {
                count: pendingInvoices.length,
                total: pendingInvoices.reduce((sum, inv) => sum + inv.total, 0)
            }
        };
    }

    // ==================== Link to Sales ====================
    function linkPurchaseToSale(purchaseId, saleId) {
        const result = updatePurchaseInvoice(purchaseId, { linkedSale: saleId });
        
        if (result.success && window.APP_EGYPT_SALES) {
            APP_EGYPT_SALES.updateSaleInvoice(saleId, { linkedPurchase: purchaseId });
        }
        
        return result;
    }

    function unlinkPurchaseFromSale(purchaseId) {
        const purchase = getPurchaseById(purchaseId);
        if (!purchase || !purchase.linkedSale) {
            return { success: false, message: 'لا يوجد ربط بفاتورة مبيعات' };
        }
        
        const saleId = purchase.linkedSale;
        
        const result = updatePurchaseInvoice(purchaseId, { linkedSale: null });
        
        if (result.success && window.APP_EGYPT_SALES) {
            APP_EGYPT_SALES.updateSaleInvoice(saleId, { linkedPurchase: null });
        }
        
        return result;
    }

    // ==================== Update Supplier Balance ====================
    function updateSupplierBalance(supplierId, amount) {
        if (!window.APP_EGYPT_SUPPLIERS) return;
        
        const suppliers = APP_EGYPT_CORE.getData('suppliers');
        const supplier = suppliers.find(s => s.id === supplierId);
        
        if (supplier) {
            supplier.balance = (supplier.balance || 0) + amount;
            APP_EGYPT_CORE.saveData('suppliers', suppliers);
        }
    }

    // ==================== Render Purchases List ====================
    function renderPurchasesList(containerId = 'purchases-list') {
        const purchases = getAllPurchases();
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        if (purchases.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="bi bi-cart text-6xl text-gray-300"></i>
                    <p class="mt-4 text-gray-500">لا توجد فواتير مشتريات</p>
                </div>
            `;
            return;
        }
        
        const html = purchases.map(invoice => `
            <tr>
                <td>${invoice.invoiceNumber}</td>
                <td>${invoice.supplierName}</td>
                <td>${APP_EGYPT_CORE.formatDate(invoice.date, 'short')}</td>
                <td>${APP_EGYPT_CORE.formatCurrency(invoice.subtotal)}</td>
                <td>${APP_EGYPT_CORE.formatCurrency(invoice.vat)}</td>
                <td>${APP_EGYPT_CORE.formatCurrency(invoice.incomeTax)}</td>
                <td class="font-bold">${APP_EGYPT_CORE.formatCurrency(invoice.total)}</td>
                <td>
                    ${invoice.status === 'paid' 
                        ? '<span class="badge badge-success">مدفوع</span>' 
                        : '<span class="badge badge-warning">معلق</span>'}
                </td>
                <td>
                    ${invoice.linkedSale 
                        ? '<span class="badge badge-info">مربوط</span>' 
                        : '<span class="badge badge-ghost">غير مربوط</span>'}
                </td>
                <td>
                    <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_PURCHASES.viewInvoice('${invoice.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_PURCHASES.printInvoice('${invoice.id}')">
                        <i class="bi bi-printer"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        container.innerHTML = html;
    }

    // ==================== Print Invoice ====================
    function printInvoice(id) {
        const invoice = getPurchaseById(id);
        if (!invoice) {
            alert('الفاتورة غير موجودة');
            return;
        }
        
        // Create print window
        const printWindow = window.open('', '_blank');
        const html = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>فاتورة مشتريات ${invoice.invoiceNumber}</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; }
                    .invoice { max-width: 800px; margin: 0 auto; padding: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .details { margin: 20px 0; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 10px; text-align: right; border: 1px solid #ddd; }
                    th { background: #f5f5f5; }
                    .total { font-size: 1.2em; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="header">
                        <h1>فاتورة مشتريات</h1>
                        <h2>${invoice.invoiceNumber}</h2>
                    </div>
                    <div class="details">
                        <p><strong>المورد:</strong> ${invoice.supplierName}</p>
                        <p><strong>التاريخ:</strong> ${APP_EGYPT_CORE.formatDate(invoice.date)}</p>
                        ${invoice.notes ? `<p><strong>ملاحظات:</strong> ${invoice.notes}</p>` : ''}
                    </div>
                    <table>
                        <tr>
                            <th>البيان</th>
                            <th>المبلغ</th>
                        </tr>
                        <tr>
                            <td>المبلغ الأساسي</td>
                            <td>${APP_EGYPT_CORE.formatCurrency(invoice.subtotal)}</td>
                        </tr>
                        <tr>
                            <td>ضريبة القيمة المضافة (14%)</td>
                            <td>${APP_EGYPT_CORE.formatCurrency(invoice.vat)}</td>
                        </tr>
                        <tr>
                            <td>ضريبة الأرباح التجارية (1%)</td>
                            <td>${APP_EGYPT_CORE.formatCurrency(invoice.incomeTax)}</td>
                        </tr>
                        <tr class="total">
                            <td>الإجمالي</td>
                            <td>${APP_EGYPT_CORE.formatCurrency(invoice.total)}</td>
                        </tr>
                    </table>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
    }

    // ==================== Public API ====================
    return {
        initialize,
        createPurchaseInvoice,
        updatePurchaseInvoice,
        deletePurchaseInvoice,
        getAllPurchases,
        getPurchaseById,
        calculateTotalPurchases,
        calculatePurchasesStatistics,
        linkPurchaseToSale,
        unlinkPurchaseFromSale,
        renderPurchasesList,
        printInvoice,
        REAL_PURCHASE_DATA
    };
})();

// Log when loaded
if (typeof window !== 'undefined') {
    console.log('🇪🇬 نظام المشتريات المصري جاهز');
}
