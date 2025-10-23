# 🐳 Docker Deployment Guide

This guide covers running the Baby Bet app using Docker and Docker Compose.

---

## Why Docker?

Docker provides:
- **Portability**: Run anywhere (AWS, GCP, DigitalOcean, your own server)
- **Consistency**: Same environment in dev, staging, and production
- **Isolation**: App runs in its own container
- **Easy scaling**: Use with Kubernetes, Docker Swarm, etc.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed (20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) installed (v2.0+)
- Supabase project set up (see main README.md)

---

## Quick Start (Docker Compose)

### 1. Setup Environment File

Copy the Docker environment template:

```bash
cp .env.docker.example .env
```

Edit `.env` with your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
VENMO_RECIPIENT=@your-handle
ADMIN_PASSCODE=your-password
# ... rest of variables
```

### 2. Build and Run

```bash
docker-compose up -d
```

This will:
- Build the Docker image
- Start the container in detached mode
- Expose the app on http://localhost:3000

### 3. View Logs

```bash
docker-compose logs -f app
```

### 4. Stop the App

```bash
docker-compose down
```

---

## Manual Docker Commands

If you prefer using Docker directly without Compose:

### Build the Image

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... \
  -t babybet:latest .
```

### Run the Container

```bash
docker run -d \
  --name babybet \
  -p 3000:3000 \
  -e SUPABASE_SERVICE_ROLE_KEY=eyJ... \
  -e DUE_DATE=2025-02-25 \
  -e WINDOW_START=2025-02-15 \
  -e WINDOW_END=2025-03-10 \
  -e VENMO_RECIPIENT=@your-handle \
  -e VENMO_AMOUNT=5 \
  -e VENMO_NOTE_TEMPLATE="Baby Bet — {name} — {date} — {code} — Due {dueDate}" \
  -e ADMIN_PASSCODE=your-password \
  -e SESSION_TTL_HOURS=8 \
  babybet:latest
```

### View Logs

```bash
docker logs -f babybet
```

### Stop and Remove

```bash
docker stop babybet
docker rm babybet
```

---

## Production Deployment

### Option 1: AWS ECS (Elastic Container Service)

1. **Push image to ECR**:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR-ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

docker tag babybet:latest YOUR-ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/babybet:latest

docker push YOUR-ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/babybet:latest
```

2. **Create ECS task definition** with environment variables
3. **Create ECS service** pointing to your task definition
4. **Set up Application Load Balancer** for HTTPS

### Option 2: DigitalOcean App Platform

1. **Connect your GitHub repo**
2. **Select Dockerfile** as build method
3. **Add environment variables** in the web UI
4. **Deploy** (automatic HTTPS included)

### Option 3: Fly.io

1. **Install Fly CLI**:
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Create fly.toml**:
```toml
app = "babybet"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "3000"
  DUE_DATE = "2025-02-25"
  WINDOW_START = "2025-02-15"
  WINDOW_END = "2025-03-10"
  VENMO_AMOUNT = "5"
  SESSION_TTL_HOURS = "8"

[[services]]
  internal_port = 3000
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

3. **Set secrets**:
```bash
fly secrets set NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
fly secrets set NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
fly secrets set SUPABASE_SERVICE_ROLE_KEY=eyJ...
fly secrets set VENMO_RECIPIENT=@your-handle
fly secrets set ADMIN_PASSCODE=your-password
fly secrets set VENMO_NOTE_TEMPLATE="Baby Bet — {name} — {date} — {code} — Due {dueDate}"
```

4. **Deploy**:
```bash
fly deploy
```

### Option 4: Google Cloud Run

1. **Build and push to GCR**:
```bash
gcloud builds submit --tag gcr.io/YOUR-PROJECT/babybet

gcloud run deploy babybet \
  --image gcr.io/YOUR-PROJECT/babybet \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co,DUE_DATE=2025-02-25 \
  --set-secrets SUPABASE_SERVICE_ROLE_KEY=projects/PROJECT/secrets/SERVICE_ROLE_KEY:latest
```

### Option 5: Railway.app

1. **Connect GitHub repo**
2. **Railway auto-detects Dockerfile**
3. **Add environment variables** in dashboard
4. **Deploy** (automatic HTTPS)

---

## Environment Variables in Docker

### Build-time (ARG in Dockerfile)
These are baked into the image:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Runtime (ENV at container start)
These are provided when container starts (more secure):
- `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **Secret!**
- `ADMIN_PASSCODE` ⚠️ **Secret!**
- `DUE_DATE`
- `WINDOW_START`
- `WINDOW_END`
- `VENMO_RECIPIENT`
- `VENMO_AMOUNT`
- `VENMO_NOTE_TEMPLATE`
- `SESSION_TTL_HOURS`

---

## Health Checks

The Docker image includes a health check that pings the app every 30 seconds:

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/"]
  interval: 30s
  timeout: 10s
  retries: 3
```

Check health status:
```bash
docker ps
# Look for "healthy" in STATUS column
```

---

## Image Optimization

The Dockerfile uses multi-stage builds to minimize size:

1. **deps stage**: Installs dependencies
2. **builder stage**: Builds Next.js app
3. **runner stage**: Copies only what's needed for production

Final image size: ~150-200 MB (Node.js Alpine-based)

---

## Troubleshooting

### Container won't start

Check logs:
```bash
docker logs babybet
```

Common issues:
- Missing environment variables
- Invalid Supabase credentials
- Port 3000 already in use

### "Missing env" error

Make sure all required environment variables are set when running the container.

### Can't connect to Supabase

Verify:
- Supabase URL is correct
- Service role key is valid
- Container has internet access

### Build fails

Clear Docker cache:
```bash
docker system prune -a
docker-compose build --no-cache
```

---

## Security Best Practices

### 1. Never commit secrets
- Add `.env` to `.gitignore` (already done)
- Use secrets management in production

### 2. Use secrets management
- **AWS**: AWS Secrets Manager + ECS task definition
- **GCP**: Secret Manager + Cloud Run
- **Docker**: Docker secrets (Swarm mode)

### 3. Run as non-root
The Dockerfile already creates a `nextjs` user (UID 1001) for security.

### 4. Scan for vulnerabilities
```bash
docker scan babybet:latest
```

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/docker.yml`:

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: yourusername/babybet:latest
          build-args: |
            NEXT_PUBLIC_SUPABASE_URL=${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
            NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

---

## Comparison: Docker vs Vercel

| Feature | Docker | Vercel |
|---------|--------|--------|
| **Setup** | More complex | One-click |
| **Cost** | Pay for server/service | Free tier available |
| **Control** | Full control | Limited |
| **Scaling** | Manual/orchestration | Automatic |
| **Best for** | Custom infrastructure | Quick deployment |

**Recommendation**: 
- Use **Vercel** for MVP/quick start
- Use **Docker** for custom requirements, enterprise, or multi-cloud

---

## Next Steps

1. ✅ Build image: `docker-compose build`
2. ✅ Test locally: `docker-compose up`
3. ✅ Verify app works: http://localhost:3000
4. ✅ Push to registry (Docker Hub, ECR, GCR)
5. ✅ Deploy to production platform
6. ✅ Set up monitoring and logging

---

## Support

- **Docker Docs**: https://docs.docker.com
- **Next.js Docker**: https://nextjs.org/docs/deployment#docker-image
- **Main README**: See README.md for app documentation

---

**You're ready to deploy with Docker!** 🐳

