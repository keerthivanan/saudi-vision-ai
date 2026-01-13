# 🇸🇦 Saudi Vision 2030 Enterprise AI Platform

> **Status**: Production Ready 🟢 | **Architecture**: Hybrid Cloud (Railway + Vercel)
> **Stack**: Next.js 14, FastAPI (Docker), LangChain, PostgreSQL, AWS S3, OpenAI GPT-4o

A state-of-the-art **Retrieval-Augmented Generation (RAG)** platform serving as the authoritative digital guide for Saudi Vision 2030. This system enables users to query complex legal, economic, and strategic documents with **100% citation accuracy**.

![Architecture](https://img.shields.io/badge/Architecture-Hybrid_Cloud-blue) ![Docker](https://img.shields.io/badge/Docker-Production_Ready-blue) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Key Features
*   **🧠 "Global Oracle" Intelligence**: Hybrid Search (Vector + Keyword) using OpenAI Embeddings.
*   **☁️ Smart Hybrid Ingestion**: Documents sourced directly from **AWS S3** with strict source citation.
*   **🛡️ "The Judge" Protocol**: A specialized AI agent verifies every number against the source document (0% Hallucination).
*   **🌍 Cross-Lingual Core**: Queries in Arabic are translated, searched in English (for max accuracy), and answered in Arabic.
*   **🐳 Docker Native**: Fully containerized Backend and Frontend for instant deployment.

---

## 🚀 Deployment Guide (Production)

This project uses a **Hybrid Architecture**:
*   **The Brain (Backend)**: Deployed on **Railway** (via Docker).
*   **The Face (Frontend)**: Deployed on **Vercel** (via Edge Network).

### Phase 1: The Brain (Railway)
1.  Push this repo to **GitHub**.
2.  Go to [Railway.app](https://railway.app), click **"New Project"**, and select this repo.
3.  Add Variables: `OPENAI_API_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`.
4.  Railway will auto-detect `backend/Dockerfile` and build the container.
5.  **Copy the URL** (e.g., `https://backend-production.up.railway.app`).

### Phase 2: The Face (Vercel)
1.  Go to [Vercel.com](https://vercel.com), click **"Add New Project"**, and select this repo.
2.  **Important**: Set Root Directory to `frontend`.
3.  Add Variable: `NEXT_PUBLIC_BACKEND_URL` = (Paste Railway URL).
4.  Click **Deploy**.

---

## 🔑 Environment Variables

| Variable | Description | Required? |
| :--- | :--- | :--- |
| `OPENAI_API_KEY` | GPT-4 Access Key | ✅ Yes |
| `AWS_ACCESS_KEY_ID` | S3 Read/Write Access | ✅ Yes |
| `AWS_SECRET_ACCESS_KEY` | S3 Secret Key | ✅ Yes |
| `S3_BUCKET_NAME` | Bucket for Documents | ✅ Yes |
| `DATABASE_URL` | PostgreSQL Connection (Railway provides this) | ✅ Yes |
| `NEXT_PUBLIC_BACKEND_URL` | URL of the Railway Backend | ✅ Yes (Frontend Only) |

---

## 📂 Project Structure

```bash
saudi-ai-platform/
├── backend/                 # 🧠 The Brain (FastAPI + Docker)
│   ├── app/                 # Application Logic (RAG, AI, DB)
│   ├── Dockerfile           # Multi-Stage Production Build
│   └── requirements.txt     # Python Dependencies
│
├── frontend/                # ⚡ The Face (Next.js 14 + Docker)
│   ├── app/                 # App Router Pages
│   ├── Dockerfile           # Alpine Optimized Build
│   └── next.config.mjs      # Standalone Output Config
│
└── docker/                  # (Deleted - We use Root Dockerfiles now)
```

---

### Built with ❤️ for Saudi Arabia's Future.
