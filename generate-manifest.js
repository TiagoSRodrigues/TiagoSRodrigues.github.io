const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, './content');
const personalDir = path.join(__dirname, './personal');
const configsDir = path.join(__dirname, './configs');
const manifestFile = path.join(__dirname, './configs/manifest.json');
const configFile = path.join(__dirname, './configs/config.json');

function extractFileVersion(content, fileURL) {
    let versionPattern;

    switch (true) {
        case fileURL.endsWith('.md'):
        case fileURL.endsWith('.html'):
            versionPattern = /version:\s*"(\d+\.\d+\.\d+)"/i;
            break;
        case fileURL.endsWith('.js'):
        case fileURL.endsWith('.json'):
        case fileURL.endsWith('.css'):
            versionPattern = /\/\*\s*\*.*Version:\s*(\d+\.\d+\.\d+).*\*\//s;
            break;
        default:
            return null; // Ignore other file types
    }

    const match = content.match(versionPattern);
    return match ? match[1] : null;
}



function getVersion(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return extractFileVersion(content, filePath);
}

function getFilteredFiles(directory, callback) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Error reading ${directory} directory:`, err);
            return;
        }

        console.log(`Files in ${directory}:`, files);

        const filteredFiles = files.filter(file =>
            file.toLowerCase() !== 'readme.md' &&
            path.extname(file).toLowerCase() !== '.json'
        );

        console.log(`Filtered files in ${directory}:`, filteredFiles);
        callback(filteredFiles);
    });
}


function generateManifest() {
    getFilteredFiles(contentDir, (contentFiles) => {
        getFilteredFiles(personalDir, (personalFiles) => {
            const otherFiles = contentFiles.filter(file => !personalFiles.includes(file));

            const manifestData = {
                personal: personalFiles,
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
}

function updateConfigVersions() {
    console.log('started updateConfigVersions');
    fs.readFile(configFile, 'utf8', (err, data) => {

        if (err) {
            console.error('Error reading config file:', err);
            return;
        }

        const config = JSON.parse(data);

        // Ensure necessary structure exists in config
        config.file_versions = config.file_versions || {};
        config.file_versions.content = config.file_versions.content || {};
        config.file_versions.personal = config.file_versions.personal || {};
        config.file_versions.configs = config.file_versions.configs || {};  // Add this line

        // For contentDir
        getFilteredFiles(contentDir, (contentFiles) => {
            contentFiles.forEach(file => {
                config.file_versions.content[file] = getVersion(path.join(contentDir, file));
            });

            // For personalDir
            getFilteredFiles(personalDir, (personalFiles) => {
                personalFiles.forEach(file => {
                    config.file_versions.personal[file] = getVersion(path.join(personalDir, file));
                });

                // For configsDir, only for 'scripts.js'
                const scriptVersion = getVersion(path.join(configsDir, 'scripts.js'));
                if (scriptVersion) {
                    config.file_versions.configs['scripts.js'] = scriptVersion;
                }

                fs.writeFile(configFile, JSON.stringify(config, null, 4), (err) => {
                    if (err) {
                        console.error('Error writing config file:', err);
                        return;
                    }
                    console.log('Config file updated successfully!');
                });
            });
        });
    });
}



generateManifest();
updateConfigVersions();
