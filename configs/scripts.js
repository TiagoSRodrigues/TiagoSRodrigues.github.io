let currentTheme = "light";  // Default theme to set the initial value

async function parseConfig() {
    try {
        const response = await fetch('configs/config.json');
        const config = await response.json();
        processConfig(config);
        await generateSidebar();
        loadContent("1-Understanding_DevOps.md");
    } catch (error) {
        console.error('Error fetching config.json:', error);
    }
}

function processConfig(config) {
    const siteTitle = config.site.title;
    const siteDescription = config.site.description;
    currentTheme = config.site.theme;

    document.getElementById("site-title").innerText = siteTitle;

    // Set initial theme
    const themeStyle = document.createElement("link");
    themeStyle.rel = "stylesheet";
    themeStyle.id = "theme-style";
    themeStyle.href = `configs/styles/${currentTheme}_theme/${currentTheme}.css`;
    document.head.appendChild(themeStyle);
}

async function generateSidebar() {
    const sidebar = document.getElementById("sidebar");
    const contentFiles = await loadContentFiles();
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

function convertMarkdownToHTML(markdown) {
    return window.marked.marked(markdown);
}

function toggleTheme() {
    currentTheme = currentTheme === "dark" ? "light" : "dark";

    // Update the theme CSS link
    const themeStyle = document.getElementById("theme-style");
    themeStyle.href = `configs/styles/${currentTheme}_theme/${currentTheme}.css`;

    // Update the data-theme attribute and localStorage
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
}

async function loadContentFiles() {
    try {
        const response = await fetch('configs/manifest.json');
        const files = await response.json();
        return files;
    } catch (error) {
        console.error("Error fetching the manifest:", error);
        return [];
    }
}

// Initialize service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Comment out the below code if the theme toggle button is not available in your HTML

// Call the main function to start parsing the config
parseConfig();

let lastScrollTop = 0;

window.addEventListener("scroll", function () {
    let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop == 0) {
        // At top of the page, show big header and hide small header
        document.getElementById("big-header").style.top = "100px";
        document.getElementById("small-header").style.top = "0";
    } else if (currentScrollTop <= lastScrollTop) {
        // Scrolling up
        document.getElementById("small-header").style.top = "0";
        document.getElementById("big-header").style.top = "-90px";  // or whatever the height of the big header is
    } else {
        // Scrolling down
        document.getElementById("small-header").style.top = "-60px";
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
});
document.getElementById("theme-toggle").addEventListener("change", function () {
    toggleTheme();
});

document.addEventListener('DOMContentLoaded', function () {
    const themeSwitch = document.querySelector('.dark-mode-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme') || "light"; // Default to light if no theme is stored

    // Set the initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Update the theme CSS link to match the initial theme
    const themeStyle = document.getElementById("theme-style");
    themeStyle.href = `configs/styles/${currentTheme}_theme/${currentTheme}.css`;

    if (currentTheme === 'dark') {
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', function (event) {
        toggleTheme(); // Use the toggleTheme function
    });
});