// ==================== نظام المبيعات المصري ====================
const APP_EGYPT_SALES = (function() {
    'use strict';

    // ==================== Sample Real Sales Data ====================
    const REAL_SALES_DATA = [
    {
        id: 'INV-243-1233',
        invoiceNumber: '243-1233',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-01-09',
        subtotal: 16491.13,
        vat: 2308.76,
        incomeTax: 164.91,
        total: 18964.8,
        collected: 18964.8,
        collectionDate: '2025-01-20',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1234',
        invoiceNumber: '243-1234',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-01-12',
        subtotal: 19501.8,
        vat: 2730.25,
        incomeTax: 195.02,
        total: 22427.07,
        collected: 14223.13,
        collectionDate: null,
        balance: 8203.94,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 8203.94 ج.م'
    },
    {
        id: 'INV-243-1235',
        invoiceNumber: '243-1235',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-01-16',
        subtotal: 20649.81,
        vat: 2890.97,
        incomeTax: 206.5,
        total: 23747.28,
        collected: 23747.28,
        collectionDate: '2025-02-06',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1236',
        invoiceNumber: '243-1236',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-01-20',
        subtotal: 21442.36,
        vat: 3001.93,
        incomeTax: 214.42,
        total: 24658.71,
        collected: 24658.71,
        collectionDate: '2025-02-14',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1237',
        invoiceNumber: '243-1237',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-01-24',
        subtotal: 19117.92,
        vat: 2676.51,
        incomeTax: 191.18,
        total: 21985.61,
        collected: 17674.86,
        collectionDate: null,
        balance: 4310.75,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 4310.75 ج.م'
    },
    {
        id: 'INV-243-1238',
        invoiceNumber: '243-1238',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-01-28',
        subtotal: 19817.21,
        vat: 2774.41,
        incomeTax: 198.17,
        total: 22789.79,
        collected: 22789.79,
        collectionDate: '2025-02-21',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1239',
        invoiceNumber: '243-1239',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-02-01',
        subtotal: 18996.57,
        vat: 2659.52,
        incomeTax: 189.97,
        total: 21846.06,
        collected: 21846.06,
        collectionDate: '2025-02-03',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1240',
        invoiceNumber: '243-1240',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-02-04',
        subtotal: 18841.48,
        vat: 2637.81,
        incomeTax: 188.41,
        total: 21667.7,
        collected: 21667.7,
        collectionDate: '2025-02-09',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1241',
        invoiceNumber: '243-1241',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-02-08',
        subtotal: 15808.16,
        vat: 2213.14,
        incomeTax: 158.08,
        total: 18179.38,
        collected: 18179.38,
        collectionDate: '2025-03-03',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1242',
        invoiceNumber: '243-1242',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-02-12',
        subtotal: 19240.63,
        vat: 2693.69,
        incomeTax: 192.41,
        total: 22126.73,
        collected: 22126.73,
        collectionDate: '2025-02-24',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1243',
        invoiceNumber: '243-1243',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-02-16',
        subtotal: 18108.24,
        vat: 2535.15,
        incomeTax: 181.08,
        total: 20824.47,
        collected: 20824.47,
        collectionDate: '2025-02-21',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1244',
        invoiceNumber: '243-1244',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-02-20',
        subtotal: 15718.38,
        vat: 2200.57,
        incomeTax: 157.18,
        total: 18076.13,
        collected: 13914.48,
        collectionDate: null,
        balance: 4161.65,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 4161.65 ج.م'
    },
    {
        id: 'INV-243-1245',
        invoiceNumber: '243-1245',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-02-24',
        subtotal: 22487.88,
        vat: 3148.3,
        incomeTax: 224.88,
        total: 25861.06,
        collected: 25861.06,
        collectionDate: '2025-03-16',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1246',
        invoiceNumber: '243-1246',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-02-28',
        subtotal: 19991.12,
        vat: 2798.76,
        incomeTax: 199.91,
        total: 22989.79,
        collected: 22989.79,
        collectionDate: '2025-03-11',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1247',
        invoiceNumber: '243-1247',
        customerId: 'C-202110',
        customerName: 'شركة الاسكندرية لتوزيع الكهرباء',
        date: '2025-03-03',
        subtotal: 19401.36,
        vat: 2716.19,
        incomeTax: 194.01,
        total: 22311.56,
        collected: 22311.56,
        collectionDate: '2025-03-30',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1248',
        invoiceNumber: '243-1248',
        customerId: 'C-202103',
        customerName: 'جمعية رجال الاعمال',
        date: '2025-03-07',
        subtotal: 6398.3,
        vat: 895.76,
        incomeTax: 63.98,
        total: 7358.04,
        collected: 7358.04,
        collectionDate: '2025-04-05',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1249',
        invoiceNumber: '243-1249',
        customerId: 'C-202103',
        customerName: 'جمعية رجال الاعمال',
        date: '2025-03-11',
        subtotal: 7701.37,
        vat: 1078.19,
        incomeTax: 77.01,
        total: 8856.57,
        collected: 8856.57,
        collectionDate: '2025-03-28',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1250',
        invoiceNumber: '243-1250',
        customerId: 'C-202103',
        customerName: 'جمعية رجال الاعمال',
        date: '2025-03-15',
        subtotal: 5959.12,
        vat: 834.28,
        incomeTax: 59.59,
        total: 6852.99,
        collected: 6852.99,
        collectionDate: '2025-04-05',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1251',
        invoiceNumber: '243-1251',
        customerId: 'C-202103',
        customerName: 'جمعية رجال الاعمال',
        date: '2025-03-19',
        subtotal: 8025.47,
        vat: 1123.57,
        incomeTax: 80.25,
        total: 9229.29,
        collected: 9229.29,
        collectionDate: '2025-04-05',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1252',
        invoiceNumber: '243-1252',
        customerId: 'C-202103',
        customerName: 'جمعية رجال الاعمال',
        date: '2025-03-23',
        subtotal: 6792.73,
        vat: 950.98,
        incomeTax: 67.93,
        total: 7811.64,
        collected: 7500.72,
        collectionDate: null,
        balance: 310.92,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 310.92 ج.م'
    },
    {
        id: 'INV-243-1253',
        invoiceNumber: '243-1253',
        customerId: 'C-202103',
        customerName: 'جمعية رجال الاعمال',
        date: '2025-03-27',
        subtotal: 7928,
        vat: 1109.92,
        incomeTax: 79.28,
        total: 9117.2,
        collected: 9117.2,
        collectionDate: '2025-04-09',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1254',
        invoiceNumber: '243-1254',
        customerId: 'C-202103',
        customerName: 'جمعية رجال الاعمال',
        date: '2025-03-30',
        subtotal: 7755.82,
        vat: 1085.81,
        incomeTax: 77.56,
        total: 8919.19,
        collected: 8919.19,
        collectionDate: '2025-04-20',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1255',
        invoiceNumber: '243-1255',
        customerId: 'C-202103',
        customerName: 'جمعية رجال الاعمال',
        date: '2025-04-03',
        subtotal: 8275.83,
        vat: 1158.62,
        incomeTax: 82.76,
        total: 9517.21,
        collected: 5356.56,
        collectionDate: null,
        balance: 4160.65,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 4160.65 ج.م'
    },
    {
        id: 'INV-243-1256',
        invoiceNumber: '243-1256',
        customerId: 'C-202189',
        customerName: 'Newtrac Trading',
        date: '2025-04-07',
        subtotal: 20192.15,
        vat: 2826.9,
        incomeTax: 201.92,
        total: 23220.97,
        collected: 23220.97,
        collectionDate: '2025-04-17',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1257',
        invoiceNumber: '243-1257',
        customerId: 'C-202189',
        customerName: 'Newtrac Trading',
        date: '2025-04-11',
        subtotal: 16239.37,
        vat: 2273.51,
        incomeTax: 162.39,
        total: 18675.27,
        collected: 18675.27,
        collectionDate: '2025-05-06',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1258',
        invoiceNumber: '243-1258',
        customerId: 'C-202189',
        customerName: 'Newtrac Trading',
        date: '2025-04-15',
        subtotal: 15954.43,
        vat: 2233.62,
        incomeTax: 159.54,
        total: 18347.59,
        collected: 16221.71,
        collectionDate: null,
        balance: 2125.88,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 2125.88 ج.م'
    },
    {
        id: 'INV-243-1259',
        invoiceNumber: '243-1259',
        customerId: 'C-202189',
        customerName: 'Newtrac Trading',
        date: '2025-04-19',
        subtotal: 19401.25,
        vat: 2716.18,
        incomeTax: 194.01,
        total: 22311.44,
        collected: 22311.44,
        collectionDate: '2025-04-29',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1260',
        invoiceNumber: '243-1260',
        customerId: 'C-202189',
        customerName: 'Newtrac Trading',
        date: '2025-04-23',
        subtotal: 15827.85,
        vat: 2215.9,
        incomeTax: 158.28,
        total: 18202.03,
        collected: 11313.24,
        collectionDate: null,
        balance: 6888.79,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 6888.79 ج.م'
    },
    {
        id: 'INV-243-1261',
        invoiceNumber: '243-1261',
        customerId: 'C-202189',
        customerName: 'Newtrac Trading',
        date: '2025-04-26',
        subtotal: 15046.32,
        vat: 2106.48,
        incomeTax: 150.46,
        total: 17303.26,
        collected: 17303.26,
        collectionDate: '2025-05-23',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1262',
        invoiceNumber: '243-1262',
        customerId: 'C-202189',
        customerName: 'Newtrac Trading',
        date: '2025-04-30',
        subtotal: 18629.91,
        vat: 2608.19,
        incomeTax: 186.3,
        total: 21424.4,
        collected: 21424.4,
        collectionDate: '2025-05-15',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1263',
        invoiceNumber: '243-1263',
        customerId: 'C-202189',
        customerName: 'Newtrac Trading',
        date: '2025-05-04',
        subtotal: 14798.58,
        vat: 2071.8,
        incomeTax: 147.99,
        total: 17018.37,
        collected: 17018.37,
        collectionDate: '2025-06-02',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1264',
        invoiceNumber: '243-1264',
        customerId: 'C-202189',
        customerName: 'Newtrac Trading',
        date: '2025-05-08',
        subtotal: 18969.22,
        vat: 2655.69,
        incomeTax: 189.69,
        total: 21814.6,
        collected: 21814.6,
        collectionDate: '2025-05-27',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1265',
        invoiceNumber: '243-1265',
        customerId: 'C-202174',
        customerName: 'مستشفي سموحة الدولي',
        date: '2025-05-12',
        subtotal: 17003.89,
        vat: 2380.54,
        incomeTax: 170.04,
        total: 19554.47,
        collected: 19554.47,
        collectionDate: '2025-06-10',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1266',
        invoiceNumber: '243-1266',
        customerId: 'C-202174',
        customerName: 'مستشفي سموحة الدولي',
        date: '2025-05-16',
        subtotal: 18152.65,
        vat: 2541.37,
        incomeTax: 181.53,
        total: 20875.55,
        collected: 20875.55,
        collectionDate: '2025-05-19',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1267',
        invoiceNumber: '243-1267',
        customerId: 'C-202174',
        customerName: 'مستشفي سموحة الدولي',
        date: '2025-05-20',
        subtotal: 22768.85,
        vat: 3187.64,
        incomeTax: 227.69,
        total: 26184.18,
        collected: 26184.18,
        collectionDate: '2025-06-08',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1268',
        invoiceNumber: '243-1268',
        customerId: 'C-202174',
        customerName: 'مستشفي سموحة الدولي',
        date: '2025-05-23',
        subtotal: 22024.22,
        vat: 3083.39,
        incomeTax: 220.24,
        total: 25327.85,
        collected: 25327.85,
        collectionDate: '2025-06-15',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1269',
        invoiceNumber: '243-1269',
        customerId: 'C-202174',
        customerName: 'مستشفي سموحة الدولي',
        date: '2025-05-27',
        subtotal: 18354.97,
        vat: 2569.7,
        incomeTax: 183.55,
        total: 21108.22,
        collected: 21108.22,
        collectionDate: '2025-06-13',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1270',
        invoiceNumber: '243-1270',
        customerId: 'C-202174',
        customerName: 'مستشفي سموحة الدولي',
        date: '2025-05-31',
        subtotal: 23800.49,
        vat: 3332.07,
        incomeTax: 238,
        total: 27370.56,
        collected: 27370.56,
        collectionDate: '2025-06-03',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1271',
        invoiceNumber: '243-1271',
        customerId: 'C-202174',
        customerName: 'مستشفي سموحة الدولي',
        date: '2025-06-04',
        subtotal: 18938.25,
        vat: 2651.36,
        incomeTax: 189.38,
        total: 21778.99,
        collected: 21778.99,
        collectionDate: '2025-06-17',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1272',
        invoiceNumber: '243-1272',
        customerId: 'C-202122',
        customerName: 'شركة صقر للأغذية',
        date: '2025-06-08',
        subtotal: 18641.33,
        vat: 2609.79,
        incomeTax: 186.41,
        total: 21437.53,
        collected: 21437.53,
        collectionDate: '2025-07-03',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1273',
        invoiceNumber: '243-1273',
        customerId: 'C-202122',
        customerName: 'شركة صقر للأغذية',
        date: '2025-06-12',
        subtotal: 17361.84,
        vat: 2430.66,
        incomeTax: 173.62,
        total: 19966.12,
        collected: 10495.85,
        collectionDate: null,
        balance: 9470.27,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 9470.27 ج.م'
    },
    {
        id: 'INV-243-1274',
        invoiceNumber: '243-1274',
        customerId: 'C-202122',
        customerName: 'شركة صقر للأغذية',
        date: '2025-06-16',
        subtotal: 20154.67,
        vat: 2821.65,
        incomeTax: 201.55,
        total: 23177.87,
        collected: 23177.87,
        collectionDate: '2025-06-18',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1275',
        invoiceNumber: '243-1275',
        customerId: 'C-202122',
        customerName: 'شركة صقر للأغذية',
        date: '2025-06-19',
        subtotal: 21007.43,
        vat: 2941.04,
        incomeTax: 210.07,
        total: 24158.54,
        collected: 24158.54,
        collectionDate: '2025-06-29',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1276',
        invoiceNumber: '243-1276',
        customerId: 'C-202122',
        customerName: 'شركة صقر للأغذية',
        date: '2025-06-23',
        subtotal: 20659.64,
        vat: 2892.35,
        incomeTax: 206.6,
        total: 23758.59,
        collected: 23758.59,
        collectionDate: '2025-07-21',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1277',
        invoiceNumber: '243-1277',
        customerId: 'C-202122',
        customerName: 'شركة صقر للأغذية',
        date: '2025-06-27',
        subtotal: 20963.53,
        vat: 2934.89,
        incomeTax: 209.64,
        total: 24108.06,
        collected: 24108.06,
        collectionDate: '2025-07-15',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1278',
        invoiceNumber: '243-1278',
        customerId: 'C-202121',
        customerName: 'الإسكندرية للمنتجات البترولية - اسبك',
        date: '2025-07-01',
        subtotal: 15545.79,
        vat: 2176.41,
        incomeTax: 155.46,
        total: 17877.66,
        collected: 17877.66,
        collectionDate: '2025-07-08',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1279',
        invoiceNumber: '243-1279',
        customerId: 'C-202121',
        customerName: 'الإسكندرية للمنتجات البترولية - اسبك',
        date: '2025-07-05',
        subtotal: 20319.63,
        vat: 2844.75,
        incomeTax: 203.2,
        total: 23367.58,
        collected: 23367.58,
        collectionDate: '2025-07-09',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1280',
        invoiceNumber: '243-1280',
        customerId: 'C-202121',
        customerName: 'الإسكندرية للمنتجات البترولية - اسبك',
        date: '2025-07-09',
        subtotal: 19117.39,
        vat: 2676.43,
        incomeTax: 191.17,
        total: 21984.99,
        collected: 21984.99,
        collectionDate: '2025-07-12',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1281',
        invoiceNumber: '243-1281',
        customerId: 'C-202121',
        customerName: 'الإسكندرية للمنتجات البترولية - اسبك',
        date: '2025-07-13',
        subtotal: 15691.34,
        vat: 2196.79,
        incomeTax: 156.91,
        total: 18045.04,
        collected: 18045.04,
        collectionDate: '2025-07-17',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1282',
        invoiceNumber: '243-1282',
        customerId: 'C-202121',
        customerName: 'الإسكندرية للمنتجات البترولية - اسبك',
        date: '2025-07-16',
        subtotal: 16840.35,
        vat: 2357.65,
        incomeTax: 168.4,
        total: 19366.4,
        collected: 19050.92,
        collectionDate: null,
        balance: 315.48,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 315.48 ج.م'
    },
    {
        id: 'INV-243-1283',
        invoiceNumber: '243-1283',
        customerId: 'C-202145',
        customerName: 'مستشفى الجامعة',
        date: '2025-07-20',
        subtotal: 17066.29,
        vat: 2389.28,
        incomeTax: 170.66,
        total: 19626.23,
        collected: 11923.56,
        collectionDate: null,
        balance: 7702.67,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 7702.67 ج.م'
    },
    {
        id: 'INV-243-1284',
        invoiceNumber: '243-1284',
        customerId: 'C-202145',
        customerName: 'مستشفى الجامعة',
        date: '2025-07-24',
        subtotal: 17495.85,
        vat: 2449.42,
        incomeTax: 174.96,
        total: 20120.23,
        collected: 20120.23,
        collectionDate: '2025-08-13',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1285',
        invoiceNumber: '243-1285',
        customerId: 'C-202145',
        customerName: 'مستشفى الجامعة',
        date: '2025-07-28',
        subtotal: 16769.41,
        vat: 2347.72,
        incomeTax: 167.69,
        total: 19284.82,
        collected: 19284.82,
        collectionDate: '2025-08-02',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1286',
        invoiceNumber: '243-1286',
        customerId: 'C-202145',
        customerName: 'مستشفى الجامعة',
        date: '2025-08-01',
        subtotal: 17617.21,
        vat: 2466.41,
        incomeTax: 176.17,
        total: 20259.79,
        collected: 20259.79,
        collectionDate: '2025-08-11',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1287',
        invoiceNumber: '243-1287',
        customerId: 'C-202156',
        customerName: 'شركة التصنيع الحديثة',
        date: '2025-08-05',
        subtotal: 17349.54,
        vat: 2428.94,
        incomeTax: 173.5,
        total: 19951.98,
        collected: 10790.81,
        collectionDate: null,
        balance: 9161.17,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 9161.17 ج.م'
    },
    {
        id: 'INV-243-1288',
        invoiceNumber: '243-1288',
        customerId: 'C-202156',
        customerName: 'شركة التصنيع الحديثة',
        date: '2025-08-09',
        subtotal: 20431.26,
        vat: 2860.38,
        incomeTax: 204.31,
        total: 23495.95,
        collected: 23495.95,
        collectionDate: '2025-08-24',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1289',
        invoiceNumber: '243-1289',
        customerId: 'C-202156',
        customerName: 'شركة التصنيع الحديثة',
        date: '2025-08-12',
        subtotal: 19620.39,
        vat: 2746.85,
        incomeTax: 196.2,
        total: 22563.44,
        collected: 22563.44,
        collectionDate: '2025-08-28',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1290',
        invoiceNumber: '243-1290',
        customerId: 'C-202156',
        customerName: 'شركة التصنيع الحديثة',
        date: '2025-08-16',
        subtotal: 23018.64,
        vat: 3222.61,
        incomeTax: 230.19,
        total: 26471.44,
        collected: 22480.56,
        collectionDate: null,
        balance: 3990.88,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 3990.88 ج.م'
    },
    {
        id: 'INV-243-1291',
        invoiceNumber: '243-1291',
        customerId: 'C-202167',
        customerName: 'مركز الأعمال الدولي',
        date: '2025-08-20',
        subtotal: 19669.1,
        vat: 2753.67,
        incomeTax: 196.69,
        total: 22619.46,
        collected: 22619.46,
        collectionDate: '2025-08-23',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1292',
        invoiceNumber: '243-1292',
        customerId: 'C-202167',
        customerName: 'مركز الأعمال الدولي',
        date: '2025-08-24',
        subtotal: 28626.91,
        vat: 4007.77,
        incomeTax: 286.27,
        total: 32920.95,
        collected: 32920.95,
        collectionDate: '2025-09-05',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1293',
        invoiceNumber: '243-1293',
        customerId: 'C-202167',
        customerName: 'مركز الأعمال الدولي',
        date: '2025-08-28',
        subtotal: 26429.14,
        vat: 3700.08,
        incomeTax: 264.29,
        total: 30393.51,
        collected: 30393.51,
        collectionDate: '2025-09-21',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1294',
        invoiceNumber: '243-1294',
        customerId: 'C-202178',
        customerName: 'شركة المستقبل للتجارة',
        date: '2025-09-01',
        subtotal: 24179.29,
        vat: 3385.1,
        incomeTax: 241.79,
        total: 27806.18,
        collected: 24974.46,
        collectionDate: null,
        balance: 2831.72,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 2831.72 ج.م'
    },
    {
        id: 'INV-243-1295',
        invoiceNumber: '243-1295',
        customerId: 'C-202178',
        customerName: 'شركة المستقبل للتجارة',
        date: '2025-09-05',
        subtotal: 19044.19,
        vat: 2666.19,
        incomeTax: 190.44,
        total: 21900.82,
        collected: 21900.82,
        collectionDate: '2025-10-04',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1296',
        invoiceNumber: '243-1296',
        customerId: 'C-202178',
        customerName: 'شركة المستقبل للتجارة',
        date: '2025-09-08',
        subtotal: 17817.95,
        vat: 2494.51,
        incomeTax: 178.18,
        total: 20490.64,
        collected: 20490.64,
        collectionDate: '2025-09-27',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1297',
        invoiceNumber: '243-1297',
        customerId: 'C-202188',
        customerName: 'المجموعة الطبية المتحدة',
        date: '2025-09-12',
        subtotal: 17945.28,
        vat: 2512.34,
        incomeTax: 179.45,
        total: 20637.07,
        collected: 20637.07,
        collectionDate: '2025-09-15',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1298',
        invoiceNumber: '243-1298',
        customerId: 'C-202188',
        customerName: 'المجموعة الطبية المتحدة',
        date: '2025-09-16',
        subtotal: 19173.23,
        vat: 2684.25,
        incomeTax: 191.73,
        total: 22049.21,
        collected: 18191.24,
        collectionDate: null,
        balance: 3857.97,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 3857.97 ج.م'
    },
    {
        id: 'INV-243-1299',
        invoiceNumber: '243-1299',
        customerId: 'C-202188',
        customerName: 'المجموعة الطبية المتحدة',
        date: '2025-09-20',
        subtotal: 20375.61,
        vat: 2852.59,
        incomeTax: 203.76,
        total: 23431.96,
        collected: 23431.96,
        collectionDate: '2025-09-21',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1300',
        invoiceNumber: '243-1300',
        customerId: 'C-202199',
        customerName: 'شركة الأمل للاستثمار',
        date: '2025-09-24',
        subtotal: 22718.9,
        vat: 3180.65,
        incomeTax: 227.19,
        total: 26126.74,
        collected: 26126.74,
        collectionDate: '2025-10-20',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1301',
        invoiceNumber: '243-1301',
        customerId: 'C-202199',
        customerName: 'شركة الأمل للاستثمار',
        date: '2025-09-28',
        subtotal: 28256.47,
        vat: 3955.91,
        incomeTax: 282.56,
        total: 32494.94,
        collected: 32494.94,
        collectionDate: '2025-10-18',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1302',
        invoiceNumber: '243-1302',
        customerId: 'C-202201',
        customerName: 'مؤسسة التقدم التجارية',
        date: '2025-10-02',
        subtotal: 23057.39,
        vat: 3228.03,
        incomeTax: 230.57,
        total: 26515.99,
        collected: 26515.99,
        collectionDate: '2025-10-21',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1303',
        invoiceNumber: '243-1303',
        customerId: 'C-202201',
        customerName: 'مؤسسة التقدم التجارية',
        date: '2025-10-05',
        subtotal: 22280.33,
        vat: 3119.25,
        incomeTax: 222.8,
        total: 25622.38,
        collected: 25622.38,
        collectionDate: '2025-10-16',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1304',
        invoiceNumber: '243-1304',
        customerId: 'C-202212',
        customerName: 'شركة الرائد للصناعات',
        date: '2025-10-09',
        subtotal: 15710.31,
        vat: 2199.44,
        incomeTax: 157.1,
        total: 18066.85,
        collected: 18066.85,
        collectionDate: '2025-11-07',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1305',
        invoiceNumber: '243-1305',
        customerId: 'C-202212',
        customerName: 'شركة الرائد للصناعات',
        date: '2025-10-13',
        subtotal: 17774.76,
        vat: 2488.47,
        incomeTax: 177.75,
        total: 20440.98,
        collected: 20440.98,
        collectionDate: '2025-10-22',
        balance: 0,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1306',
        invoiceNumber: '243-1306',
        customerId: 'C-202223',
        customerName: 'المركز التجاري الشامل',
        date: '2025-10-17',
        subtotal: 12280.5,
        vat: 1719.27,
        incomeTax: 122.81,
        total: 14122.58,
        collected: 12354.97,
        collectionDate: null,
        balance: 1767.61,
        salesRep: 'هبة',
        linkedPurchase: null,
        status: 'pending',
        paymentMethod: null,
        notes: 'متبقي 1767.61 ج.م'
    },
    {
        id: 'INV-243-1307',
        invoiceNumber: '243-1307',
        customerId: 'C-202223',
        customerName: 'المركز التجاري الشامل',
        date: '2025-10-21',
        subtotal: 12094.23,
        vat: 1693.19,
        incomeTax: 120.94,
        total: 13908.36,
        collected: 13908.36,
        collectionDate: '2025-11-16',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1308',
        invoiceNumber: '243-1308',
        customerId: 'C-202234',
        customerName: 'شركة النجاح المستدام',
        date: '2025-10-25',
        subtotal: 17882.01,
        vat: 2503.48,
        incomeTax: 178.82,
        total: 20564.31,
        collected: 20564.31,
        collectionDate: '2025-10-27',
        balance: 0,
        salesRep: 'دعاء',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    },
    {
        id: 'INV-243-1309',
        invoiceNumber: '243-1309',
        customerId: 'C-202245',
        customerName: 'مجموعة الابتكار التجارية',
        date: '2025-10-29',
        subtotal: 18214.09,
        vat: 2549.97,
        incomeTax: 182.14,
        total: 20946.2,
        collected: 20946.2,
        collectionDate: '2025-11-07',
        balance: 0,
        salesRep: 'منة',
        linkedPurchase: null,
        status: 'paid',
        paymentMethod: 'bank',
        notes: 'تم التحصيل'
    }
];

    // ==================== Initialize ====================
    function initialize() {
        console.log('🧾 تهيئة نظام المبيعات المصري...');
        
        // Load existing sales or use sample data
        let sales = APP_EGYPT_CORE.getData('sales');
        if (!sales || sales.length === 0) {
            console.log('📥 تحميل البيانات النموذجية للمبيعات');
            sales = REAL_SALES_DATA;
            APP_EGYPT_CORE.saveData('sales', sales);
        }
        
        return {
            initialized: true,
            count: sales.length,
            total: calculateTotalSales()
        };
    }

    // ==================== Create New Sale ====================
    function createSaleInvoice(data) {
        const sales = APP_EGYPT_CORE.getData('sales');
        
        // Calculate taxes
        const taxData = APP_EGYPT_TAX.calculateAllTaxes(data.subtotal);
        
        const invoice = {
            id: APP_EGYPT_CORE.generateId('INV-S-'),
            invoiceNumber: data.invoiceNumber || APP_EGYPT_CORE.generateInvoiceNumber('sales'),
            customerId: data.customerId,
            customerName: data.customerName,
            date: data.date || new Date().toISOString().split('T')[0],
            items: data.items || [],
            subtotal: taxData.subtotal,
            vat: taxData.vat,
            incomeTax: taxData.incomeTax,
            total: taxData.total,
            linkedPurchase: data.linkedPurchase || null,
            status: data.status || 'pending',
            paymentMethod: data.paymentMethod || null,
            notes: data.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        sales.push(invoice);
        APP_EGYPT_CORE.saveData('sales', sales);
        
        // Update customer balance
        updateCustomerBalance(invoice.customerId, invoice.total);
        
        return invoice;
    }

    // ==================== Update Sale ====================
    function updateSaleInvoice(id, updates) {
        const sales = APP_EGYPT_CORE.getData('sales');
        const index = sales.findIndex(inv => inv.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الفاتورة غير موجودة' };
        }
        
        const invoice = sales[index];
        
        // Recalculate if subtotal changed
        if (updates.subtotal && updates.subtotal !== invoice.subtotal) {
            const taxData = APP_EGYPT_TAX.calculateAllTaxes(updates.subtotal);
            updates.vat = taxData.vat;
            updates.incomeTax = taxData.incomeTax;
            updates.total = taxData.total;
        }
        
        // Update invoice
        sales[index] = {
            ...invoice,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        APP_EGYPT_CORE.saveData('sales', sales);
        
        return { success: true, invoice: sales[index] };
    }

    // ==================== Delete Sale ====================
    function deleteSaleInvoice(id) {
        const sales = APP_EGYPT_CORE.getData('sales');
        const index = sales.findIndex(inv => inv.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الفاتورة غير موجودة' };
        }
        
        const invoice = sales[index];
        
        // Update customer balance
        updateCustomerBalance(invoice.customerId, -invoice.total);
        
        sales.splice(index, 1);
        APP_EGYPT_CORE.saveData('sales', sales);
        
        return { success: true, message: 'تم حذف الفاتورة' };
    }

    // ==================== Get Sales ====================
    function getAllSales(filters = {}) {
        let sales = APP_EGYPT_CORE.getData('sales');
        
        // Apply filters
        if (filters.customerId) {
            sales = sales.filter(inv => inv.customerId === filters.customerId);
        }
        
        if (filters.status) {
            sales = sales.filter(inv => inv.status === filters.status);
        }
        
        if (filters.dateFrom) {
            sales = sales.filter(inv => inv.date >= filters.dateFrom);
        }
        
        if (filters.dateTo) {
            sales = sales.filter(inv => inv.date <= filters.dateTo);
        }
        
        // Sort by date descending
        sales.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return sales;
    }

    function getSaleById(id) {
        const sales = APP_EGYPT_CORE.getData('sales');
        return sales.find(inv => inv.id === id);
    }

    // ==================== Statistics ====================
    function calculateTotalSales(filters = {}) {
        const sales = getAllSales(filters);
        return sales.reduce((sum, inv) => sum + inv.total, 0);
    }

    function calculateSalesStatistics(year = new Date().getFullYear()) {
        const sales = getAllSales().filter(inv => {
            const invYear = new Date(inv.date).getFullYear();
            return invYear === year;
        });
        
        const totalSales = sales.reduce((sum, inv) => sum + inv.total, 0);
        const totalVAT = sales.reduce((sum, inv) => sum + inv.vat, 0);
        const totalIncomeTax = sales.reduce((sum, inv) => sum + inv.incomeTax, 0);
        const paidInvoices = sales.filter(inv => inv.status === 'paid');
        const pendingInvoices = sales.filter(inv => inv.status === 'pending');
        
        return {
            year,
            totalInvoices: sales.length,
            totalSales,
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

    // ==================== Calculate Profit ====================
    function calculateInvoiceProfit(saleId) {
        const sale = getSaleById(saleId);
        if (!sale || !sale.linkedPurchase) {
            return null;
        }
        
        const purchase = APP_EGYPT_PURCHASES?.getPurchaseById(sale.linkedPurchase);
        if (!purchase) {
            return null;
        }
        
        const profit = sale.subtotal - purchase.subtotal;
        const profitMargin = (profit / sale.subtotal) * 100;
        
        return {
            saleId: sale.id,
            saleInvoice: sale.invoiceNumber,
            purchaseId: purchase.id,
            purchaseInvoice: purchase.invoiceNumber,
            saleAmount: sale.subtotal,
            purchaseAmount: purchase.subtotal,
            profit,
            profitMargin: Number(profitMargin.toFixed(2))
        };
    }

    // ==================== Update Customer Balance ====================
    function updateCustomerBalance(customerId, amount) {
        if (!window.APP_EGYPT_CUSTOMERS) return;
        
        const customers = APP_EGYPT_CORE.getData('customers');
        const customer = customers.find(c => c.id === customerId);
        
        if (customer) {
            customer.balance = (customer.balance || 0) + amount;
            APP_EGYPT_CORE.saveData('customers', customers);
        }
    }

    // ==================== Render Sales List ====================
    function renderSalesList(containerId = 'sales-list') {
        const sales = getAllSales();
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        if (sales.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="bi bi-receipt text-6xl text-gray-300"></i>
                    <p class="mt-4 text-gray-500">لا توجد فواتير مبيعات</p>
                </div>
            `;
            return;
        }
        
        const html = sales.map(invoice => `
            <tr>
                <td>${invoice.invoiceNumber}</td>
                <td>${invoice.customerName}</td>
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
                    <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_SALES.viewInvoice('${invoice.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-ghost" onclick="APP_EGYPT_SALES.printInvoice('${invoice.id}')">
                        <i class="bi bi-printer"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        container.innerHTML = html;
    }

    // ==================== Print Invoice ====================
    function printInvoice(id) {
        const invoice = getSaleById(id);
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
                <title>فاتورة مبيعات ${invoice.invoiceNumber}</title>
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
                        <h1>فاتورة مبيعات</h1>
                        <h2>${invoice.invoiceNumber}</h2>
                    </div>
                    <div class="details">
                        <p><strong>العميل:</strong> ${invoice.customerName}</p>
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
        createSaleInvoice,
        updateSaleInvoice,
        deleteSaleInvoice,
        getAllSales,
        getSaleById,
        calculateTotalSales,
        calculateSalesStatistics,
        calculateInvoiceProfit,
        renderSalesList,
        printInvoice,
        REAL_SALES_DATA
    };
})();

// Log when loaded
if (typeof window !== 'undefined') {
    console.log('🇪🇬 نظام المبيعات المصري جاهز');
}
