import fs from 'fs';
import path from 'path';

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Replace hardcoded white backgrounds
            content = content.replace(/background:\s*'white'/g, "background: 'var(--card)'");
            content = content.replace(/background:\s*'#fff'/g, "background: 'var(--card)'");
            content = content.replace(/background:\s*'#ffffff'/g, "background: 'var(--card)'");
            
            // Replace text colors that might be hardcoded to dark
            content = content.replace(/color:\s*'(?:#000|#0f172a|#1e293b)'/g, "color: 'var(--text)'");
            content = content.replace(/color:\s*'(?:#475569|#64748b)'/g, "color: 'var(--text-secondary)'");
            content = content.replace(/color:\s*'(?:#e2e8f0|#f1f5f9|#f8fafc|white|#fff)'/g, "color: 'var(--text-muted)'");

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

walkDir('./src/components');
walkDir('./src/pages');
