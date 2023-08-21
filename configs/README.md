# Configurations Directory

This directory houses configuration files, scripts, and styling assets essential for the website's functionality and appearance.

- `config.json`: Contains website-wide configurations.
- `scripts.js`: Includes the primary JavaScript functions and utilities.
- `styles/`: Hosts theme-specific style sheets and the base style.
    - `base_style.css`: The core CSS file with common styles.
    - `dark_theme`: Contains styling for the dark theme.
    


## Documentation for scripts.js

### Introduction:

The scripts.js file is responsible for managing dynamic content loading, themes, interactivity, versioning, and PWA capabilities for the website. It primarily fetches configuration from a JSON file, manages user interactions like theme switching and mobile menu toggling, and sets initial states and configurations for the website.

###  Overview:
The script consists of three main parts:

Configuration & Initialization: Functions that fetch configurations and initialize the website content.
Interactions: Functions that deal with user interactions, like theme switching or showing/hiding menus.
Initializations & Event Listeners: The section where event listeners are attached and initial setups are done when the page loads.


### Diagram 

```
scripts.js
|
|-- Configuration & Initialization
|   |-- parseConfig()
|   |-- fetchConfig()
|   |-- processConfig()
|   |-- updateTheme()
|   |-- generateSidebar()
|   |-- loadContentFiles()
|   |-- loadContent()
|   |-- convertMarkdownToHTML()
|   |-- fetchLocalConfig()
|
|-- Interactions
|   |-- toggleTheme()
|   |-- toggleMobileMenu()
|   |-- checkVersionAndUpdate()
|   |-- manageHeadersOnScroll()
|   |-- createFavicon()
|   |-- sleep()
|
|-- Initializations & Event Listeners
```
