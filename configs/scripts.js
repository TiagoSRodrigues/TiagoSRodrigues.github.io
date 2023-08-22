/* 
 * Filename: script.js
 * Version: 1.0.4
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
    personalHeader.innerText = " 🤠 Personal Articles";
    const personalList = document.createElement("ul");
    const personalFiles = await loadContentFiles("personal");
    for (const file of personalFiles) {
        const title = await extractTitleFromMd(`personal/${file}`);
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#/personal/${file}`;
        link.innerText = title || file.replace(/\.md$/, '').replace(/^[0-9]-/, '').replace(/_/g, ' ');  // Use title if available, else fallback to filename
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
    contentHeader.innerText = "📜 Content Articles";
    const contentList = document.createElement("ul");
    const contentFiles = await loadContentFiles("content");
    for (const file of contentFiles) {
        const title = await extractTitleFromMd(`content/${file}`);
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#/content/${file}`;
        link.innerText = title || file.replace(/\.md$/, '').replace(/^[0-9]-/, '').replace(/_/g, ' ');  // Use title if available, else fallback to filename
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


// New function to extract title from .md content
async function extractTitleFromMd(filePath) {
    const content = await fetch(filePath).then(res => res.text());
    const titleMatch = content.match(/title: "(.*?)"/);
    return titleMatch ? titleMatch[1].substring(0, 40) : null; // Limit title to 40 characters
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
    } else if (fileName.includes("content/")) {
        contentPath = `content/${fileName.split("content/")[1]}`;

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
    let sidebar = document.getElementById('sidebar');

    if (sidebar.style.display === 'none' || sidebar.style.display === '') {
        sidebar.style.display = 'block';  // Show the sidebar
        // console.log("DEBUG sidebar",sidebar.style.display)
    } else {
        sidebar.style.display = 'none';   // Hide the sidebar
        // console.log("DEBUG sidebar",sidebar.style.display)
    }
}



let lastScrollTop = -10;
// Ensure correct header is visible based on scrolling direction
function manageHeadersOnScroll() {

    window.addEventListener("scroll", function () {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // console.log("DEBUG scroll", currentScrollTop, lastScrollTop);
        if (currentScrollTop == 0) {
            // At top of the page, show small header
            document.getElementById("small-header").style.top = "0";
            document.getElementById("big-header").style.top = "0px";  // or whatever the height of the big header is
        } else if (currentScrollTop <= lastScrollTop + 5) {
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
    // document.getElementById('menu-toggle-btn').addEventListener('click', toggleMobileMenu);

    // Event listener for scroll to manage headers
    window.addEventListener("scroll", manageHeadersOnScroll);

    // Initialize favicon
    createFavicon();

    // Check version and update if needed
    // checkVersionAndUpdate();

    // console.log("scripts.js is initialized and running");
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

// async function getReferenceVersion() {
//     const response = await fetch(REFERENCE_VERSION_URL);
//     const data = await response.json();
//     console.log("DEBUG reference_config", data)

//     return data.site.file_versions;
// }
async function getReferenceConfig() {
    const response = await fetch(REFERENCE_VERSION_URL);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

// async function checkFileVersions() {
//     const referenceVersion = await getReferenceVersion();
//     // Use Promise.all to batch requests
//     const checkPromises = FILES_TO_CHECK.map(fileURL => checkFileVersion(fileURL, referenceVersion));

//     await Promise.all(checkPromises);
//}
async function checkFileVersions() {
    const config = await getReferenceConfig();
    const fileVersions = config.file_versions;
    // Flattening file_versions for easier lookup
    const flatFileVersions = flattenFileVersions(fileVersions);
    for (let fileURL of FILES_TO_CHECK) {
        checkFileVersion(fileURL, flatFileVersions[fileURL]);
    }
}


function flattenFileVersions(obj, parent = "", result = {}) {
    for (let key in obj) {
        if (typeof obj[key] === "object") {
            flattenFileVersions(obj[key], parent + key + "/", result);
        } else {
            result[parent + key] = obj[key];
        }
    }
    return result;
}



async function checkFileVersion(fileURL, expectedVersion) {
    if (!expectedVersion) return;  // if the file version is not listed in the config, skip it


    const response = await fetch(fileURL);
    const content = await response.text();
    const version = extractFileVersion(content, fileURL);

    // console.log("DEBUG: cachedVersions", expectedVersion, "version", version, "fileURL", fileURL)

    if (version !== expectedVersion) {
        console.warn(`Outdated file: ${fileURL}. Expected version: ${expectedVersion}. Found: ${version}. The cache will be refreshed!`);
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
            versionPattern = /<!--\s*\*.*Version:\s*(\d+\.\d+\.\d+).*-->/s;
            break;
        case fileURL.endsWith('.html'):
            versionPattern = /<!--\s*\*.*Version:\s*(\d+\.\d+\.\d+).*-->/s;
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


// Call checkFileVersions every minute
setInterval(checkFileVersions, 60 * 1000);


// Add version to the footer
document.addEventListener("DOMContentLoaded", function () {
    fetch('/configs/config.json')
        .then(response => {
            // Check if the fetch was successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Get the footer element
            const footer = document.getElementById('sticky-footer');

            // Create a div to append the version to the footer
            const versionDiv = document.createElement('div');
            versionDiv.textContent = `by Tiago Silva Rodrigues   |   Version: ${data.site.version}`;

            // Append the version div to the footer
            footer.appendChild(versionDiv);
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error.message);
        });
});