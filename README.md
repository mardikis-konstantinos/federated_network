# Federated Blood-Donation Platform

> **Experimental platform** for peer-to-peer (federated) collection and anonymised sharing of blood-donation data.
> It consists of multiple (two) **Local Nodes** (hospital instances) and a central **Web Node**, with a complete front-end ↔ back-end flow, Keycloak-based authentication, and sample datasets for reproducibility.

---

## Repository Layout

| Path | Description |
|------|-------------|
| **Keycloak-configs/** | Pre-configured realms, clients and roles for Keycloak |
| **Local-Node/** | Code that runs on every hospital site |
| &nbsp;&nbsp;├─ **donors-frontend/** | React application where donors register |
| &nbsp;&nbsp;├─ **local-node-backend/** | FastAPI REST API exposed by the local node |
| &nbsp;&nbsp;├─ **medical-staff-frontend/** | React dashboard for medical staff |
| &nbsp;&nbsp;└─ **queries/** | Parameterised SQL queries & canned reports |
| **Web-Node/** | Central web node |
| &nbsp;&nbsp;├─ **researchers-backend/** | FastAPI API for researchers |
| &nbsp;&nbsp;├─ **researchers-frontend/** | React analytics dashboard |
| &nbsp;&nbsp;└─ **datasets/** | Sample anonymised CSV datasets |
| **local-nodes-env/** | Docker Compose configuration for local nodes |
| **web-node-env/** | Docker Compose configuration for the web node |
| **docker-compose.yml** | One-shot compose file that spins up Keycloak + all nodes |
| **README.md** | This document |

---

## Quick Start (Docker-first)

```bash
# 1. Clone the repository
git clone https://github.com/mardikis-konstantinos/federated_network.git
cd federated_network

# 2. Spin up the full stack (Keycloak + nodes + front-ends)
docker compose up -d --build

# 3. Access points
#   - Keycloak:                             http://localhost:8080
#   - Donors UI (local node 1):             http://localhost:3001
#   - Donors UI (local node 2):             http://localhost:3005
#   - Medical staff UI (local node 1):      http://localhost:3004
#   - Medical staff UI (local node 2):      http://localhost:3006
#   - Researchers dashboard:                http://localhost:3007
```
---

## Environment Files

| Folder | File | Purpose |
|--------|------|---------|
| `local-nodes-env/` | `.env` | Local node settings (DB URI, Keycloak realm, etc.) |
| `web-node-env/` | `.env` | Web node settings |

Copy the corresponding `.env.example`, tweak credentials/ports and rename to `.env`.

---

## Running Without Containers  

### Front-end (React)

```bash
cd donors-frontend   # or any other frontend folder
npm install          # install dependencies
npm run dev          # starts Vite / CRA dev server
```

### Back-end (FastAPI)

```bash
cd local-node-backend   # or any other backend folder
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port <PORT>
```

> Both servers expect the same environment variables defined in the corresponding `.env` files.

---
