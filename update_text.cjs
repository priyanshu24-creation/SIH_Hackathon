const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Replace inline fontSize
content = content.replace(/fontSize:\s*'?(\d+\.?\d*)(px)?'?/g, (match, p1) => {
  const newSize = Math.round(parseFloat(p1) * 1.07);
  return 'fontSize: ' + newSize;
});

// Replace tailwind text sizes
content = content.replace(/text-\[(\d+\.?\d*)px\]/g, (match, p1) => {
  const newSize = Math.round(parseFloat(p1) * 1.07);
  return 'text-[' + newSize + 'px]';
});

// Unbold inline
content = content.replace(/fontWeight:\s*\d+/g, "fontWeight: 400");
content = content.replace(/font-bold/g, "font-normal");
content = content.replace(/font-semibold/g, "font-normal");

// Colors to black
content = content.replace(/color:\s*'[^']+'/g, "color: '#000'");
content = content.replace(/color:\s*valueColor \? valueColor : \([^)]+\)/g, "color: '#000'"); 

// tailwind text colors
content = content.replace(/text-\[var\(--color-[^\]]+\)\]/g, "text-black");
content = content.replace(/text-(slate|gray|blue|amber|green|red)-\d+/g, "text-black");

// Recharts fill
content = content.replace(/fill:\s*'var\(--color-[^']+\)'/g, "fill: '#000'");

fs.writeFileSync('src/pages/Dashboard.tsx', content);
