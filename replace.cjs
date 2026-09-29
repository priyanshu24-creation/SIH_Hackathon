const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const hexToToken = {
  // New found colors
  '#13583F': 'var(--color-primary-hover)',
  '#238A78': 'var(--color-accent)',
  '#2878B5': 'var(--color-primary)',
  '#C83B3B': 'var(--color-error)',
  '#FDECEC': 'var(--color-error-bg)',
  '#F59E0B': 'var(--color-warning)',
  '#C2E4D4': 'var(--color-success-border)',
  '#FAFCFB': 'var(--color-bg)',
  '#13583f': 'var(--color-primary-hover)',
  '#238a78': 'var(--color-accent)',
  '#c83b3b': 'var(--color-error)',
  '#fdecec': 'var(--color-error-bg)',
  '#f59e0b': 'var(--color-warning)',
  '#fafcfb': 'var(--color-bg)',
  // Make sure we get lowercase versions of these just in case
  '#176b4d': 'var(--color-primary)',
  '#12573e': 'var(--color-primary-hover)',
  '#c2ddd0': 'var(--color-success-border)',
  '#92600a': 'var(--color-warning)',
  '#c77b00': 'var(--color-warning)',
  '#fef3e2': 'var(--color-warning-bg)',
  '#fff4dd': 'var(--color-warning-bg)',
  '#f2d68e': 'var(--color-warning-border)',
  '#e39a24': 'var(--color-warning-border)',
  '#b91c1c': 'var(--color-error)',
  '#fef2f2': 'var(--color-error-bg)',
  '#fecaca': 'var(--color-error-border)',
  '#f6f7f3': 'var(--color-border-subtle)',
  '#f5f7f5': 'var(--color-border-subtle)',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.match(/\.(tsx|jsx|ts|js|css)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      const hexRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g;
      
      content = content.replace(hexRegex, (match) => {
        const upperMatch = match.toUpperCase();
        if (hexToToken[upperMatch]) {
          changed = true;
          return hexToToken[upperMatch];
        } else if (hexToToken[match.toLowerCase()]) {
          changed = true;
          return hexToToken[match.toLowerCase()];
        } else if (hexToToken[match]) {
          changed = true;
          return hexToToken[match];
        }
        return match;
      });
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(directoryPath);
console.log('Done replacing colors part 2.');
