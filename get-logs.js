const { execSync } = require('child_process');
const fs = require('fs');
try {
  const result = execSync('git log -p -n 3 screens/MainHomeScreen.js');
  fs.writeFileSync('../git_log_utf8.txt', result);
  
  const tools = execSync('git log -p -n 3 screens/ToolsScreen.js');
  fs.writeFileSync('../git_log_tools.txt', tools);
} catch (e) {
  console.log(e);
}
