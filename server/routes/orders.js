import express from 'express';
import { query, get, run } from '../database.js';

const router = express.Router();

// GET all orders with their items
router.get('/', async (req, res) => {
  try {
    const orders = await query(`SELECT * FROM orders ORDER BY order_date DESC`);
    const items = await query(`SELECT * FROM order_items`);

    const ordersWithItems = orders.map((order) => {
      const orderItems = items.filter((item) => item.order_id === order.id);
      return {
        ...order,
        items: orderItems
      };
    });

    res.json({ success: true, data: ordersWithItems });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await get(`SELECT * FROM orders WHERE id = ?`, [req.params.id]);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    const items = await query(`SELECT * FROM order_items WHERE order_id = ?`, [req.params.id]);
    res.json({ success: true, data: { ...order, items } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create new order
router.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      priority = 'Standard',
      carrier = 'Line Clear Logistics',
      warehouse_id = 'WH-KUL-01',
      notes = '',
      items = []
    } = req.body;

    if (!customer_name || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Customer name and at least one line item required' });
    }

    // Auto-generate order ID
    const countRow = await get(`SELECT COUNT(*) as count FROM orders`);
    const nextNum = (countRow?.count || 0) + 1;
    const orderId = `ORD-2026-${String(nextNum).padStart(3, '0')}`;

    // Calculate dates & amounts
    const orderDate = new Date().toISOString().split('T')[0];
    const slaDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const now = new Date().toISOString();

    let subtotal = 0;
    for (const item of items) {
      subtotal += (item.quantity || 1) * (item.unit_price || 0);
    }
    const taxAmount = subtotal * 0.08; // 8% SST
    const totalAmount = subtotal + taxAmount;
    const trackingNumber = `TRK-${orderId.replace('ORD-', '')}-${Math.floor(100000 + Math.random() * 900000)}`;

    await run(
      `INSERT INTO orders (id, customer_name, customer_email, order_date, sla_delivery_date, status, priority, carrier, tracking_number, warehouse_id, subtotal, tax_amount, total_amount, currency, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'Quote', ?, ?, ?, ?, ?, ?, ?, 'MYR', ?, ?, ?)`,
      [
        orderId, customer_name, customer_email, orderDate, slaDate,
        priority, carrier, trackingNumber, warehouse_id,
        subtotal, taxAmount, totalAmount, notes, now, now
      ]
    );

    for (const item of items) {
      await run(
        `INSERT INTO order_items (order_id, sku, item_name, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.sku, item.item_name, item.quantity, item.unit_price, item.quantity * item.unit_price]
      );
    }

    const createdOrder = await get(`SELECT * FROM orders WHERE id = ?`, [orderId]);
    const createdItems = await query(`SELECT * FROM order_items WHERE order_id = ?`, [orderId]);

    res.status(201).json({
      success: true,
      message: `Order ${orderId} created successfully!`,
      data: { ...createdOrder, items: createdItems }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH transition order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Quote', 'PO Approved', 'Pick & Pack', 'In Transit', 'Delivered', 'Invoiced'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Valid: ${validStatuses.join(', ')}` });
    }

    const now = new Date().toISOString();
    await run(`UPDATE orders SET status = ?, updated_at = ? WHERE id = ?`, [status, now, req.params.id]);

    const updated = await get(`SELECT * FROM orders WHERE id = ?`, [req.params.id]);
    res.json({
      success: true,
      message: `Order ${req.params.id} updated to status '${status}'`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    await run(`DELETE FROM order_items WHERE order_id = ?`, [req.params.id]);
    await run(`DELETE FROM orders WHERE id = ?`, [req.params.id]);
    res.json({ success: true, message: `Order ${req.params.id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
