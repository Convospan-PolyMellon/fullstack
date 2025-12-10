const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
    let content = '';
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
    }

    // Split by newline and remove lines with GEMINI_API_KEY or empty lines at end
    const lines = content.split(/\r?\n/).filter(l => l.trim() !== '' && !l.startsWith('GEMINI_API_KEY'));

    // Add correct key
    lines.push('***REMOVED***');

    fs.writeFileSync(envPath, lines.join('\n'), 'utf8');
    console.log('Successfully updated .env with correct API Key and encoding.');
} catch (err) {
    console.error('Failed to update .env:', err);
    process.exit(1);
}
