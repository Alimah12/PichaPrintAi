const fs = require('fs');
const path = require('path');

// Read the HTML template
const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace environment variable placeholder
const apiUrl = process.env.API_URL || 'http://localhost:8000/api/generate';

// Replace the placeholder in the script tag
html = html.replace(
    "window.ENV = { API_URL: '%API_URL%' };",
    `window.ENV = { API_URL: '${apiUrl}' };`
);

// Write to dist folder (Vercel looks for this)
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
}

fs.writeFileSync(path.join(distPath, 'index.html'), html);

console.log(`✓ Built successfully with API_URL: ${apiUrl}`);
