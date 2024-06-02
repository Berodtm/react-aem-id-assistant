# AEM ID Assistant (Rebuilt in React)
## Overview
The AEM ID Assistant is a React-based tool designed for managing Adobe Experience Manager (AEM) assets. It simplifies the process of identifying and constructing URLs based on AEM IDs, ensuring correct device and brand type detection, and facilitating quick access to AEM resources.
## Technology Used
- **React.js**: JavaScript library for building user interfaces.
- **Vite**: Next-generation frontend tooling for fast builds and hot module replacement.
- **JavaScript**: Programming language used for the logic.
- **JSX**: Syntax extension for JavaScript, used in React to describe what the UI should look like.
- **HTML**: Markup language for structuring the web content.
- **CSS**: Styling language for designing the user interface.
- **npm (Node Package Manager)**: Tool for managing project dependencies.
- **GitHub Pages**: Hosting service for the live demo.
- **AEM API**: Adobe Experience Manager API for interacting with AEM assets.
## Features
- **Device Type Detection**: Identifies the device type (e.g., App, Desktop, Mobile Browser) from AEM IDs.
- **Brand Type Detection**: Determines brand type from AEM IDs.
- **Asset Type Validation**: Validates asset types against a predefined list.
- **URL Construction**: Generates specific URLs for different AEM asset types.
- **Error Handling**: Provides visual feedback and error messages for mismatches and issues.
## Usage
Access the tool through the following link to manage your AEM assets effectively:
[Live Demo of AEM Asset Manager](https://berodtm.github.io/react-aem-id-assistant/)
## How to Use
1. **Enter AEM ID**: Input the AEM ID into the designated field.
2. **Process Information**: Click the 'Submit' button to process the AEM ID.
3. **Review Output**: The tool displays device type, brand, asset type, and relevant URLs.
4. **Error Feedback**: Displays error messages for any detected mismatches or issues.

## Navigate to your project directory:

```sh

cd path/to/your/react-aem-id-assistant
```
### Install the project dependencies:

```sh

npm install
```
## Deploying to GitHub Pages

### Install the gh-pages package:

```sh

npm install --save-dev gh-pages
```

### Open package.json and add the following:

### Add the homepage field at the top:

```json

"homepage": "https://Berodtm.github.io/react-aem-id-assistant/",
```
### Update the scripts section:

```json

"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```
### Open vite.config.js and add the following at the top (above plugins):

```js

base: "/react-aem-id-assistant/",
```
### Run the following Git commands:

```sh

git init
git add .  # (or specific files)
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Berodtm/react-aem-id-assistant.git  # Use your repo link from the start, not the homepage.io link
git push -u origin main
npm run deploy
```
Check GitHub Actions, and the workflow should deploy. Click the URL it provides or the URL from the Pages section.

## Making Edits

To make an edit to the page after adding files, enter the following commands:

```sh

git add .
git commit -m "First edit"
git push
npm run deploy
```
## Running the Dev Server

To check the preview server, enter the command:

```sh

npm run dev
```
