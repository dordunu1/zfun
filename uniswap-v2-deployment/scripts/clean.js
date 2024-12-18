const fs = require('fs');
const path = require('path');

// Clean up artifacts and cache
function cleanDirectory(directory) {
  if (fs.existsSync(directory)) {
    fs.rmSync(directory, { recursive: true });
    console.log(`Cleaned ${directory}`);
  }
}

// Reset .env to template
function resetEnv() {
  if (fs.existsSync('.env')) {
    const envTemplate = fs.readFileSync('.env.example', 'utf8');
    fs.writeFileSync('.env', envTemplate);
    console.log('Reset .env to template');
  }
}

// Main cleanup
cleanDirectory('./artifacts');
cleanDirectory('./cache');
resetEnv();

console.log('Cleanup complete. Ready for fresh deployment.'); 