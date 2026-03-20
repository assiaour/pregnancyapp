const { execSync } = require('child_process');
const fs = require('fs');
fs.writeFileSync('../baby_diff2.txt', execSync('git log -p -- screens/BabySizeScreen.js', { encoding: 'utf8' }));
