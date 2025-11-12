# Simple CMS - Eshop Frontend

A simple Content Management System for the Eshop Backend API.

## Configuration

The CMS reads the API port from the `.env` file in the project root.

### Setup

1. **Configure the backend port** in `../../.env`:
   ```env
   PORT=13030
   ```

2. **Generate the config file**:
   ```bash
   npm run generate-config
   ```

   This will create `src/config.js` with the correct API base URL.

3. **Run the development server**:
   ```bash
   npm run dev
   ```

   This automatically generates the config and starts the live server.

### Manual Configuration Override

You can override the API configuration at runtime by setting `window.APP_CONFIG` or `window.API_PORT` before the app loads.

In `index.html`:
```javascript
<script>
    // Override port only
    window.API_PORT = 13030;
    
    // Or override entire config
    window.APP_CONFIG = {
        API_BASE_URL: 'http://localhost:13030/api',
        API_PORT: 13030
    };
</script>
```

## Development

### Scripts

- `npm test` - Run tests with coverage
- `npm run generate-config` - Generate config from .env
- `npm run dev` - Generate config and start development server

### File Structure

```
simple-cms/
├── app.js                  # Main application entry
├── index.html              # HTML template
├── styles.css              # Styles
├── generate-config.js      # Config generator script
├── src/
│   ├── config.js          # Auto-generated API config (don't edit manually)
│   ├── api.js             # API client
│   ├── router.js          # Client-side routing
│   ├── ui.js              # UI utilities
│   ├── models/            # Data models
│   └── views/             # View components
└── tests/                 # Jest tests
```

## Features

- Automatic configuration from `.env`
- Runtime configuration override support
- Client-side routing
- CRUD operations for Products, Orders, Users
- Mock data fallback for testing
- Responsive UI with UIkit

## Testing

```bash
npm test
```

Runs Jest tests with coverage reporting.
