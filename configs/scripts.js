/* 
 * Filename: script.js
 * Version: 1.0.0
 * Date: 2023-08-19
 * Description: This script handles the scroll behavior of headers.
 */

// The initial theme
let currentTheme = "light";

// -------------- CONFIGURATION & INITIALIZATION ----------------

// Parse the configuration
async function parseConfig() {
    try {
        const config = await fetchConfig();
        processConfig(config);
        await generateSidebar(config);
        loadContent("personal/hello.md");
    } catch (error) {
        console.error('Error fetching config.json:', error);
    }
}

// Fetch the configuration JSON
async function fetchConfig() {
    const response = await fetch('configs/config.json');
    return await response.json();
}

// Process the configuration data
function processConfig(config) {
    const siteTitle = config.site.title;
    currentTheme = config.site.theme;
    document.getElementById("site-title").innerText = siteTitle;
    updateTheme(currentTheme);
}

// Update the website's theme based on user's choice or default
function updateTheme(theme) {
    const themeStyle = document.getElementById("theme-style");
    themeStyle.href = theme === 'dark' ? 'configs/styles/dark.css' : 'configs/styles/base_style.css';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Generate the sidebar with personal information and articles
async function generateSidebar(config) {
    const sidebar = document.getElementById("sidebar");

    // 1. Personal Presentation Section
    const presentationSection = document.createElement("section");
    presentationSection.classList.add("presentation-section");
    const profileImg = document.createElement("img");
    profileImg.src = config.author.avatar;
    profileImg.alt = config.author.name;
    profileImg.classList.add("profile-picture");
    const nameHeader = document.createElement("h2");
    nameHeader.innerText = config.author.name;
    const shortBio = document.createElement("p");
    shortBio.innerText = config.author.bio;
    presentationSection.appendChild(profileImg);
    presentationSection.appendChild(nameHeader);
    presentationSection.appendChild(shortBio);

    const socialDiv = document.createElement("div");
    socialDiv.classList.add("social-icons");
    const githubLink = document.createElement("a");
    githubLink.href = config.social.github.url;
    githubLink.target = "_blank";
    githubLink.rel = "noopener noreferrer";
    const githubIcon = document.createElement("img");
    githubIcon.src = config.site_assets.github_icon;
    githubIcon.alt = "Github";
    githubIcon.classList.add("social-icon");
    githubLink.appendChild(githubIcon);
    githubLink.innerHTML += " " + config.social.github.label;
    socialDiv.appendChild(githubLink);
    const linkedinLink = document.createElement("a");
    linkedinLink.href = config.social.linkedin.url;
    linkedinLink.target = "_blank";
    linkedinLink.rel = "noopener noreferrer";
    const linkedinIcon = document.createElement("img");
    linkedinIcon.src = config.site_assets.linkedin_icon;
    linkedinIcon.alt = "LinkedIn";
    linkedinIcon.classList.add("social-icon");
    linkedinLink.appendChild(linkedinIcon);
    linkedinLink.innerHTML += " " + config.social.linkedin.label;
    socialDiv.appendChild(linkedinLink);
    presentationSection.appendChild(socialDiv);

    sidebar.appendChild(presentationSection);

    // 2. Personal Articles Section
    const personalArticlesSection = document.createElement("section");
    personalArticlesSection.classList.add("personal-articles-section");
    const personalHeader = document.createElement("h3");
    personalHeader.innerText = "Personal Articles";
    const personalList = document.createElement("ul");
    const personalFiles = await loadContentFiles("personal");
    for (const file of personalFiles) {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#/personal/${file}`;
        link.innerText = file.replace(/\.md$/, '').replace(/^[0-9]-/, '').replace(/_/g, ' ');
        link.addEventListener("click", function (event) {
            event.preventDefault();
            loadContent(`personal/${file}`);
        });
        listItem.appendChild(link);
        personalList.appendChild(listItem);
    }
    personalArticlesSection.appendChild(personalHeader);
    personalArticlesSection.appendChild(personalList);
    sidebar.appendChild(personalArticlesSection);

    // 3. Content Articles Section
    const contentArticlesSection = document.createElement("section");
    contentArticlesSection.classList.add("content-articles-section");
    const contentHeader = document.createElement("h3");
    contentHeader.innerText = "Content Articles";
    const contentList = document.createElement("ul");
    const contentFiles = await loadContentFiles("content");
    for (const file of contentFiles) {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#/content/${file}`;
        link.innerText = file.replace(/\.md$/, '').replace(/^[0-9]-/, '').replace(/_/g, ' ');
        link.addEventListener("click", function (event) {
            event.preventDefault();
            loadContent(`content/${file}`);
        });
        listItem.appendChild(link);
        contentList.appendChild(listItem);
    }
    contentArticlesSection.appendChild(contentHeader);
    contentArticlesSection.appendChild(contentList);
    sidebar.appendChild(contentArticlesSection);
}

// Fetch the list of content files
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

// Fetch and display content in the main section
function loadContent(fileName) {
    let contentPath;
    if (fileName.includes("personal/")) {
        contentPath = `personal/${fileName.split("personal/")[1]}`;
    } else {
        contentPath = `/${fileName}`;
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

// -------------- INTERACTIONS ----------------

// Toggle the theme between light and dark
function toggleTheme() {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    updateTheme(currentTheme);
}

// Show/Hide mobile menu
function toggleMobileMenu() {
    let menu = document.getElementById('mobile-menu');
    if (menu.style.width === '0px' || menu.style.width === '') {
        menu.style.width = '250px';
    } else {
        menu.style.width = '0px';
    }
}

// Check version and update if needed
// async function checkVersionAndUpdate() {
//     try {
//         // Fetch remote config
//         const response = await fetch('https://raw.githubusercontent.com/TiagoSRodrigues/TiagoSRodrigues.github.io/main/configs/config.json');
//         if (!response.ok) {
//             throw new Error("Failed to fetch remote config");
//         }
//         const remoteConfig = await response.json();

//         // Fetch local config
//         const localConfig = await fetchLocalConfig();
//         if (!localConfig) {
//             throw new Error("Failed to get local config");
//         }

//         if (localConfig.site.version !== remoteConfig.site.version) {
//             if (localStorage.getItem('triedFetchingNewVersion')) {
//                 // If we've already tried fetching the new version once, do not attempt again.
//                 console.log("Tried fetching new version previously. Not trying again to avoid infinite loop.");
//                 return;
//             }

//             console.log("Version mismatch detected. Clearing cookies and reloading the page.");

//             // Clear all cookies
//             const cookies = document.cookie.split(";");
//             for (let i = 0; i < cookies.length; i++) {
//                 const cookie = cookies[i];
//                 const eqPos = cookie.indexOf("=");
//                 const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//                 document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
//             }

//             // Set a flag in localStorage indicating that we've tried refreshing due to version mismatch
//             localStorage.setItem('triedFetchingNewVersion', 'true');

//             // Reload the page
//             location.reload();
//             await sleep(30000);  // Sleeps for 2 minutes (120000 milliseconds)

//         } else {
//             // If versions match, clear the localStorage flag
//             localStorage.removeItem('triedFetchingNewVersion');
//         }

//     } catch (error) {
//         // Only log the error
//         console.error("Error checking the version:", error);
//     }
// }

// Ensure correct header is visible based on scrolling direction
function manageHeadersOnScroll() {
    let lastScrollTop = 0;

    window.addEventListener("scroll", function () {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop == 0) {
            // At top of the page, show small header
            document.getElementById("small-header").style.top = "0";
            document.getElementById("big-header").style.top = "0px";  // or whatever the height of the big header is
        } else if (currentScrollTop <= lastScrollTop) {
            // Scrolling up, show small header
            document.getElementById("small-header").style.top = "0";
            document.getElementById("big-header").style.top = "-90px";  // or whatever the height of the big header is
        } else {
            // Scrolling down, hide small header
            document.getElementById("small-header").style.top = "-60px";  // assuming height of small header is 60px
        }

        lastScrollTop = currentScrollTop;
    });
}

// Set up a favicon based on the configuration
function createFavicon() {

    // Fetch the configuration JSON
    fetch('configs/config.json')
        .then(response => response.json())
        .then(config => {
            const faviconPath = config.site.favicon;

            // Create a new link element for the favicon
            const linkEl = document.createElement('link');
            linkEl.rel = 'icon';
            linkEl.href = faviconPath;

            // Append the link element to the document's head
            document.head.appendChild(linkEl);
        });
}

// Utility function to pause execution for a given duration
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// -------------- INITIALIZATIONS & EVENT LISTENERS ----------------

// When the document is ready, set up event listeners and initialize states
document.addEventListener('DOMContentLoaded', function () {
    // Initialize everything
    parseConfig();

    // Set the theme based on user's preference or default
    const themeSwitch = document.querySelector('.dark-mode-switch input[type="checkbox"]');
    const storedTheme = localStorage.getItem('theme') || "light";
    if (storedTheme === "dark") {
        themeSwitch.checked = true;
    }
    updateTheme(storedTheme);

    // Event listener for theme toggling
    themeSwitch.addEventListener('change', toggleTheme);

    // Event listener for mobile menu toggling
    document.getElementById('menu-toggle').addEventListener('click', toggleMobileMenu);

    // Event listener for scroll to manage headers
    window.addEventListener("scroll", manageHeadersOnScroll);

    // Initialize favicon
    createFavicon();

    // Check version and update if needed
    // checkVersionAndUpdate();

    console.log("scripts.js is initialized and running");
});

// Service worker initialization for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}



// check files version


const FILES_TO_CHECK = getFilesFromWebsite();
const REFERENCE_VERSION_URL = "https://raw.githubusercontent.com/TiagoSRodrigues/TiagoSRodrigues.github.io/main/configs/config.json";

let cachedVersions = {};

function getFilesFromWebsite() {
    const files = new Set();

    // 1. Add CSS files
    document.querySelectorAll('link[rel="stylesheet"]').forEach(el => {
        const href = el.getAttribute('href');
        if (href) files.add(href);
    });

    // 2. Add JS files
    document.querySelectorAll('script[src]').forEach(el => {
        const src = el.getAttribute('src');
        if (src) files.add(src);
    });

    // 3. Add images, videos, and other media
    document.querySelectorAll('img, video, audio, source').forEach(el => {
        const src = el.getAttribute('src') || el.getAttribute('srcset');
        if (src) files.add(src);
    });

    // 4. Add current document (HTML)
    files.add(document.location.href);

    // 5. (Optional) Add other resources if needed

    return Array.from(files);
}

// const FILES_TO_CHECK = getFilesFromWebsite();

async function getReferenceVersion() {
    const response = await fetch(REFERENCE_VERSION_URL);
    const data = await response.json();
    return data.site.reference_config;
}

async function checkFileVersions() {
    const referenceVersion = await getReferenceVersion();

    // Use Promise.all to batch requests
    const checkPromises = FILES_TO_CHECK.map(fileURL => checkFileVersion(fileURL, referenceVersion));

    await Promise.all(checkPromises);
}

async function checkFileVersion(fileURL, referenceVersion) {
    if (fileURL in cachedVersions && cachedVersions[fileURL] === referenceVersion) {
        return;  // Skip checking this file
    }

    const response = await fetch(fileURL);
    const content = await response.text();
    const version = extractFileVersion(content, fileURL);

    if (version !== referenceVersion) {
        console.warn(`Outdated file: ${fileURL}. Expected version: ${referenceVersion}. Found: ${version}.`);
        caches.keys().then(function (names) {
            for (let name of names) caches.delete(name);
        });

    } else {
        // Cache the checked version
        cachedVersions[fileURL] = version;
    }
}

function extractFileVersion(content, fileURL) {
    let versionPattern;

    switch (true) {
        case fileURL.endsWith('.md'):
        case fileURL.endsWith('.html'):
            versionPattern = /<!--\s*version:\s*(\d+\.\d+\.\d+)\s*-->/;
            break;
        case fileURL.endsWith('.js'):
            versionPattern = /\/\/\s*version:\s*(\d+\.\d+\.\d+)/;
            break;
        case fileURL.endsWith('.css'):
            versionPattern = /\/\*\s*version:\s*(\d+\.\d+\.\d+)\s*\*\//;
            break;
        default:
            return null; // Ignore other file types
    }

    const match = content.match(versionPattern);
    return match ? match[1] : null;
}

// Call checkFileVersions every minute
setInterval(checkFileVersions, 60 * 1000);
