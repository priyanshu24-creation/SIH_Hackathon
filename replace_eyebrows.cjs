const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/anime/OneDrive/Documents/SIH_1/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Dashboard / Documents etc case
  content = content.replace(
    /<div className="flex items-center gap-2 mb-2">\s*<span className="eyebrow">[\s\S]*?<\/div>/g,
    ''
  );
  
  // AuditLogs case
  content = content.replace(
    /<p className="eyebrow mb-1">Statutory Governance Register[^<]*<\/p>/g,
    ''
  );

  fs.writeFileSync(filePath, content);
}
console.log('Eyebrows removed from page headers.');
