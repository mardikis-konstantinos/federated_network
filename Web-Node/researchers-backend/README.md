# Web Node FastAPI 

## Environment Files

- **`.env`**:  
  - An example environment file provided for projects that are run _without_ Docker.  
  - Copy or rename this file to `.env` and then edit the required variables.

- **`web-nodes-env/web-node-researchers-backend.env`:  
  - This files contain environment variables the web “node” when using a Docker-based setup.  
  - If you intend to run the project inside Docker containers, you should refer to `.env`.

---

## Required Environment Variables

Regardless of whether you run the project locally or with Docker, you must define the following variables:

1. **`KEYCLOAK_SERVER`**  
   - URL of your Keycloak server.
2. **`CLIENT_SECRET`**
   - The client secret in the credentials tabs in the keycloak server-client in local-server (1 or 2 for Docker configure)
3. **`MONGO_URI`**
   - MongoDB url

All the other don't need to be changed.
