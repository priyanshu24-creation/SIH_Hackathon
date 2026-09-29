const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function updateFile(filePath) {
    if (!/\.(tsx|jsx|ts|js|css|html)$/.test(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. text-[Xpx]
    content = content.replace(/text-\[(\d+(?:\.\d+)?)px\]/g, (match, p1) => {
        let val = parseFloat(p1) * 1.05;
        // round to 2 decimal places to avoid crazy long numbers
        val = Math.round(val * 100) / 100;
        return `text-[${val}px]`;
    });

    // 2. fontSize: X (in style={{ fontSize: 13 }})
    content = content.replace(/fontSize:\s*(\d+(?:\.\d+)?)(?!px|rem|em|%|vh|vw|'|")/g, (match, p1) => {
        let val = parseFloat(p1) * 1.05;
        val = Math.round(val * 100) / 100;
        return `fontSize: ${val}`;
    });

    // 3. fontSize: 'Xpx' or fontSize: "Xpx"
    content = content.replace(/fontSize:\s*(['"])(\d+(?:\.\d+)?)px\1/g, (match, p1, p2) => {
        let val = parseFloat(p2) * 1.05;
        val = Math.round(val * 100) / 100;
        return `fontSize: ${p1}${val}px${p1}`;
    });

    // 4. font-size: Xpx
    content = content.replace(/font-size:\s*(\d+(?:\.\d+)?)px/g, (match, p1) => {
        let val = parseFloat(p1) * 1.05;
        val = Math.round(val * 100) / 100;
        return `font-size: ${val}px`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

walkDir(path.join(__dirname, 'src'), updateFile);
// Also do index.css if not in src
const indexCssPath = path.join(__dirname, 'index.css');
if (fs.existsSync(indexCssPath)) {
    updateFile(indexCssPath);
}
// index.html
const indexHtmlPath = path.join(__dirname, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
    updateFile(indexHtmlPath);
}

console.log("Done!");
