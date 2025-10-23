# 🐳 Docker Quick Start

Get the app running in Docker in 5 minutes.

---

## Prerequisites

- Docker & Docker Compose installed
- Supabase project created (see main README)

---

## 3-Step Setup

### 1. Create Environment File

```bash
# Copy the example
cp .env.example .env

# Edit with your credentials
nano .env  # or use your preferred editor
```

Make sure to set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VENMO_RECIPIENT`
- `ADMIN_PASSCODE`

### 2. Build and Run

```bash
oka
```

This will:
- Build the optimized Docker image (~150MB)
- Start the container in background
- Expose app on port 3000

### 3. Verify It's Running

```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f app

# Visit the app
open http://localhost:3000
```

---

## Common Commands

```bash
# Start the app
docker-compose up -d

# Stop the app
docker-compose down

# View logs
docker-compose logs -f app

# Rebuild after code changes
docker-compose build
docker-compose up -d

# Restart the app
docker-compose restart

# Remove everything (including volumes)
docker-compose down -v
```

---

## Testing

1. **Guest Flow**: Visit http://localhost:3000
2. **Admin Panel**: Visit http://localhost:3000/admin
3. **Health Check**: 
   ```bash
   curl http://localhost:3000
   ```

---

## Troubleshooting

### Container won't start
```bash
docker-compose logs app
```

### Port already in use
Change port in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Use 3001 instead
```

### Environment variables not working
Make sure `.env` file exists and has all required variables.

---

## Production Deployment

See `DOCKER.md` for:
- AWS ECS deployment
- Google Cloud Run deployment  
- Fly.io deployment
- DigitalOcean App Platform
- CI/CD setup

---

## Next Steps

✅ App running in Docker  
✅ Test on mobile device  
✅ Push to container registry  
✅ Deploy to production platform  

**Full documentation**: See `DOCKER.md`

