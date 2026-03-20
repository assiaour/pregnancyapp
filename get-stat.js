const { execSync } = require('child_process');
const fs = require('fs');
fs.writeFileSync('../log_stat2.txt', execSync('git log -n 2 --stat'));
