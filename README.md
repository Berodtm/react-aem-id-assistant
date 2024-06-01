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

json

"homepage": "https://Berodtm.github.io/react-aem-id-assistant/",

### Update the scripts section:

json

"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

### Open vite.config.js and add the following at the top (above plugins):

js

base: "/react-aem-id-assistant/",

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
Just copy the above content and paste it into a new file named README.md in your project directory.
