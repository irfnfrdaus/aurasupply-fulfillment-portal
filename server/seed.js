import { run, initDb, query } from './database.js';

const seedData = async () => {
  await initDb();

  // Clear existing data
  await run('DELETE FROM order_items');
  await run('DELETE FROM orders');
  await run('DELETE FROM inventory');
  await run('DELETE FROM qa_test_runs');

  console.log('Seeding AuraSupply enterprise data...');

  // 1. Seed Inventory
  const inventoryItems = [
    {
      sku: 'SKU-VLV-501',
      name: 'High-Pressure Cryogenic Control Valve 4"',
      category: 'Mechanical Valves',
      warehouse_id: 'WH-KUL-01',
      warehouse_name: 'Shah Alam Central DC',
      stock_on_hand: 48,
      stock_reserved: 12,
      min_threshold: 20,
      max_capacity: 150,
      unit_cost: 3200.0,
      unit_price: 4950.0,
      status: 'In Stock',
      last_restocked: '2026-10-15'
    },
    {
      sku: 'SKU-PMP-902',
      name: 'Multistage Centrifugal Boiler Feed Pump',
      category: 'Hydraulic Pumps',
      warehouse_id: 'WH-KUL-01',
      warehouse_name: 'Shah Alam Central DC',
      stock_on_hand: 8,
      stock_reserved: 6,
      min_threshold: 10,
      max_capacity: 40,
      unit_cost: 14500.0,
      unit_price: 22800.0,
      status: 'Low Stock Alert',
      last_restocked: '2026-09-28'
    },
    {
      sku: 'SKU-FLG-103',
      name: 'ANSI Class 900 Weld Neck Flange 8"',
      category: 'Industrial Flanges',
      warehouse_id: 'WH-PEN-02',
      warehouse_name: 'Penang North Hub',
      stock_on_hand: 140,
      stock_reserved: 25,
      min_threshold: 30,
      max_capacity: 300,
      unit_cost: 450.0,
      unit_price: 780.0,
      status: 'In Stock',
      last_restocked: '2026-10-10'
    },
    {
      sku: 'SKU-SEN-408',
      name: 'Industrial IoT 3-Axis Vibration Sensor Transmitter',
      category: 'IoT Telemetry Sensors',
      warehouse_id: 'WH-KUL-01',
      warehouse_name: 'Shah Alam Central DC',
      stock_on_hand: 15,
      stock_reserved: 14,
      min_threshold: 25,
      max_capacity: 100,
      unit_cost: 1100.0,
      unit_price: 1850.0,
      status: 'Critical Depletion',
      last_restocked: '2026-10-02'
    },
    {
      sku: 'SKU-GSK-204',
      name: 'Spiral Wound Graphite Core Gasket 6" Class 600',
      category: 'Safety Gaskets',
      warehouse_id: 'WH-JHB-03',
      warehouse_name: 'Pasir Gudang South DC',
      stock_on_hand: 280,
      stock_reserved: 40,
      min_threshold: 50,
      max_capacity: 500,
      unit_cost: 85.0,
      unit_price: 165.0,
      status: 'In Stock',
      last_restocked: '2026-10-18'
    },
    {
      sku: 'SKU-ACT-707',
      name: 'Pneumatic Rotary Quarter-Turn Actuator',
      category: 'Mechanical Valves',
      warehouse_id: 'WH-PEN-02',
      warehouse_name: 'Penang North Hub',
      stock_on_hand: 22,
      stock_reserved: 5,
      min_threshold: 15,
      max_capacity: 80,
      unit_cost: 2400.0,
      unit_price: 3850.0,
      status: 'In Stock',
      last_restocked: '2026-10-12'
    },
    {
      sku: 'SKU-TRN-305',
      name: 'HART Differential Pressure Transmitter',
      category: 'IoT Telemetry Sensors',
      warehouse_id: 'WH-KUL-01',
      warehouse_name: 'Shah Alam Central DC',
      stock_on_hand: 6,
      stock_reserved: 5,
      min_threshold: 12,
      max_capacity: 50,
      unit_cost: 3800.0,
      unit_price: 5600.0,
      status: 'Critical Depletion',
      last_restocked: '2026-09-14'
    }
  ];

  for (const item of inventoryItems) {
    await run(
      `INSERT INTO inventory (sku, name, category, warehouse_id, warehouse_name, stock_on_hand, stock_reserved, min_threshold, max_capacity, unit_cost, unit_price, status, last_restocked)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.sku, item.name, item.category, item.warehouse_id, item.warehouse_name,
        item.stock_on_hand, item.stock_reserved, item.min_threshold, item.max_capacity,
        item.unit_cost, item.unit_price, item.status, item.last_restocked
      ]
    );
  }

  // 2. Seed Orders & Order Items
  const orders = [
    {
      id: 'ORD-2026-001',
      customer_name: 'PETRONAS Carigali Sdn Bhd',
      customer_email: 'procurement@petronas.com.my',
      order_date: '2026-10-12',
      sla_delivery_date: '2026-10-24',
      status: 'In Transit',
      priority: 'Critical',
      carrier: 'DHL Express',
      tracking_number: 'DHL-MY-88392109',
      warehouse_id: 'WH-KUL-01',
      notes: 'Offshore platform maintenance batch for Dulang Field. Urgent flight dispatch required.',
      items: [
        { sku: 'SKU-VLV-501', name: 'High-Pressure Cryogenic Control Valve 4"', qty: 4, price: 4950.0 },
        { sku: 'SKU-SEN-408', name: 'Industrial IoT 3-Axis Vibration Sensor Transmitter', qty: 6, price: 1850.0 }
      ]
    },
    {
      id: 'ORD-2026-002',
      customer_name: 'Hilti Asia IT Services Sdn Bhd',
      customer_email: 'facilities.my@hilti.com',
      order_date: '2026-10-14',
      sla_delivery_date: '2026-10-28',
      status: 'Pick & Pack',
      priority: 'High',
      carrier: 'Line Clear Logistics',
      tracking_number: 'LCL-KUL-440219',
      warehouse_id: 'WH-KUL-01',
      notes: 'Testing rig equipment setup for automated IoT regression lab in PJ.',
      items: [
        { sku: 'SKU-SEN-408', name: 'Industrial IoT 3-Axis Vibration Sensor Transmitter', qty: 4, price: 1850.0 },
        { sku: 'SKU-TRN-305', name: 'HART Differential Pressure Transmitter', qty: 2, price: 5600.0 }
      ]
    },
    {
      id: 'ORD-2026-003',
      customer_name: 'Inari Amertron Berhad',
      customer_email: 'supplychain@inari-amertron.com',
      order_date: '2026-10-16',
      sla_delivery_date: '2026-10-29',
      status: 'PO Approved',
      priority: 'Standard',
      carrier: 'FedEx Global',
      tracking_number: 'FX-MY-9940122',
      warehouse_id: 'WH-PEN-02',
      notes: 'Semiconductor cleanroom piping expansion project. Scheduled delivery.',
      items: [
        { sku: 'SKU-FLG-103', name: 'ANSI Class 900 Weld Neck Flange 8"', qty: 15, price: 780.0 },
        { sku: 'SKU-GSK-204', name: 'Spiral Wound Graphite Core Gasket 6"', qty: 20, price: 165.0 }
      ]
    },
    {
      id: 'ORD-2026-004',
      customer_name: 'Sime Darby Industrial Sdn Bhd',
      customer_email: 'heavy.procure@simedarby.com',
      order_date: '2026-10-18',
      sla_delivery_date: '2026-11-02',
      status: 'Quote',
      priority: 'High',
      carrier: 'Direct Fleet',
      tracking_number: 'Pending Dispatch',
      warehouse_id: 'WH-KUL-01',
      notes: 'Heavy equipment replacement unit for port terminal boiler overhaul.',
      items: [
        { sku: 'SKU-PMP-902', name: 'Multistage Centrifugal Boiler Feed Pump', qty: 2, price: 22800.0 }
      ]
    },
    {
      id: 'ORD-2026-005',
      customer_name: 'Tenaga Nasional Berhad (TNB)',
      customer_email: 'powerstation.gen@tnb.com.my',
      order_date: '2026-10-05',
      sla_delivery_date: '2026-10-18',
      status: 'Delivered',
      priority: 'Critical',
      carrier: 'DHL Express',
      tracking_number: 'DHL-MY-77201944',
      warehouse_id: 'WH-JHB-03',
      notes: 'Janamanjung Power Plant scheduled turbine turnaround. Delivered on-time with zero defects.',
      items: [
        { sku: 'SKU-VLV-501', name: 'High-Pressure Cryogenic Control Valve 4"', qty: 2, price: 4950.0 },
        { sku: 'SKU-ACT-707', name: 'Pneumatic Rotary Quarter-Turn Actuator', qty: 2, price: 3850.0 },
        { sku: 'SKU-GSK-204', name: 'Spiral Wound Graphite Core Gasket 6"', qty: 10, price: 165.0 }
      ]
    },
    {
      id: 'ORD-2026-006',
      customer_name: 'Gamuda Engineering Sdn Bhd',
      customer_email: 'mrt.procure@gamuda.com.my',
      order_date: '2026-10-02',
      sla_delivery_date: '2026-10-15',
      status: 'Invoiced',
      priority: 'Standard',
      carrier: 'Direct Fleet',
      tracking_number: 'DF-MY-102934',
      warehouse_id: 'WH-PEN-02',
      notes: 'Tunnel boring machine hydraulic valve retrofitting. Invoiced and payment cleared via FPX.',
      items: [
        { sku: 'SKU-ACT-707', name: 'Pneumatic Rotary Quarter-Turn Actuator', qty: 3, price: 3850.0 },
        { sku: 'SKU-FLG-103', name: 'ANSI Class 900 Weld Neck Flange 8"', qty: 10, price: 780.0 }
      ]
    }
  ];

  for (const o of orders) {
    let subtotal = 0;
    for (const item of o.items) {
      subtotal += item.qty * item.price;
    }
    const tax = subtotal * 0.08; // 8% SST
    const total = subtotal + tax;
    const now = new Date().toISOString();

    await run(
      `INSERT INTO orders (id, customer_name, customer_email, order_date, sla_delivery_date, status, priority, carrier, tracking_number, warehouse_id, subtotal, tax_amount, total_amount, currency, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        o.id, o.customer_name, o.customer_email, o.order_date, o.sla_delivery_date,
        o.status, o.priority, o.carrier, o.tracking_number, o.warehouse_id,
        subtotal, tax, total, 'MYR', o.notes, now, now
      ]
    );

    for (const item of o.items) {
      await run(
        `INSERT INTO order_items (order_id, sku, item_name, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [o.id, item.sku, item.name, item.qty, item.price, item.qty * item.price]
      );
    }
  }

  // 3. Seed Sample QA Test Automation Runs (Hilti Inspired)
  const qaRuns = [
    {
      id: 'QA-RUN-8001',
      tenant_id: 'Tenant 01 - APAC (MY / SG)',
      test_suite: 'Order-to-Cash (O2C) Full Lifecycle Regression',
      status: 'PASSED',
      total_tests: 28,
      passed_tests: 28,
      failed_tests: 0,
      duration_ms: 1240,
      executed_by: 'Tosca Runner Bot (Simulated)',
      created_at: '2026-10-21 18:30:00',
      logs: JSON.stringify([
        { step: 1, name: 'Authenticate API token for Tenant 01', status: 'PASS', time_ms: 120 },
        { step: 2, name: 'Validate Quote Creation & Calculation', status: 'PASS', time_ms: 210 },
        { step: 3, name: 'Verify Inventory Reservation Lock', status: 'PASS', time_ms: 340 },
        { step: 4, name: 'Assert 8% SST Tax Compliance Formula', status: 'PASS', time_ms: 180 },
        { step: 5, name: 'Post-Upgrade Database Schema Integrity', status: 'PASS', time_ms: 390 }
      ])
    },
    {
      id: 'QA-RUN-8002',
      tenant_id: 'Tenant 02 - EMEA (DE / CH / UK)',
      test_suite: 'Multi-Tenant Cross-Currency & VAT Compliance',
      status: 'PASSED',
      total_tests: 24,
      passed_tests: 24,
      failed_tests: 0,
      duration_ms: 1450,
      executed_by: 'Tosca Runner Bot (Simulated)',
      created_at: '2026-10-21 20:15:00',
      logs: JSON.stringify([
        { step: 1, name: 'Initialize EMEA Tenant Environment', status: 'PASS', time_ms: 150 },
        { step: 2, name: 'Multi-Currency Conversion Rate Check (EUR/GBP)', status: 'PASS', time_ms: 290 },
        { step: 3, name: 'VAT Reverse Charge Mechanism Assertion', status: 'PASS', time_ms: 410 },
        { step: 4, name: 'SLA Lead Time Calculation Across Hubs', status: 'PASS', time_ms: 600 }
      ])
    }
  ];

  for (const qr of qaRuns) {
    await run(
      `INSERT INTO qa_test_runs (id, tenant_id, test_suite, status, total_tests, passed_tests, failed_tests, duration_ms, executed_by, logs, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [qr.id, qr.tenant_id, qr.test_suite, qr.status, qr.total_tests, qr.passed_tests, qr.failed_tests, qr.duration_ms, qr.executed_by, qr.logs, qr.created_at]
    );
  }

  console.log('✅ AuraSupply database successfully seeded!');
};

seedData().catch(console.error);
