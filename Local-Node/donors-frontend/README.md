# Donors React App
## Environment Files

- **`.env`**:  
  - An example environment file provided for projects that are run _without_ Docker.  
  - Copy or rename this file to `.env` and then edit the required variables.

- **`local-nodes-env/local-node-donors-1.env` & `local-nodes-env/local-node-donors-2.env`**:  
  - These files contain environment variables for two separate local “nodes” when using a Docker-based setup.  
  - If you intend to run the project inside Docker containers, you should refer to these two files instead of the top-level `.env`.

---

## Required Environment Variables

Regardless of whether you run the project locally or with Docker, you must define the following variables:

1. **`VITE_KEYCLOAK_BASE_URL`**  
   - URL of your Keycloak server.

2. **`VITE_LOCAL_BACKEND_URL`**  
   - Base URL for your local backend API.

Both of these variables must be set to valid URLs before starting the application.

---
