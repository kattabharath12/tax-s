const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = process.env.UPLOAD_DIR || '/tmp/uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory: ${uploadsDir}`);
}

// Ensure documents subdirectory exists
const documentsDir = path.join(uploadsDir, 'documents');
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
  console.log(`Created documents directory: ${documentsDir}`);
}

// Start the Next.js application
console.log('Starting TaxGrok.AI application...');
execSync('npm start', { stdio: 'inherit' });
