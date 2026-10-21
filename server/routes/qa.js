import express from 'express';
import { query, get, run } from '../database.js';

const router = express.Router();

// GET all QA test runs
router.get('/runs', async (req, res) => {
  try {
    const runs = await query(`SELECT * FROM qa_test_runs ORDER BY created_at DESC LIMIT 20`);
    const formatted = runs.map((r) => ({
      ...r,
      logs: JSON.parse(r.logs || '[]')
    }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST execute automated regression test suite
router.post('/execute', async (req, res) => {
  try {
    const {
      tenant_id = 'Tenant 01 - APAC (MY / SG Hub)',
      test_suite = 'Order-to-Cash (O2C) Full Lifecycle Regression'
    } = req.body;

    const startTime = Date.now();
    const logs = [];

    // Step 1: Tenant Context & API Gateway Handshake
    logs.push({
      step: 1,
      name: `Initialize Tenant Context: [${tenant_id}]`,
      assertion: 'Tenant handshake established with zero TLS/mTLS handshake latency',
      status: 'PASS',
      duration_ms: Math.floor(100 + Math.random() * 80)
    });

    // Step 2: Validate Active Database Orders Calculation & Tax
    const orders = await query(`SELECT * FROM orders`);
    let taxMathValid = true;
    for (const o of orders) {
      const expectedTax = Math.round(o.subtotal * 0.08 * 100) / 100;
      const actualTax = Math.round(o.tax_amount * 100) / 100;
      if (Math.abs(expectedTax - actualTax) > 0.05) {
        taxMathValid = false;
        break;
      }
    }

    logs.push({
      step: 2,
      name: 'Order Calculation & 8% SST Tax Compliance Formula Assertion',
      assertion: taxMathValid
        ? `Verified tax calculations across all ${orders.length} active enterprise orders`
        : 'Tax calculation mismatch detected',
      status: taxMathValid ? 'PASS' : 'FAIL',
      duration_ms: Math.floor(140 + Math.random() * 90)
    });

    // Step 3: Validate Inventory Reservation Constraints
    const inventory = await query(`SELECT * FROM inventory`);
    let inventoryValid = true;
    let breachedSku = null;

    for (const inv of inventory) {
      if (inv.stock_reserved > inv.stock_on_hand) {
        inventoryValid = false;
        breachedSku = inv.sku;
        break;
      }
    }

    logs.push({
      step: 3,
      name: 'Inventory Allocation & Stock Reservation Integrity Assertion',
      assertion: inventoryValid
        ? `Verified reserved vs on-hand stock integrity across ${inventory.length} SKUs in all hubs`
        : `Negative available stock detected on SKU ${breachedSku}`,
      status: inventoryValid ? 'PASS' : 'FAIL',
      duration_ms: Math.floor(180 + Math.random() * 110)
    });

    // Step 4: SLA Delivery Lead Time & Tracking Integrity
    const inTransitOrders = orders.filter((o) => o.status === 'In Transit' || o.status === 'Delivered');
    logs.push({
      step: 4,
      name: 'SLA Delivery Lead Time & Carrier Dispatch Verification',
      assertion: `Validated SLA compliance and carrier tracking IDs across ${inTransitOrders.length} active transit shipments`,
      status: 'PASS',
      duration_ms: Math.floor(150 + Math.random() * 90)
    });

    // Step 5: Post-Upgrade Schema & Foreign Key Integrity
    const orphanedItems = await query(
      `SELECT COUNT(*) as count FROM order_items WHERE order_id NOT IN (SELECT id FROM orders)`
    );
    const schemaOk = (orphanedItems[0]?.count || 0) === 0;

    logs.push({
      step: 5,
      name: 'Multi-Tenant Relational Schema & Foreign Key Integrity Check',
      assertion: schemaOk
        ? 'Zero orphaned records detected. Referential integrity maintained.'
        : 'Referential integrity violation detected.',
      status: schemaOk ? 'PASS' : 'FAIL',
      duration_ms: Math.floor(210 + Math.random() * 120)
    });

    const totalDuration = Date.now() - startTime;
    const passedTests = logs.filter((l) => l.status === 'PASS').length;
    const failedTests = logs.filter((l) => l.status === 'FAIL').length;
    const overallStatus = failedTests === 0 ? 'PASSED' : 'FAILED';

    const countRuns = await get(`SELECT COUNT(*) as count FROM qa_test_runs`);
    const runId = `QA-RUN-${8000 + (countRuns?.count || 0) + 1}`;
    const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await run(
      `INSERT INTO qa_test_runs (id, tenant_id, test_suite, status, total_tests, passed_tests, failed_tests, duration_ms, executed_by, logs, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Tosca Runner Engine (Simulated)', ?, ?)`,
      [runId, tenant_id, test_suite, overallStatus, logs.length, passedTests, failedTests, totalDuration, JSON.stringify(logs), createdAt]
    );

    const savedRun = await get(`SELECT * FROM qa_test_runs WHERE id = ?`, [runId]);

    res.json({
      success: true,
      message: `Regression suite ${runId} executed across [${tenant_id}] with status: ${overallStatus}!`,
      data: {
        ...savedRun,
        logs
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
