import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../index.js';
import { initDb } from '../database.js';

describe('AuraSupply SDET Automated API Quality Gate', () => {
  let createdOrderId = null;

  before(async () => {
    // Ensure database tables exist before testing
    await initDb();
  });

  describe('1. Health & System Diagnostics', () => {
    it('GET /api/health should return 200 OK with online status and app name', async () => {
      const res = await request(app).get('/api/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.status, 'online');
      assert.ok(res.body.app.includes('AuraSupply'));
      assert.ok(res.body.version);
    });
  });

  describe('2. Order Fulfillment State Machine', () => {
    it('GET /api/orders should return list of orders with items', async () => {
      const res = await request(app).get('/api/orders');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
    });

    it('POST /api/orders should reject invalid order with 400 Bad Request if customer name is missing', async () => {
      const invalidPayload = {
        customer_email: 'test@example.com',
        items: []
      };
      const res = await request(app).post('/api/orders').send(invalidPayload);
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.ok(res.body.error.includes('required'));
    });

    it('POST /api/orders should successfully create an enterprise order with auto-generated ID & SST tax', async () => {
      const validPayload = {
        customer_name: 'PETRONAS Carigali Automated QA Test',
        customer_email: 'qa.test@petronas.com.my',
        priority: 'High',
        carrier: 'Line Clear Logistics',
        warehouse_id: 'WH-KUL-01',
        notes: 'Automated CI/CD Quality Gate Pipeline Order',
        items: [
          { sku: 'TOOL-TE70', item_name: 'Industrial Rotary Hammer TE-70', quantity: 2, unit_price: 1250 }
        ]
      };
      const res = await request(app).post('/api/orders').send(validPayload);
      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.id.startsWith('ORD-'));
      assert.equal(res.body.data.customer_name, 'PETRONAS Carigali Automated QA Test');
      assert.equal(res.body.data.total_amount, 2700); // 2500 + 8% SST = 2700
      createdOrderId = res.body.data.id;
    });

    it('PATCH /api/orders/:id/status should reject illegal state transition with 400 Bad Request', async () => {
      assert.ok(createdOrderId, 'Need created order ID');
      const res = await request(app)
        .patch(`/api/orders/${createdOrderId}/status`)
        .send({ status: 'INVALID_STATUS_TEST' });
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it('PATCH /api/orders/:id/status should successfully advance state to PO Approved', async () => {
      assert.ok(createdOrderId, 'Need created order ID');
      const res = await request(app)
        .patch(`/api/orders/${createdOrderId}/status`)
        .send({ status: 'PO Approved' });
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.status, 'PO Approved');
    });
  });

  describe('3. Inventory, Analytics & QA Engine', () => {
    it('GET /api/inventory should return warehouse stock items with valid SKUs', async () => {
      const res = await request(app).get('/api/inventory');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
    });

    it('GET /api/analytics/dashboard should return operational fulfillment KPIs', async () => {
      const res = await request(app).get('/api/analytics/dashboard');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.orders.total !== undefined);
      assert.ok(res.body.data.orders.otif_rate !== undefined);
    });

    it('GET /api/qa/runs should return historical test run logs', async () => {
      const res = await request(app).get('/api/qa/runs');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
    });

    it('POST /api/qa/execute should trigger an automated regression test run', async () => {
      const res = await request(app).post('/api/qa/execute').send({
        tenant_id: 'Tenant 01 - APAC (MY / SG Hub)',
        test_suite: 'Order-to-Cash (O2C) Full Lifecycle Regression'
      });
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.status, 'PASSED');
    });
  });
});
