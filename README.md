# 📦 AuraSupply — Enterprise Supply Chain Fulfillment Portal & QA Automation Engine

[![CI/CD Quality Gate](https://github.com/irfnfrdaus/aurasupply-fulfillment-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/irfnfrdaus/aurasupply-fulfillment-portal/actions)
[![Docker](https://img.shields.io/badge/Docker-Compose%20Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![SDET Quality Gate](https://img.shields.io/badge/SDET-100%25%20Automated%20QA-8B5CF6)](https://github.com/irfnfrdaus/aurasupply-fulfillment-portal)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v20-339933?logo=node.js)](https://nodejs.org/)
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

## 🐳 DevOps & SDET CI/CD Pipeline

AuraSupply is architected with modern cloud-native DevOps principles and automated quality gates:

```mermaid
flowchart LR
    A["💻 Irfan pushes code"] --> B["⚙️ GitHub Actions (Ubuntu VM)"]
    B --> C["📦 Cache & Install Deps (Node 20)"]
    C --> D["🧪 Automated SDET Tests (10/10 Passing)"]
    D --> E["🏗️ Verify React / Vite Production Build"]
    E --> F["🐳 Docker Multi-Stage Buildx Validation"]
    F --> G["🚀 Certified Production Docker Containers"]
```

### 1. 🧪 Automated SDET API Quality Gate
Execute the comprehensive automated test suite verifying lifecycle state machines, SST calculations, and negative test cases:
```bash
cd server
npm test
```
* **10/10 Tests Passed in <1.2 seconds:**
  - `GET /api/health` — System health check & online status
  - `GET /api/orders` — Enterprise order list retrieval with line item mapping
  - `POST /api/orders (Negative)` — Rejects missing fields with 400 Bad Request
  - `POST /api/orders (Positive)` — Auto-generates `ORD-2026-xxx` with 8% SST calculation
  - `PATCH /api/orders/:id/status (Negative)` — Blocks illegal state transitions with 400 Bad Request
  - `PATCH /api/orders/:id/status (Positive)` — Advances state to `PO Approved`
  - `GET /api/inventory` — Verifies warehouse SKUs & stock depletion
  - `GET /api/analytics/dashboard` — Validates OTIF fulfillment metrics
  - `GET /api/qa/runs` & `POST /api/qa/execute` — Regression runner execution

### 2. 🐳 1-Click Multi-Container Deployment (Docker Compose)
Spin up the entire enterprise architecture (Express API + Nginx Static Server + SQLite) with a single command:
```bash
docker compose up --build
```
* **`aurasupply-server`**: Express REST API on Alpine Linux with built-in health check probes.
* **`aurasupply-client`**: Multi-stage production build served via **Nginx Reverse Proxy** on port 80/5173.

---

## 📁 Repository Structure

```
aurasupply-fulfillment-portal/
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions CI/CD Quality Gate Pipeline
├── client/                             # Frontend (React 18, Tailwind CSS, Vite)
│   ├── src/                            # Components, state & UI views
│   ├── nginx.conf                      # High-performance Nginx Reverse Proxy config
│   ├── Dockerfile                      # Multi-stage production container build
│   └── vite.config.js
├── server/                             # Backend REST API & QA Engine
│   ├── routes/                         # Orders, inventory, QA & analytics
│   ├── test/
│   │   └── api.test.js                 # SDET Automated API Quality Gate test suite
│   ├── database.js                     # SQLite connector & schema
│   ├── seed.js                         # Enterprise sample data seeder
│   ├── Dockerfile                      # Node 20 Alpine Linux production image
│   └── index.js                        # Unified API server (:5050)
├── docker-compose.yml                  # Multi-container orchestration & networking
├── run_aurasupply.bat                  # 1-Click Windows launcher
├── Stop_AuraSupply.bat                 # 1-Click Windows shutdown
├── LICENSE                             # MIT License
└── README.md
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

**Developed with ❤️ by [Muhammad Irfan Firdaus](https://github.com/irfnfrdaus)**  
*UTP Big Data Analytics | Minor in Financial Management | Ex-IT QA Automation Intern at Hilti Asia IT Services*
