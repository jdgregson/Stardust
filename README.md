# Stardust
Stardust is a lightweight web application framework. I made Stardust to serve as a bootstrap application for my future web apps. Stardust gives my apps a minimal build environment, some common UI elements, and a small library of JavaScript functions.

## Demo
View the [Stardust Demo](https://jdgregson.github.io/Stardust/).

## Highlights
- Responsive design
- No production dependencies
- TypeScript support compiling to ES5
- SCSS support
- PWA support
- Build scripts for TypeScript, SCSS, and copying files

## UI and UX features
- Title bar
- Side menu
- Dark and light theme
- Loading bar
- Modal window
- Toasts

## How to build a Stardust app

### 1. Copy Stardust files
You need a copy of the code in this repository, which you can get by downloading a ZIP file of the [latest version](https://github.com/jdgregson/Stardust/archive/refs/heads/main.zip). Once downloaded, extract the Stardust files to your projects directory and change the name of the "Stardust" or "Stardust-main" folder to the name of your new app.

### 2. Install dev dependencies
You'll need to have NodeJS installed (last tested with v16, but you should use at least Node v14). Once Node is installed and working, open a terminal in the root of your project directory and run `npm install` to install development dependencies.

### 3. Initialize Stardust
Open a terminal in the root of your project directory and run `npm run stardust-init` to initialize Stardust and follow the prompts. This changes the app's name and description from the Stardust default to whatever they should be for your app.

### 4. Build ~~Stardust~~ your app
To build your new app using Stardust, open a terminal in the root of your project directory and run `npm run build`. This will compile all of the TypeScript and SCSS files, and copy them over to the `build` directory.

### 5. Update README and icons
Don't forget to replace the contents of the README.md file (this file) with the README of your project. Also, it might be a good idea to add your own icons to `src/art` and remove any demo files such as `hello-diff.png`.

### 6. Develop your app
Now you can start developing your app. The general idea is that your main UI code goes in `src/index.html`, your CSS goes in `src/css/_app.css`, and your TypeScript goes in `src/js/app.ts`. You're obviously free to add any other files and scripts that you need as long as you remember to include them in `src/index.html`.

You can run `npm run build-watch` to continuously build your app as you develop, or `npm run build` to run a one-off build.
