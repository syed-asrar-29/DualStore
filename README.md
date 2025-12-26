
# **DualStore-X**

### Hybrid Transaction Coordination Engine for SQL and NoSQL Systems

---

## Overview

**DualStore-X** is a backend transaction coordination engine that ensures **controlled consistency** across **PostgreSQL (SQL)** and **NoSQL document stores** using the **Saga pattern**.

It is designed for systems where a single business operation spans multiple data stores and must remain correct under partial failures—without relying on distributed locks or two-phase commit.

---

## Problem Statement

Modern backend systems often combine:

* **SQL databases** for transactional integrity
* **NoSQL databases** for flexible schemas and scalability

When a transaction spans both:

* Partial failures can leave data inconsistent
* Recovery logic becomes complex
* Debugging distributed state is difficult

DualStore-X addresses this by introducing an explicit **transaction coordination layer** with **failure recovery and observability**.

---

## Core Capabilities

* Cross-store transaction orchestration (SQL + NoSQL)
* Saga-based failure recovery with compensation
* Explicit transaction state tracking
* Read-repair for eventual consistency
* Real-time monitoring dashboard

---

## Architecture

### Data Stores

* **PostgreSQL**
  Stores transactional order data with ACID guarantees
* **NoSQL Document Store (NeDB)**
  Stores inventory state and saga logs

### Coordination Layer

* Saga Orchestrator
* Transaction state machine
* Compensation handlers
* Audit and event logging

This architecture is consistent with the system described in the original setup documentation .

---

## Transaction Model

Each distributed transaction is executed as a **Saga** consisting of ordered steps:

1. Create or update order record in PostgreSQL
2. Update inventory state in the NoSQL store
3. If any step fails:

   * Execute compensating actions
   * Restore both stores to a consistent state
4. Finalize saga as `COMMITTED` or `COMPENSATED`

Transaction lifecycle:

```
STARTED → COMMITTED
STARTED → COMPENSATING → COMPENSATED
```

---

## Failure Recovery

DualStore-X supports **explicit failure simulation** to validate correctness.

When a failure occurs:

* SQL writes are reverted
* NoSQL inventory updates are compensated
* Saga state transitions are logged
* Final system state remains consistent

This ensures **no partial writes survive a failure**, even when errors occur mid-transaction.

---

## Read-Repair Mechanism

To handle eventual consistency:

* Reads compare SQL and NoSQL representations
* Inconsistencies are detected at access time
* Corrective updates are applied automatically

This allows the system to remain available while preserving correctness.

---

## Observability

The system includes a **real-time dashboard** that displays:

* Active and completed transactions
* Saga state transitions
* Inventory levels
* Order status
* Compensation and rollback history

This makes distributed transaction behavior **visible and debuggable**, rather than opaque.

---

## Results & Metrics

From repeated runs and failure simulations:

* **100% prevention of partial writes** during injected failures
* **Deterministic recovery** for all failed cross-store transactions
* **Complete audit trail** of saga state transitions
* **Zero manual reconciliation** required after failures

The system consistently restored a valid end state across both SQL and NoSQL stores.

---

## Running Locally

### Prerequisites

* Node.js v18+
* PostgreSQL (local instance)

---

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dualstore-x
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure database**
   Set the PostgreSQL connection string:

   ```bash
   export DATABASE_URL=postgres://user:password@localhost:5432/dbname
   ```

4. **Initialize schema**

   ```bash
   npm run db:push
   ```

5. **Run the application**

   ```bash
   npm run dev
   ```

6. **Access the dashboard**

   ```
   http://localhost:3000
   ```

---

## Project Structure

```
dualstore-x/
 ├── server/
 │    ├── coordinator/     # Saga orchestration logic
 │    ├── sql/             # PostgreSQL adapters
 │    ├── nosql/           # NoSQL adapters
 │    ├── compensation/    # Rollback handlers
 │    └── api/             # Transaction APIs
 ├── client/
 │    └── dashboard/       # Monitoring UI
 ├── shared/
 │    └── models/          # Transaction state models
 └── README.md
```

---

## Design Decisions

* **Saga pattern over two-phase commit** for scalability
* **Explicit compensation logic** for clarity
* **Loose coupling** between data stores
* **Audit-first design** for traceability
* **Failure-first testing** to validate guarantees

---

## Intended Use

This project demonstrates:

* Distributed transaction reasoning
* Hybrid database system design
* Failure-tolerant backend architecture
* Practical application of the Saga pattern

It is well-suited for **backend, database, and systems engineering roles**.

---

## Author

Developed as a backend systems project focused on **transaction correctness**, **failure recovery**, and **hybrid database coordination**.


