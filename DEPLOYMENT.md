# Deployment Guide

This guide explains how to deploy the NodeFun monorepo to Azure.

## Architecture Overview

The monorepo consists of two separate applications that should be deployed independently:

```
┌─────────────────────────────────────────┐
│  Frontend (Azure Static Web Apps)       │
│  - React application                    │
│  - Serves static files                  │
│  - Calls backend API                    │
└─────────────────┬───────────────────────┘
                  │
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────┐
│  Backend (Azure App Service)            │
│  - Express REST API                     │
│  - MCP Server endpoints                 │
│  - Movie database logic                 │
└─────────────────────────────────────────┘
```

## Backend Deployment (Azure App Service)

### Prerequisites
- Azure CLI installed
- Azure subscription
- Resource group created

### Option 1: Deploy via Azure CLI

```bash
# Navigate to backend
cd packages/backend

# Build the application
npm run build

# Login to Azure
az login

# Create an App Service Plan (if needed)
az appservice plan create \
  --name nodefun-plan \
  --resource-group your-resource-group \
  --sku B1 \
  --is-linux

# Create the Web App
az webapp create \
  --name nodefun-backend \
  --resource-group your-resource-group \
  --plan nodefun-plan \
  --runtime "NODE:22-lts"

# Configure startup command
az webapp config set \
  --name nodefun-backend \
  --resource-group your-resource-group \
  --startup-file "node dist/index.js"

# Deploy the code
az webapp deployment source config-zip \
  --name nodefun-backend \
  --resource-group your-resource-group \
  --src backend.zip
```

### Option 2: Deploy via VS Code Azure Extension

1. Install the Azure App Service extension in VS Code
2. Right-click on `packages/backend` folder
3. Select "Deploy to Web App..."
4. Follow the prompts to create/select App Service
5. Set startup command to `node dist/index.js`

### Environment Variables

Set these in Azure Portal → App Service → Configuration → Application settings:

```
NODE_ENV=production
PORT=8080
```

### Verify Backend Deployment

Visit: `https://your-backend-app.azurewebsites.net/health`

You should see:
```json
{
  "status": "ok",
  "timestamp": "2025-11-28T..."
}
```

## Frontend Deployment (Azure Static Web Apps)

### Prerequisites
- GitHub repository (recommended for automatic deployments)
- Azure Static Web Apps CLI (optional, for local testing)

### Option 1: Deploy via GitHub Actions (Recommended)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add frontend"
   git push origin main
   ```

2. **Create Static Web App in Azure Portal**
   - Go to Azure Portal → Create Resource → Static Web App
   - Connect to your GitHub repository
   - Set build configuration:
     - **App location**: `/packages/frontend`
     - **Build preset**: `React`
     - **Output location**: `dist`

3. **Update API URL**
   
   Create `packages/frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-app.azurewebsites.net
   ```

   Update `packages/frontend/vite.config.ts`:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         '/api': {
           target: process.env.VITE_API_URL || 'http://localhost:3000',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/api/, '')
         }
       }
     }
   })
   ```

4. **Commit and Push** - GitHub Actions will automatically build and deploy

### Option 2: Manual Deploy with Azure CLI

```bash
# Build the frontend
cd packages/frontend
npm run build

# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy ./dist \
  --app-name nodefun-frontend \
  --resource-group your-resource-group \
  --env production
```

### Configure CORS on Backend

Update `packages/backend/src/app.ts` to allow frontend origin:

```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'https://your-frontend-app.azurestaticapps.net',
    'http://localhost:5173' // For local development
  ]
}));
```

Don't forget to install cors:
```bash
cd packages/backend
npm install cors
npm install --save-dev @types/cors
```

## Alternative: Single App Service for Both

If you prefer to serve both frontend and backend from the same App Service:

1. Build both applications:
   ```bash
   npm run build
   ```

2. Update backend to serve frontend static files:
   
   In `packages/backend/src/app.ts`:
   ```typescript
   import path from 'path';
   import { fileURLToPath } from 'url';

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);

   // Serve frontend static files
   app.use(express.static(path.join(__dirname, '../../frontend/dist')));

   // API routes here...

   // Serve frontend for all other routes (SPA fallback)
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
   });
   ```

3. Deploy the entire `packages` folder to App Service

## Post-Deployment Checklist

- [ ] Backend health endpoint responds
- [ ] Frontend loads successfully
- [ ] Frontend can communicate with backend API
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] SSL/HTTPS is enabled
- [ ] Custom domain configured (optional)
- [ ] Application Insights enabled (optional)

## Troubleshooting

### Frontend can't reach backend
- Check CORS configuration
- Verify API URL in frontend `.env.production`
- Check Azure networking/firewall rules

### Backend returns 500 errors
- Check Application Logs in Azure Portal
- Verify all dependencies are installed
- Check startup command is correct
- Verify CSV data file is included in deployment

### Build fails
- Ensure Node.js version matches (22.x)
- Run `npm install` in both packages
- Check for TypeScript errors: `npm run build`

## Monitoring

Set up Application Insights:

```bash
az monitor app-insights component create \
  --app nodefun-insights \
  --location eastus \
  --resource-group your-resource-group

# Get instrumentation key
az monitor app-insights component show \
  --app nodefun-insights \
  --resource-group your-resource-group \
  --query instrumentationKey
```

Add to backend environment variables:
```
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=your-key
```

## Cost Optimization

- **Frontend**: Azure Static Web Apps has a generous free tier
- **Backend**: Use B1 tier App Service Plan for development (~$13/month)
- Scale up to P1V2 or higher for production (~$70+/month)

## CI/CD Pipeline Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm install
      - run: npm run backend:build
      - uses: azure/webapps-deploy@v2
        with:
          app-name: nodefun-backend
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: packages/backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm install
      - run: npm run frontend:build
      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "packages/frontend"
          output_location: "dist"
```
