# Quickstart: Eshop CMS

## Overview

The Eshop CMS is a pure JavaScript/HTML/CSS web application for managing Products, Orders, and Users. It provides a clean, responsive interface built with UIKit 3.x for managing eshop data through RESTful API integration.

## Prerequisites

- **Browser**: Modern web browser (Chrome 118+, Firefox 118+, Safari 16+, Edge 118+)
- **Backend API**: Running at `http://localhost:3000/api/`
- **Node.js**: Version 16+ (for development server and testing)
- **npm**: Package manager for dependencies

## Installation & Setup

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd examples/simple-cms
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
# or
npx live-server --port=8080
```

### 4. Open Application
Navigate to `http://localhost:8080` in your web browser.

## Usage Guide

### Navigation
- Use the **sidebar menu** to navigate between sections:
  - **Products**: Manage product catalog
  - **Orders**: View and update order status
  - **Users**: Manage user accounts

### Products Management
1. **View Products**: Browse the product list with search and pagination
2. **Create Product**: Click "Create Product" and fill in name, description
3. **Edit Product**: Click the edit icon next to any product
4. **Delete Product**: Click the delete icon and confirm deletion

### Orders Management
1. **View Orders**: See all orders with current status
2. **View Details**: Click on an order to see full details
3. **Update Status**: Change order status through the valid transitions:
   - `pending` → `processing` → `shipped` → `delivered`

### Users Management
1. **View Users**: Browse all user accounts
2. **Create User**: Add new users with email and role
3. **Edit User**: Modify user information
4. **Delete User**: Remove user accounts

## Development

### Project Structure
```
├── index.html          # Main HTML file
├── styles.css          # Custom styles
├── app.js             # Main application logic
├── src/
│   ├── models/        # Data models (Product, Order, User)
│   ├── views/         # UI view components
│   ├── api.js         # API client
│   ├── router.js      # Client-side routing
│   └── ui.js          # UI utilities
├── tests/             # Unit tests
└── specs/             # Documentation
```

### Key Technologies
- **JavaScript ES6+**: Modern JavaScript features
- **UIKit 3.x**: CSS framework for consistent UI
- **Native Fetch API**: HTTP requests (no external libraries)
- **Jest**: Unit testing framework
- **Hash-based Routing**: Client-side navigation

### Development Workflow
1. **Edit Code**: Modify files in `src/` directory
2. **Run Tests**: `npm test` to execute unit tests
3. **View Changes**: Refresh browser or use live reload
4. **Debug**: Use browser developer tools for debugging

### API Integration
- **Base URL**: `http://localhost:3000/api/`
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Automatic retry for network failures
- **Mock Data**: Fallback data for development when API unavailable

## Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- Unit tests for all data models
- API client integration tests
- View component tests
- Coverage reporting with Jest

## Troubleshooting

### Common Issues

**API Connection Failed**
- Ensure backend API is running on `http://localhost:3000`
- Check CORS configuration
- Verify network connectivity

**Authentication Errors**
- Clear browser localStorage
- Check JWT token expiration
- Verify backend authentication setup

**UI Not Loading**
- Check browser console for JavaScript errors
- Ensure UIKit CSS is loading
- Verify all script dependencies

**Tests Failing**
- Run `npm install` to ensure dependencies
- Check Node.js version compatibility
- Review test output for specific errors

### Performance Tips
- Keep product/order lists under 1000 items for optimal performance
- Use browser developer tools to monitor network requests
- Enable browser caching for static assets

## Deployment

### Production Build
```bash
# No build step required - static files
cp -r . /path/to/web/server/
```

### Server Configuration
- Enable CORS for API domain
- Configure HTTPS in production
- Set up proper error logging
- Implement rate limiting if needed

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the specification documents in `specs/`
3. Check browser console for error messages
4. Verify API endpoint availability
