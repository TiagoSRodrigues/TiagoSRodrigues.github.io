let currentTheme = "light";  // Default theme to set the initial value

async function parseConfig() {
    try {
        const config = await fetchConfig();
        processConfig(config);
        await generateSidebar(config);
        loadContent("1-Understanding_DevOps.md");
    } catch (error) {
        console.error('Error fetching config.json:', error);
    }
}

async function fetchConfig() {
    const response = await fetch('configs/config.json');
    return await response.json();
}

function processConfig(config) {
    const siteTitle = config.site.title;
    currentTheme = config.site.theme;

    document.getElementById("site-title").innerText = siteTitle;

    // Set initial theme
    updateTheme(currentTheme);
}

function updateTheme(theme) {
    const themeStyle = document.getElementById("theme-style");
    themeStyle.href = theme === 'dark' ? 'configs/styles/dark_theme/dark.css' : 'configs/styles/base_style.css';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

async function generateSidebar(config) {
    const sidebar = document.getElementById("sidebar");
    // ... The rest of the code for generating sidebar remains unchanged
}

async function loadContentFiles(category) {
    try {
        const response = await fetch('configs/manifest.json');
        const files = await response.json();
        return files[category];
    } catch (error) {
        console.error(`Error fetching the ${category} manifest:`, error);
        return [];
    }
}

function loadContent(fileName) {
    let contentPath = `content/${fileName}`;
    if (fileName.includes("personal/")) {
        contentPath = `personal/${fileName.split("personal/")[1]}`;
    }

    fetch(contentPath)
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
    updateTheme(currentTheme);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const themeSwitch = document.querySelector('.dark-mode-switch input[type="checkbox"]');
    const storedTheme = localStorage.getItem('theme') || "light"; // Default to light if no theme is stored

    if (storedTheme === 'dark') {
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', toggleTheme);
});

window.addEventListener('error', async function (event) {
    console.log('Uncaught error detected:', event.error);

    // Clear all caches (assuming you're using Service Worker caches)
    if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
        }
    }

    // Clear localStorage
    localStorage.clear();

    // TODO: Clear other storage mechanisms here if used (like IndexedDB, sessionStorage)

    // Reload the page
    location.reload();
});

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

// Initialize everything
parseConfig();
console.log("scripts.js is running");
