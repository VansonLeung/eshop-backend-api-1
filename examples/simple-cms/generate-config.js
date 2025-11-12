#!/usr/bin/env node

/**
 * Generate client-side config from .env file
 * This script reads .env and creates a config.js file for the frontend
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
const envPath = path.join(__dirname, '../../.env');
const envConfig = dotenv.config({ path: envPath });

if (envConfig.error) {
    console.warn('Warning: Could not load .env file, using defaults');
}

const PORT = process.env.PORT || 3000;

// Generate config.js content
const configContent = `// Auto-generated configuration from .env
// Do not edit manually - run 'npm run generate-config' to regenerate

export const config = window.APP_CONFIG || {
    API_BASE_URL: \`http://localhost:${PORT}/api\`,
    API_PORT: ${PORT}
};

// Helper to get full API URL
export function getApiBaseUrl() {
    return config.API_BASE_URL;
}
`;

// Write to config.js
const configPath = path.join(__dirname, 'src/config.js');
fs.writeFileSync(configPath, configContent, 'utf-8');

console.log(`✓ Generated config.js with PORT=${PORT}`);
console.log(`  API_BASE_URL: http://localhost:${PORT}/api`);
