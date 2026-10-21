import express from 'express';
import { query, get, run } from '../database.js';

const router = express.Router();

// GET all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await query(`SELECT * FROM inventory ORDER BY stock_on_hand ASC`);
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST restock low stock SKU
router.post('/restock', async (req, res) => {
  try {
    const { sku, quantity = 50 } = req.body;
    const item = await get(`SELECT * FROM inventory WHERE sku = ?`, [sku]);
    if (!item) {
      return res.status(404).json({ success: false, error: 'SKU not found' });
    }

    const newStock = item.stock_on_hand + quantity;
    let newStatus = 'In Stock';
    if (newStock < item.min_threshold) {
      newStatus = 'Critical Depletion';
    } else if (newStock <= item.min_threshold * 1.5) {
      newStatus = 'Low Stock Alert';
    }

    const today = new Date().toISOString().split('T')[0];
    await run(
      `UPDATE inventory SET stock_on_hand = ?, status = ?, last_restocked = ? WHERE sku = ?`,
      [newStock, newStatus, today, sku]
    );

    const updated = await get(`SELECT * FROM inventory WHERE sku = ?`, [sku]);
    res.json({
      success: true,
      message: `Restocked ${quantity} units for ${item.name} (${sku})!`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add new SKU
router.post('/', async (req, res) => {
  try {
    const {
      sku,
      name,
      category,
      warehouse_id = 'WH-KUL-01',
      warehouse_name = 'Shah Alam Central DC',
      stock_on_hand = 10,
      min_threshold = 15,
      max_capacity = 100,
      unit_cost = 100,
      unit_price = 180
    } = req.body;

    if (!sku || !name || !category) {
      return res.status(400).json({ success: false, error: 'SKU, name, and category are required' });
    }

    let status = 'In Stock';
    if (stock_on_hand < min_threshold) status = 'Critical Depletion';
    else if (stock_on_hand <= min_threshold * 1.5) status = 'Low Stock Alert';

    const today = new Date().toISOString().split('T')[0];
    await run(
      `INSERT INTO inventory (sku, name, category, warehouse_id, warehouse_name, stock_on_hand, stock_reserved, min_threshold, max_capacity, unit_cost, unit_price, status, last_restocked)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?)`,
      [sku, name, category, warehouse_id, warehouse_name, stock_on_hand, min_threshold, max_capacity, unit_cost, unit_price, status, today]
    );

    const created = await get(`SELECT * FROM inventory WHERE sku = ?`, [sku]);
    res.status(201).json({
      success: true,
      message: `SKU ${sku} added to inventory!`,
      data: created
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
