# 📦 AuraSupply — Enterprise Supply Chain Fulfillment Portal & QA Automation Engine

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v24-339933?logo=node.js)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Embedded-003B57?logo=sqlite)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**AuraSupply** is an enterprise-grade B2B Supply Chain & Order Fulfillment platform featuring an integrated **Multi-Tenant QA Test Automation & Compliance Engine**.

Directly inspired by 8 months of enterprise quality assurance at **Hilti Asia IT Services** across 30 enterprise cloud tenants (**SAP S/4HANA & SAP Business ByDesign**), AuraSupply simulates real-time Order-to-Cash (O2C) lifecycles, warehouse threshold alarms, and automated regression test execution with verifiable cycle-time reduction metrics.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph UI ["Client Dashboard (React 18 + Tailwind CSS)"]
        A["Kanban Fulfillment Lifecycle"]
        B["Warehouse Inventory & Reorder Alarms"]
        C["Multi-Tenant QA Test Automation Runner"]
        D["Executive Analytics & OTIF Cockpit"]
    end

    subgraph API ["REST API Gateway (Node.js / Express :5050)"]
        E["/api/orders (O2C Transitions & Tax Math)"]
        F["/api/inventory (Thresholds & Auto-PO)"]
        G["/api/qa (Regression Runner & Assertions)"]
        H["/api/analytics (OTIF & Cycle-Time Metrics)"]
    end

    subgraph DB ["Data & Storage Layer"]
        I[("SQLite Embedded Database")]
    end

    UI --> API
    API --> DB
```

---

## ✨ Key Enterprise Capabilities

### 1. 🔄 Multi-Stage Order Fulfillment Lifecycle (Kanban & Table)
* **Realistic enterprise progression:**
  ```text
  [Quote Draft] ➔ [PO Approved] ➔ [Pick & Pack] ➔ [In Transit] ➔ [Delivered] ➔ [Invoiced & Paid]
  ```
* Real-time calculation of Malaysian **8% SST compliance tax** on all enterprise line items.
* Live tracking number generation and carrier allocation (`DHL Express`, `FedEx Global`, `Line Clear Logistics`, `Direct Fleet`).
* Support for high-priority corporate accounts (PETRONAS, Inari Amertron, TNB, Gamuda, Hilti).

### 2. 🏭 Warehouse & Inventory Reorder Threshold Engine
* Multi-warehouse allocation across Malaysian industrial hubs:
  * **WH-KUL-01:** Shah Alam Central Distribution Center
  * **WH-PEN-02:** Penang North High-Tech Hub
  * **WH-JHB-03:** Pasir Gudang South DC
* Dynamic visual threshold indicators: `In Stock`, `Low Stock Alert`, and `Critical Depletion`.
* **1-Click Auto-Requisition PO Generation** (`+50 Units Restock`) to prevent supply chain stockouts.

### 3. 🧪 ⭐ The Showstopper: Multi-Tenant QA Test Automation Runner
Modeled after enterprise post-upgrade regression testing at **Hilti Asia IT Services**:
* **Target Tenant Selection:** Partition tests across `Tenant 01 - APAC`, `Tenant 02 - EMEA`, and `Tenant 03 - AMER`.
* **Automated Regression Assertions:**
  * ✅ Tax formula accuracy across active orders.
  * ✅ Inventory allocation and stock reservation integrity.
  * ✅ SLA lead-time and carrier route validation.
  * ✅ Relational foreign key and schema drift detection.
* **Quantifiable Efficiency:** Demonstrates automated test execution in **< 1.4 seconds** compared to manual ~10 minutes per tenant (**>78% cycle-time reduction**).

### 4. 📊 Executive Analytics & SLA Compliance Cockpit
* **OTIF (On-Time In-Full)** compliance tracking (96.8% benchmark).
* Revenue pipeline vs. fulfilled/invoiced cash flows.
* Stage-by-stage order distribution analytics.

---

## 🚀 Quick Start (60 Seconds)

### Prerequisites
* **Node.js** (v18 or higher) — [nodejs.org](https://nodejs.org/)

### Windows (1-Click Launch)
Double-click **`run_aurasupply.bat`**.  
The script automatically:
1. Initializes and seeds the SQLite database.
2. Starts the server on port `5050`.
3. Opens your default web browser to `http://localhost:5050`.

To stop the server anytime, double-click **`Stop_AuraSupply.bat`**.

---

### Manual Setup (macOS / Linux / Windows)

```bash
# 1. Clone repository
git clone https://github.com/irfnfrdaus/aurasupply-fulfillment-portal.git
cd aurasupply-fulfillment-portal

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Seed database
cd ../server
node seed.js

# 4. Build frontend
cd ../client
npm run build

# 5. Start unified application
cd ../server
node index.js
```

Open **`http://localhost:5050`** in your browser.

---

## 📁 Repository Structure

```
aurasupply-fulfillment-portal/
├── client/                     # Frontend (React 18, Tailwind CSS, Lucide, Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Brand & tenant indicator
│   │   │   ├── StatsOverview.jsx       # Metric cards & OTIF
│   │   │   ├── OrderKanban.jsx         # 6-Stage Kanban & enterprise table
│   │   │   ├── InventoryTable.jsx      # Stock levels & 1-click PO restock
│   │   │   ├── QaAutomationRunner.jsx  # Multi-tenant test runner & terminal
│   │   │   ├── AnalyticsView.jsx       # Charts & cycle time savings
│   │   │   ├── NewOrderModal.jsx       # Order creation dialog
│   │   │   └── OrderDetailsModal.jsx   # Line items & tax breakdown
│   │   ├── services/api.js             # REST API service client
│   │   ├── App.jsx                     # Root application coordinator
│   │   └── index.css                   # Tailwind styles
│   └── vite.config.js
├── server/                     # Backend REST API & Database
│   ├── routes/
│   │   ├── orders.js                   # Order lifecycle & SST calculations
│   │   ├── inventory.js                # Inventory thresholds & restock
│   │   ├── qa.js                       # Test automation engine & assertions
│   │   └── analytics.js                # Executive KPI calculations
│   ├── database.js                     # SQLite connector & schema
│   ├── seed.js                         # Enterprise sample data seeder
│   └── index.js                        # Unified production server (:5050)
├── run_aurasupply.bat          # 1-Click Windows launcher
├── Stop_AuraSupply.bat         # 1-Click Windows shutdown
├── LICENSE                     # MIT License
└── README.md
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

**Developed with ❤️ by [Muhammad Irfan Firdaus](https://github.com/irfnfrdaus)**  
*UTP Big Data Analytics | Minor in Financial Management | Ex-IT QA Automation Intern at Hilti Asia IT Services*
