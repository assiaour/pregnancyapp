# Pregnancy App API (MongoDB + Express)

Backend for the pregnancy app. Connects to MongoDB and can be deployed on **Render**.

## Local setup

1. **MongoDB**
   - Install [MongoDB](https://www.mongodb.com/try/download/community) locally, or
   - Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier) and copy the connection string.

2. **Env**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env: set MONGODB_URI (e.g. mongodb+srv://user:pass@cluster.mongodb.net/pregnancy-app)
   ```

3. **Install & run**
   ```bash
   npm install
   npm start
   ```
   Server runs at `http://localhost:3000`. Use `GET /health` to check MongoDB connection.

## Deploy on Render

### Option A: Connect this repo to Render

1. Push this project to GitHub/GitLab and connect the repo in [Render](https://render.com).
2. Create a **Web Service**.
3. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Add variable `MONGODB_URI` with your MongoDB connection string (e.g. from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

4. Deploy. Your API will be at `https://<your-service>.onrender.com`.

### Option B: Use the Blueprint (render.yaml)

1. In Render Dashboard: **New** → **Blueprint**.
2. Connect the same repo; Render will use the repo’s `render.yaml`.
3. In the Blueprint, set **MONGODB_URI** in the service’s Environment (required).
4. Deploy.

### MongoDB on Render

- You can use **MongoDB Atlas** (free tier) and set `MONGODB_URI` in Render.
- Or add a **MongoDB** instance from Render’s dashboard and use the URI it provides as `MONGODB_URI`.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health + MongoDB status |
| POST | `/api/accounts` | Create account (body = all form fields) |
| GET | `/api/accounts/:email` | Get account by email |

## Connect the Expo app

In the app, set your API base URL (e.g. `https://pregnancy-app-api.onrender.com`) and send `POST /api/accounts` with the account payload when the user finishes the signup flow.
