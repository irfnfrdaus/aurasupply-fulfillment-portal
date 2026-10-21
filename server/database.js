import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to AuraSupply SQLite database at:', dbPath);
  }
});

// Wrap db methods in Promises for async/await
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const initDb = async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      order_date TEXT NOT NULL,
      sla_delivery_date TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      carrier TEXT,
      tracking_number TEXT,
      warehouse_id TEXT,
      subtotal REAL NOT NULL,
      tax_amount REAL NOT NULL,
      total_amount REAL NOT NULL,
      currency TEXT DEFAULT 'MYR',
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      sku TEXT NOT NULL,
      item_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS inventory (
      sku TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      warehouse_id TEXT NOT NULL,
      warehouse_name TEXT NOT NULL,
      stock_on_hand INTEGER NOT NULL,
      stock_reserved INTEGER NOT NULL,
      min_threshold INTEGER NOT NULL,
      max_capacity INTEGER NOT NULL,
      unit_cost REAL NOT NULL,
      unit_price REAL NOT NULL,
      status TEXT NOT NULL,
      last_restocked TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS qa_test_runs (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      test_suite TEXT NOT NULL,
      status TEXT NOT NULL,
      total_tests INTEGER NOT NULL,
      passed_tests INTEGER NOT NULL,
      failed_tests INTEGER NOT NULL,
      duration_ms INTEGER NOT NULL,
      executed_by TEXT NOT NULL,
      logs TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  console.log('Database tables verified and ready.');
};

export default db;
