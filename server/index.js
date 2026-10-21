import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './database.js';

import ordersRouter from './routes/orders.js';
import inventoryRouter from './routes/inventory.js';
import qaRouter from './routes/qa.js';
import analyticsRouter from './routes/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', ordersRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/qa', qaRouter);
app.use('/api/analytics', analyticsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'AuraSupply Enterprise Fulfillment & QA Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build if available
const clientDist = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDist));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) {
      res.status(200).send(`
        <html>
          <body style="font-family: sans-serif; background: #0B1120; color: #F8FAFC; padding: 40px; text-align: center;">
            <h1 style="color: #38BDF8;">AuraSupply API Gateway Online 🚀</h1>
            <p style="color: #94A3B8;">Backend running on port ${PORT}. Client Vite dev server is on port 5173.</p>
            <p><a href="/api/health" style="color: #34D399;">View API Health</a> | <a href="/api/orders" style="color: #60A5FA;">View Orders API</a></p>
          </body>
        </html>
      `);
    }
  });
});

// Initialize database and start listening
initDb().then(() => {
  app.listen(PORT, () => {
    console.log('='.repeat(65));
    console.log(`   🚀 AuraSupply Server & QA Engine is running on port ${PORT}`);
    console.log(`   🔗 API Gateway:   http://localhost:${PORT}/api/health`);
    console.log(`   📊 Orders API:    http://localhost:${PORT}/api/orders`);
    console.log(`   🧪 QA Runner API: http://localhost:${PORT}/api/qa/runs`);
    console.log('='.repeat(65));
  });
});
