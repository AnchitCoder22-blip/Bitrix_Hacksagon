import fs from 'fs';
import path from 'path';

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      if (content.includes('useHealthQueue')) {
        content = content.replace(/useHealthQueue/g, 'useSystem');
        changed = true;
      }
      if (content.includes('HealthQueueContext')) {
        content = content.replace(/HealthQueueContext/g, 'SystemContext');
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

// using process.cwd() instead of __dirname to avoid ESM issue
const srcDir = path.join(process.cwd(), 'src');
processDir(srcDir);
console.log('Done!');
