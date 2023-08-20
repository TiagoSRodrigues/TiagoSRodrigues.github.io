const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, './content');
const manifestFile = path.join(__dirname, './configs/manifest.json');

fs.readdir(contentDir, (err, files) => {
    if (err) {
        console.error('Error reading content directory:', err);
        return;
    }

    // Exclude readme.md and any .json files from the list
    const filteredFiles = files.filter(file =>
        file.toLowerCase() !== 'readme.md' &&
        path.extname(file).toLowerCase() !== '.json'
    );

    fs.writeFile(manifestFile, JSON.stringify(filteredFiles, null, 4), (err) => {
        if (err) {
            console.error('Error writing manifest file:', err);
            return;
        }
        console.log('Manifest file generated successfully!');
    });
});
