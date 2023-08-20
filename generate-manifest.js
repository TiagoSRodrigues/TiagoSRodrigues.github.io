

const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, './content');
const personalDir = path.join(__dirname, './personal');
const manifestFile = path.join(__dirname, './configs/manifest.json');

fs.readdir(contentDir, (err, files) => {
    if (err) {
        console.error('Error reading content directory:', err);
        return;
    }

    const filteredFiles = files.filter(file =>
        file.toLowerCase() !== 'readme.md' &&
        path.extname(file).toLowerCase() !== '.json'
    );

    fs.readdir(personalDir, (err, personalFiles) => {
        if (err) {
            console.error('Error reading personal directory:', err);
            return;
        }

        const filteredPersonalFiles = personalFiles.filter(file =>
            file.toLowerCase() !== 'readme.md' &&
            path.extname(file).toLowerCase() !== '.json'
        );

        // Exclude personal files from the main filteredFiles list
        const otherFiles = filteredFiles.filter(file => !filteredPersonalFiles.includes(file));

        const manifestData = {
            personal: filteredPersonalFiles,
            content: otherFiles
        };

        fs.writeFile(manifestFile, JSON.stringify(manifestData, null, 4), (err) => {
            if (err) {
                console.error('Error writing manifest file:', err);
                return;
            }
            console.log('Manifest file generated successfully!');
        });
    });
});
