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
    themeStyle.href = currentTheme === 'dark' ? 'configs/styles/dark_theme/dark.css' : 'configs/styles/base_style.css';
    document.head.appendChild(themeStyle);
}

async function generateSidebar() {
    const sidebar = document.getElementById("sidebar");
    const configResponse = await fetch('configs/config.json');
    const config = await configResponse.json();

    // 1. Create and append the personal presentation section
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

    // Add Social Icons
    const socialDiv = document.createElement("div");
    socialDiv.classList.add("social-icons");

    // Github Icon and Link
    const githubLink = document.createElement("a");
    githubLink.href = config.social.github.url;
    githubLink.target = "_blank";
    githubLink.rel = "noopener noreferrer";

    const githubIcon = document.createElement("img");
    githubIcon.src = config.site_assets.github_icon;
    githubIcon.alt = "Github";
    githubIcon.classList.add("social-icon");

    githubLink.appendChild(githubIcon);
    githubLink.innerHTML += " " + config.social.github.label;  // Added label text

    socialDiv.appendChild(githubLink);

    // Linkedin Icon and Link
    const linkedinLink = document.createElement("a");
    linkedinLink.href = config.social.linkedin.url;
    linkedinLink.target = "_blank";
    linkedinLink.rel = "noopener noreferrer";

    const linkedinIcon = document.createElement("img");
    linkedinIcon.src = config.site_assets.linkedin_icon;
    linkedinIcon.alt = "LinkedIn";
    linkedinIcon.classList.add("social-icon");

    linkedinLink.appendChild(linkedinIcon);
    linkedinLink.innerHTML += " " + config.social.linkedin.label;  // Added label text

    socialDiv.appendChild(linkedinLink);
    presentationSection.appendChild(socialDiv);

    sidebar.appendChild(presentationSection);

    // 2. Create and append the personal articles section
    const personalArticlesSection = document.createElement("section");
    personalArticlesSection.classList.add("personal-articles-section");

    const personalHeader = document.createElement("h3");
    personalHeader.innerText = "Personal Articles";

    const personalList = document.createElement("ul");
    const personalFiles = await loadPersonalContentFiles();
    personalFiles.forEach(file => {
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
    });

    personalArticlesSection.appendChild(personalHeader);
    personalArticlesSection.appendChild(personalList);
    sidebar.appendChild(personalArticlesSection);


}




// You'd need a function similar to loadContentFiles but for /personal articles
async function loadPersonalContentFiles() {
    // Logic here similar to loadContentFiles but targeting /personal articles.
    // For this mockup, I'll assume all content files are personal, you'd need to adjust this.
    return await loadContentFiles();
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

    // Update the theme CSS link
    const themeStyle = document.getElementById("theme-style");
    themeStyle.href = currentTheme === 'dark' ? 'configs/styles/dark_theme/dark.css' : 'configs/styles/base_style.css';

    // Update the data-theme attribute and localStorage
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
}

async function loadContentFiles() {
    try {
        const response = await fetch('configs/manifest.json');
        const files = await response.json();
        return files.other;
    } catch (error) {
        console.error("Error fetching the manifest:", error);
        return [];
    }
}

async function loadPersonalContentFiles() {
    try {
        const response = await fetch('configs/manifest.json');
        const files = await response.json();
        return files.personal;
    } catch (error) {
        console.error("Error fetching the personal manifest:", error);
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
    themeStyle.href = currentTheme === 'dark' ? 'configs/styles/dark_theme/dark.css' : 'configs/styles/base_style.css';

    if (currentTheme === 'dark') {
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', function (event) {
        toggleTheme(); // Use the toggleTheme function
    });
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
