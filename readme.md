## Getting Started

**Why?**: This was built as a starter theme to bring modern build tools and a modern workflow into Shopify development since Shopify Slate has been deprecated.
This starter theme is as stripped down as much as possible so you can start with a blank canvas.

**Pre-requisites**: Need to have [Shopify CLI 2.X.X](https://shopify.dev/themes/tools/cli) (for serve & share commands), [Node/NPM](https://nodejs.org/), [Gulp Cli](https://gulpjs.com/docs/en/getting-started/quick-start) installed. This should work for the latest versions of each but for trouble shooting I have the falling versions: npm(7.5.4) | node(v12.16.1^) | gulp(CLI version: 2.3.0,Local version: 4.0.2) | ThemeKit (1.1.6 darwin/amd64)

### Configuration

If you have all pre-requisites install from above then go ahead and download the latest release. After downloading the release/repo then `cd project-name` and run command `npm install`. This will install all of the development dependencies.

Go `.env.sample` fill in the values and remove the .sample extension:

```
# Sample env file, remove the .sample extension and fill in the values
STORE_URL='my-shopify-store.myshopify.com'
STORE_PASSWORD='shpat_e122110f8a000000dddeeff777'
STAGING_THEME_ID='12300000002'
LIVE_THEME_ID='12300000001'
```

Once you have the _`.env`_ setup you can run `yarn store:login` inside the projects root. This will start development on your dev theme by opening a preview link, starting shopify theme serve to watch for changes, and also start watching for changes in your _`src/`_ folder.

### Commands

List of commands you can use with npm

- `yarn serve` (recommended) opens auto generated development theme preview link, start watching src files, and has hot reloading etc...
- `yarn share` opens preview link from shopify serves auto generated dev theme
- `yarn dev` authenticate into your shopify store, start watching src files, & starts local dev server
- `yarn watch` watch development theme,
- `yarn open` open preview link for development theme
- `yarn sync:settings` download live settings_data.json and all json templates files to `/dist`
- `yarn build` generates css, js, and images
- `yarn build:prod` generates production ready css, js, images
- `yarn build:css` generates tailwind css
- `yarn build:js` generates development js
- `yarn build:img` compresses images in /src/images and places in assets
- `yarn watch` watches `/src` files for changes
- `yarn open` opens preview link for development theme

### Project Structure

```
├─ node_modules/
├─ dist/
│   ├─ assets/                   - built css and js files will be built here
│   └─ ...                       - where we edit liquid files
├─  src/                         - this src folder where we edit our js and sass files
│    ├─ images/                  - put images here for compression
│    │   ├─ placeholder.png
│    │   └─ ...                  - other images
│    ├─ js/
│    │   ├─ modules/             - place to put javascript modules
│    │   ├─ main.js              - main js files used across site
│    │   └─ ...                  - other pages of site js go here ie.e cart.js
│    ├─ styles/
│    │   ├─ lib/                 - place to put other css that should be separate from app.css
│    │   ├─ static/              - place to put static styles i.e. fonts
│    │   ├─ components/          - place to put css components
│    │   │   └─ button.css     - example of component
│    │   ├─ app.css            - main styles used across the site
│    │   └─ ...
│
├─ .env                          - config file for your shopify store, use .env.sample to get started
├─ gulpfile.js                   - use this to edit build pipelines if needed
├─ theme.update                  - used for browser-sync, gets changed on theme kit watch
└─  ...
```

### Work Flow & More Structure

_The development process_

1.  You have two options either `yarn dev` which will open a preview link, start theme watch on your _`/dist`_ files, and start watching for changes in your _`/src`_ files or if you want to get _auto reloading_ with Shopify CLI's dev command, run `yarn watch` to start watching both your _`/src`_ and _`/dist`_ folders.
2. At this point you have local dev working. I would recommend uaing [Shopify's github integration](https://shopify.dev/docs/themes/tools/github) to get preview links for new PRs and auto merges into main to live. Or right your own github actions to get your CI/CD flow the way you would like.

3.  Once you have verified the changes on your PR. You can deploy be merging into main. Again this functionality requires you install [Shopify's github integration](https://shopify.dev/docs/themes/tools/github) on your repo.

**Note if you use the github integration you need to change where your build files go. They need to be built into root. This also means you need to change any shopify cli commands ( sync:settings) to remove the path parameter (i.e. --path dist). To do change where the built files go into `gulpfile.js` and change the config object. Specfically change `dest` to be `./`.

``` javascript
const config = {
  srcImg: "src/images/**/*.{jpg,jpeg,png,gif,svg}",
  srcJS: "src/js/*.{js, jsx, ts, tsx}",
  srcStyles: "src/styles/*.css",
  rootDist: "dist/**/*.{liquid, json}",
  dest: "./",
};
```


**How to handle CSS and Javascript?**
So first off I should let you know that all built js and css files have `.min` suffix(ex. styles.min.css ). This means when you reference the file in liquid you need to include the suffix. I have two theories on how a project should handle the CSS and Javascript files depending on your needs.

If you have a lot of different features/styles per page I think this is the best approach. The main idea with Rollup is to have one js file per page. To keep the global scope clear rollup builds your files within an immediately invoked function expression. This means we can't stack script tags on top of one another to have access variables and functions in each script.

The only option is to put all your first-party js into one file. If you have code that's only gonna be used on certain pages and don't want to add it where it isn't needed then you need to make a script per page needed and then one script that has your js that you share across the site. As an example, let's say you only have custom js for the index, product, and collection page. The rest of your site shares the same code.

To do this you want to create 4 js files (index.js, collection.js, product.js, main.js) in `/src/js/`, and one module called shared.js in `/src/jsmodules`. You will import the shared.js module in all 4 script files since it will contain the code you need across all pages. You will then go into theme.liquid and write an if statement that imports the script for the page you are on or else just imports main.js. For example, if the user is on the product page import product.js and nothing else. If the user is on the about us page import main.js and nothing else. This will keep your bundle as small as possible along with Rollup's built-in tree-shaking. This same theory works for CSS though you do get cascading with the CSS so you can have more than one file per page if you want.

If you don't have a lot of features and functions you can just import one script and style file for the entire site. This is pretty much already set up in the site with main.js and styles.scss

### Rollup

[Rollup](https://rollupjs.org/guide/en/) is used to bundle [ES6 javascript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) within other files and use in the browser. This also performs tree shaking so it's only imports what we use.
We can import form node_modules but usually tree shaking doesn't work as it used commonJS. You can read the difference [here](https://sazzer.github.io/blog/2015/05/12/Javascript-modules-ES5-vs-ES6/). Rollup also has other plugins we can add as needed.
Rollup is configured in `*gulpfile.js`\*

### \*Note

I got the shopify theme files (_`/dist/`_) from another git repo. I tried to clean up the files and include all the minimum required files that shopify needs.
You can replaced the entire contents of the _`/dist`_ folder with any shopify starter theme. Just make sure it's the same structure(i.e. _`/dist/assets`_, _`/dist/snippets`_, etc...).Please let me know if I missing any files or base code that is needed.

P.S. I currently don't have the _`layout/checkout.liquid`_ since that's for _Shopify Plus+_ only. You can also add this yourself.
