# Building a Dynamic Site: A Step-by-Step Guide

Hello, readers! In this article, I'll walk you through the steps taken to build an interactive website. We've had quite a journey, and I'm eager to share the intricate details, decisions, and the architecture behind it. Let's dive in!

## Table of Contents

- Introduction
- Project Overview
- Setting Up the UI
  - Header & Theme Toggle
  - Dynamic Font Size Adjustment
- Cache and Versioning
- Conclusion

## Introduction

When creating a dynamic, user-friendly website, it's essential to consider both the user experience and the maintainability of the code. In this project, we incorporated multiple features such as dynamic font size adjustments, dark mode, versioning, and more.

## Project Overview

Our primary aim was to craft a website that's easy to use and adjust based on user preferences while ensuring it remains up-to-date with the latest content.

### Architecture


## Setting Up the UI

### a. Header & Theme Toggle

A concise header displaying the site's name along with a switch to toggle between light and dark modes. The dark mode enhances usability, especially in low-light conditions.

```markdown
<header id="small-header">
    <div id="name">Tiago's notes</div>
    <label class="dark-mode-switch" for="theme-toggle">
        <input type="checkbox" id="theme-toggle" />
        <span class="slider round"></span>
    </label>
    <div>Dark Mode</div>
</header>
