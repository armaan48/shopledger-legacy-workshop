const test = require('node:test');
const assert = require('node:assert/strict');
const invoice = require('../lib/invoice');

function order(overrides) {
  return Object.assign({
    id: 1002,
    date: '05/01/2022',
    customer: 'Anil Kulkarni',
    coupon: 'SAVE10',
    total: 963.9,
    items: [
      { name: 'Indrayani Basmati Rice 5kg', sku: 'GRN-001', hsn: '1006', price: 640, qty: 1 },
      { name: 'Cold-Pressed Sunflower Oil 1L', sku: 'OIL-001', hsn: '1512', price: 190, qty: 2 }
    ]
  }, overrides);
}

test('invoice uses each line item HSN GST slab', () => {
  const figures = invoice.computeInvoiceFigures(order());
  assert.equal(figures.rows[0].gstPercent, 5);
  assert.equal(figures.rows[1].gstPercent, 5);
  assert.equal(figures.tax, 45.9);
});

test('SAVE10 is calculated from subtotal and respects its configured cap', () => {
  const figures = invoice.computeInvoiceFigures(order());
  assert.equal(figures.discount, 102);
  assert.equal(figures.total, 963.9);
});

test('invoice totals reconcile with an existing ledger order', () => {
  const figures = invoice.computeInvoiceFigures(order({
    coupon: '',
    total: 676.9,
    items: [
      { name: 'Assam CTC Masala Chai 250g', sku: 'BEV-001', hsn: '0902', price: 140, qty: 2 },
      { name: 'Unpolished Toor Dal 1kg', sku: 'GRN-002', hsn: '0713', price: 165, qty: 2 }
    ]
  }));
  assert.equal(figures.total, 676.9);
  assert.equal(figures.total, 676.9);
});

test('SAVE10 discount cap reconciles the high-value order', () => {
  const figures = invoice.computeInvoiceFigures(order({
    id: 1004,
    coupon: 'SAVE10',
    total: 2194.5,
    items: [{ name: 'Cold-Pressed Groundnut Oil 5L', sku: 'OIL-002', hsn: '1508', price: 1120, qty: 2 }]
  }));
  assert.equal(figures.discount, 150);
  assert.equal(figures.tax, 104.5);
  assert.equal(figures.total, 2194.5);
});
