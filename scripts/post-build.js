#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');

console.log('\n' + '━'.repeat(65));
console.log('  ✅ Build completed successfully!');
console.log('━'.repeat(65) + '\n');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.log('⚠️  IMPORTANT: Configuration Required\n');
  console.log('📝 Create a .env file in the root folder:');
  console.log('   1. Copy .env.example to .env');
  console.log('   2. Get your free API key from: https://openweathermap.org/api');
  console.log('   3. Add your API key to .env file\n');
  console.log('📄 Example .env file:');
  console.log('   ' + '─'.repeat(60));
  
  if (fs.existsSync(envExamplePath)) {
    const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
    const lines = exampleContent.split('\n');
    lines.forEach(line => console.log('   ' + line));
  } else {
    console.log('   OPENWEATHER_API_KEY=your_api_key_here');
    console.log('   DEFAULT_LOCATION_CITY=YourCity');
  }
  
  console.log('   ' + '─'.repeat(60) + '\n');
} else {
  // Check if API key is set
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasApiKey = envContent.includes('OPENWEATHER_API_KEY=') && 
                    !envContent.includes('OPENWEATHER_API_KEY=your_api_key_here') &&
                    !envContent.includes('OPENWEATHER_API_KEY=\n') &&
                    !envContent.includes('OPENWEATHER_API_KEY=\r');
  
  if (!hasApiKey) {
    console.log('⚠️  WARNING: OpenWeatherMap API key not configured!\n');
    console.log('📝 Please add your API key to the .env file:');
    console.log('   Get your free API key from: https://openweathermap.org/api\n');
  } else {
    console.log('✅ Configuration found!\n');
  }
}

console.log('📚 Next Steps:');
console.log('   1. Configure Claude Desktop config file (see README.md)');
console.log('   2. Restart Claude Desktop completely');
console.log('   3. Ask Claude: "What\'s the weather in London?"\n');
console.log('━'.repeat(65) + '\n');
