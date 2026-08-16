const { execSync } = require('child_process');
const fs = require('fs');
if (!fs.existsSync('.next')) {
  execSync('npx next build', { stdio: 'inherit' });
}
execSync('npx next start -H 0.0.0.0 -p 3000', { stdio: 'inherit' });
