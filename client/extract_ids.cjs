const fs = require('fs');
try {
    const content = fs.readFileSync('youtube_results.html', 'utf8');
    const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
    let match;
    const ids = new Set();
    while ((match = regex.exec(content)) !== null) {
        ids.add(match[1]);
        if (ids.size >= 10) break;
    }
    console.log(JSON.stringify([...ids], null, 2));
} catch (e) {
    console.error(e);
}
