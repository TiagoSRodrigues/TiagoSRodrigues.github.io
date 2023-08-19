// Define the main function to handle configuration parsing
function parseConfig() {
    // Fetch the config.json file
    fetch('configs/config.json')
        .then(response => response.json())
        .then(config => {
            // Call your function to process the configurations
            processConfig(config);
        })
        .catch(error => {
            console.error('Error fetching config.json:', error);
        });

    generateSidebar();
    loadContent("1-Understanding_DevOps.md");  // or whatever the default content should be
    }

// Function to process the fetched configurations
function processConfig(config) {
    const siteTitle = config.site.title;
    const siteDescription = config.site.description;
    const siteTheme = config.site.theme;

    document.getElementById("site-title").innerText = siteTitle;

    // Set initial theme
    const themeStyle = document.createElement("link");
    themeStyle.rel = "stylesheet";
    themeStyle.id = "theme-style";
    themeStyle.href = `configs/styles/${siteTheme}_theme/${siteTheme}.css`;
    document.head.appendChild(themeStyle);
}


// Helper function to retrieve configuration values
function getConfig(key) {
    return this[key];
}

// Attach getConfig to the processConfig function for easy access
processConfig.getConfig = getConfig;



// Call the main function to start parsing the config
parseConfig();

function loadContent(fileName) {
    fetch(`content/${fileName}`)
        .then(response => response.text())
        .then(markdown => {
            const htmlContent = convertMarkdownToHTML(markdown);
            document.getElementById("main-content").innerHTML = htmlContent;
        })
        .catch(error => {
            console.error("Error loading content:", error);
        });
}

function generateSidebar() {
    const sidebar = document.getElementById("sidebar");
    const contentFiles = ["1-Understanding_DevOps.md", "2-Understangin_Cloud_Computing.md", "3-Devops_for_Managers.md"];  // In reality, you might want to fetch this list dynamically.

    contentFiles.forEach(file => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");

        link.href = `#${file}`;
        link.innerText = file.replace(/\.md$/, '').replace(/^[0-9]-/, '').replace(/_/g, ' ');

        link.addEventListener("click", function (event) {
            event.preventDefault();
            loadContent(file);
        });

        listItem.appendChild(link);
        sidebar.appendChild(listItem);
    });
}
function convertMarkdownToHTML(markdown) {
    return window.marked.marked(markdown);
}



function toggleTheme() {
    const currentTheme = processConfig.getConfig("site.theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // Update the config (for this session, if you want it persistent, consider using localStorage)
    processConfig["site.theme"] = newTheme;

    // Update the stylesheet link
    const themeStyle = document.getElementById("theme-style");
    themeStyle.href = `configs/styles/${newTheme}_theme/${newTheme}.css`;
}

document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
