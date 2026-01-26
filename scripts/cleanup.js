#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up processes and caches...\n');

// 1. Kill all Node.js processes
try {
  console.log('⏹️  Stopping all Node.js processes...');
  execSync('pkill -9 node', { stdio: 'ignore' });
  console.log('✅ All Node.js processes stopped');
} catch (error) {
  // pkill returns error if no processes found - that's OK
  console.log('ℹ️  No Node.js processes to stop');
}

// 2. Wait a bit
console.log('⏳ Waiting 2 seconds...');
execSync('sleep 2');

// 3. Clean caches
const cacheDirs = ['.next', '.turbo', 'node_modules/.cache'];
const projectRoot = path.resolve(__dirname, '..');

console.log('\n🗑️  Removing cache directories...');
cacheDirs.forEach((dir) => {
  const fullPath = path.join(projectRoot, dir);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ Removed ${dir}`);
    } catch (error) {
      console.log(`⚠️  Could not remove ${dir}: ${error.message}`);
    }
  } else {
    console.log(`ℹ️  ${dir} doesn't exist (OK)`);
  }
});

// 4. Check port 3000
try {
  const result = execSync('lsof -ti:3000', { encoding: 'utf-8', stdio: 'pipe' });
  if (result.trim()) {
    console.log('\n⚠️  Port 3000 is still occupied. Killing...');
    execSync(`kill -9 ${result.trim()}`, { stdio: 'ignore' });
    console.log('✅ Port 3000 freed');
  }
} catch (error) {
  // lsof returns error if port is free - that's OK
  console.log('✅ Port 3000 is free');
}

console.log('\n✨ Cleanup complete! Starting server...\n');
