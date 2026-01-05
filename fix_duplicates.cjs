const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'wordFacts.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

const keyCounts = {};
let newContent = '';
const lines = fileContent.split('\n');

const keyRegex = /^\s*"([^"]+)":\s*\[/;

// First pass: count keys
lines.forEach(line => {
    const match = line.match(keyRegex);
    if (match) {
        const key = match[1];
        keyCounts[key] = (keyCounts[key] || 0) + 1;
    }
});

// Reset counts for replacement
const currentCounts = {};

lines.forEach(line => {
    const match = line.match(keyRegex);
    if (match) {
        const key = match[1];
        // Remove existing _DUP suffix if present to canonicalize (optional, but safer to treat full string as key)
        // Actually, we should just track the exact string key.

        currentCounts[key] = (currentCounts[key] || 0) + 1;

        if (currentCounts[key] > 1) {
            // This is a duplicate
            const newKey = `${key}_DUP${currentCounts[key]}`;
            // Replace the key in the line
            const newLine = line.replace(`"${key}":`, `"${newKey}":`);
            newContent += newLine + '\n';
        } else {
            newContent += line + '\n';
        }
    } else {
        newContent += line + '\n';
    }
});

fs.writeFileSync(filePath, newContent);
console.log('Duplicates fixed!');
