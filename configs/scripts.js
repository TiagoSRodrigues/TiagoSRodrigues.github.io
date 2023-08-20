let currentTheme = "light";  // Default theme to set the initial value

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

async function fetchConfig() {
    const response = await fetch('configs/config.json');
    return await response.json();
}

function processConfig(config) {
    const siteTitle = config.site.title;
    currentTheme = config.site.theme;
    document.getElementById("site-title").innerText = siteTitle;
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
    const storedTheme = localStorage.getItem('theme') || "light";
    if (storedTheme === "dark") {
        themeSwitch.checked = true;
    }
    updateTheme(storedTheme);

    themeSwitch.addEventListener('change', function (event) {
        if (event.target.checked) {
            currentTheme = "dark";
        } else {
            currentTheme = "light";
        }
        updateTheme(currentTheme);
    });
});

// Initialize everything
parseConfig();
console.log("scripts.js is running");
