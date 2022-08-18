 ## Getting Started ##
 **Why?**: This was built as a starter theme to bring modern build tools and a modern workflow into Shopify development since Shopify Slate has been deprecated. 
 This starter theme is as stripped down as much as possible so you can start with a blank canvas.

 **Pre-requisites**: Need to have [Shopify CLI](https://shopify.dev/themes/tools/cli) (for serve & share commands), [Shopify Theme Kit](https://shopify.github.io/themekit/), [Node/NPM](https://nodejs.org/), [Gulp Cli](https://gulpjs.com/docs/en/getting-started/quick-start) installed. This should work for the latest versions of each but for trouble shooting I have the falling versions: npm(7.5.4) | node(v12.16.1) | gulp(CLI version: 2.3.0,Local version: 4.0.2) | ThemeKit (1.1.6 darwin/amd64)
 
 ### Configuration ###
 If you have all pre-requisites install from above then go ahead and download the latest release. After downloading the release/repo then `cd project-name` and run command `npm install`. This will install all of the development dependencies.

 Go to `dist/` folder and place your *`config.yml`* with the live theme and development theme (live should come after development):
```
#development config
development:
  theme_id: [development_theme_id]
  password: [password]
  store: [store_url]

#staging config
staging:
  theme_id: [staging_theme_id]
  password: [password]
  store: [store_url]

#live/ production
live:
  theme_id: [live_theme_id]
  password: [password]
  store: [store_url]
  read-only: true

```
  Once you have the *`config.yml`* setup you can run `npm run dev` inside the projects root. This will start development on your dev theme by opening a preview link, starting themekit to watch for changes, and also start watching for changes in your *`src/`* folder.

### Commands ###
  List of commands you can use with npm
 - `npm run serve` (recommended) opens auto generated development theme preview link, start watching src files, and has hot reloading etc...
 - `npm run share` opens preview link from shopify serves auto generated dev theme
 - `npm run dev` opens development theme preview link, start watching src files, and starts theme kit watch
 - `npm run dev:deploy` deploy your development theme
 - `npm run dev:watch` watch development theme,
 - `npm run dev:open` open preview link for development theme
 - `npm run dev:open:pb` open preview link for development theme with preview bar
 - `npm run dev:download` download all development theme files to `/dist`
 - `npm run stage:deploy` deploys to development theme
 - `npm run stage` builds, deploys then opens preview to staging theme
 - `npm run stage:open` opens preview to staging theme
 - `npm run stage:open:pb` opens preview to staging theme but opens with preview bar
 - `npm run stage:deploy` deploys to staging theme
 - `npm run stage:download` downloads all staging files to `/dist`
 - `npm run live:deploy` deploy to live (first must change read only to false - in `config.yml`
 - `npm run live:download` download all live theme files to `/dist`
 - `npm run build` generates production ready css and js
 - `npm run build:dev` generates css and js with no minifier etc...
 - `npm run build:staging` generates production ready css and js (same as npm run build)
 - `npm run build:css` generates development css
 - `npm run build:js` generates development js
 - `npm run build:img` compresses images in /src/images and places in assets
 - `npm run watch` alias to **dev:watch**, watches /dist and /src files
 - `npm run watch:src` auto generates development code as you make changes to `/src` scss and js
 - `npm run watch:dist` start theme kit watch on `/dist` files to update theme on shopify
 - `npm run log:purgedCSS` genrates unused css selectors that were purged 
 - `npm run open` alias for **dev:open**, opens preview link for development theme
 - `npm run open:pb` alias for **dev:open:pb** open preview link for development theme with preview bar
 - `npm run bs` starts browser-sync which opens a proxy url on your dev theme for auto reloading etc...
 - `npm run autoreload` alias for **bs**, which starts browser-sync for hot reloading

 ### Project Structure ###
 ```
 ├─ node_modules/
 ├─ dist/
 │   ├─ assets/                   - built css and js files  go here
 │   ├─ config.yml                - where shopify's config file gets placed
 │   └─ ...                       - where we edit liquid files
 ├─  src/                         - this src folder where we edit our js and sass files
 │    ├─ images/                  - put images here for compression
 │    │   ├─ placeholder.png      
 │    │   └─ ...                  - other images
 │    ├─ js/
 │    │   ├─ modules/             - place to put javascript modules
 │    │   ├─ main.js              - main js files used across site
 │    │   └─ ...                  - other pages of site js go here ie.e cart.js
 │    ├─ sass/ 
 │    │   ├─ modules/             - place to put scss modules
 │    │   │   └─ _headers.scss    - example of partials starts with _
 │    │   ├─ styles.scss          - main styles used across the site
 │    │   ├─ product.scss         - example of template page sass
 │    │   └─ ...     
 │    └─ tmp/                     - used for temp output from gulp, i.e. rejected css
 │        ├─ styles.rejected.css  - shows all selectors that were purged from styles.scss
 │        └─ ...                  - other purged files       
 │  
 ├─ bs-config.js                  - broswer-sync config, add options to customize your needs
 ├─ gulpfile.js                   - use this to edit build pipelines if needed
 ├─ theme.update                  - used for browser-sync, gets changed on theme kit watch
 └─  ... 
 ```

 ### Work Flow & More Structure ###

 **Workflow**: We all know shopify doesn't support local development. This means the usually work flow starts with you going to your shopify store, duplicating the live theme, grabbing the id, then running `theme watch` to start watching your files for changes you make. Some people may watch their live theme directly, but what happens if the wrong branch or code gets uploaded to your live theme? You are screwed. 
 
The intended workflow of this project is to have 3 themes. Live(production), Staging, and Development. Once you have these 3 theme id's you can put them into the config as outlined below. 

*The development process*
 1. You have two options either `npm run dev` which will open a preview link, start theme watch on  your *`/dist`* files, and start watching for changes in your *`/src`* files or if you want to get *auto reloading* with Browser Sync, run `npm run watch` to start watching both your *`/src`* and *`/dist`* folders then open a new terminal tab and run `npm run bs` to start Browser Sync to get a link that will allow auto reload your site on file changes (among many other things)
 
 2. Once your changes look good on development the next step is to run `npm run stage`. This builds your files in production mode and deploys them to your staging theme. Then opens a preview to make sure changes are stable there. 
 
 3. Once you have verified the changes. You can deploy to live by running `npm run live:deploy`, this will confirm you actually want to deploy to live, enter y and watch your changes go live. 
 
 P.S. This project doesn't give you the command to watch live even though theme kit allows you to. You really should never watch live.

**How to handle CSS and Javascript?**
  So first off I should let you know that all built js and css files have `.min` suffix(ex. styles.min.css ). This means when you reference the file in liquid you need to include the suffix. I have two theories on how a project should handle the CSS and Javascript files depending on your needs.

 If you have a lot of different features/styles per page I think this is the best approach. The main idea with Rollup is to have one js file per page. To keep the global scope clear rollup builds your files within an immediately invoked function expression. This means we can't stack script tags on top of one another to have access variables and functions in each script.

 The only option is to put all your first-party js into one file. If you have code that's only gonna be used on certain pages and don't want to add it where it isn't needed then you need to make a script per page needed and then one script that has your js that you share across the site. As an example, let's say you only have custom js for the index, product, and collection page. The rest of your site shares the same code. 

  To do this you want to create 4 js files (index.js, collection.js, product.js, main.js) in `/src/js/`, and one module called shared.js in `/src/jsmodules`. You will import the shared.js module in all 4 script files since it will contain the code you need across all pages. You will then go into theme.liquid and write an if statement that imports the script for the page you are on or else just imports main.js. For example, if the user is on the product page import product.js and nothing else. If the user is on the about us page import main.js and nothing else. This will keep your bundle as small as possible along with Rollup's built-in tree-shaking. This same theory works for CSS though you do get cascading with the CSS so you can have more than one file per page if you want.
  
   If you don't have a lot of features and functions you can just import one script and style file for the entire site. This is pretty much already set up in the site with main.js and styles.scss

### Browser Sync (I would recommend using serve command instead) ###

[Browser Sync](https://browsersync.io) is enabled by running `npm run bs` (first you will want to start watching your files using `npm run watch`). This mainly allows us to use a proxy in order to get features such as auto reloading. You can read more about other features in the link above. I currently have a reload delay of 100ms because that's about hot long it seems for changes to be ready on Shopify's servers. This could be different for you and you can change it by editing the *reloadDelay* option in *`bs-config.js`*.

**One thing to note.** Shopify *force redirects* when you have a custom domain which can disconnect you from Browser Sync. This means clicking on any links when using broswer sync will try and redirect you to your site's custom domain. I fixed the issue for relative links (ex. /collections/shop-all) by writing a middleware function in *`bs-config.js`* that appends the don't force flag `_fd=0` on each link. If you need hardcoded links you can choose a [port to run Browser Sync](https://www.browsersync.io/docs/options/#option-port), then in the middleware options write logic that replaces the host with localhost and the port you chose. Make sure to keep the logic that appends the `_fd=0` flag.

### Rollup ###

 [Rollup](https://rollupjs.org/guide/en/) is used to bundle [ES6 javascript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) within other files and use in the browser. This also performs tree shaking so it's only imports what we use.
 We can import form node_modules but usually tree shaking doesn't work as it used commonJS. You can read the difference [here](https://sazzer.github.io/blog/2015/05/12/Javascript-modules-ES5-vs-ES6/). Rollup also has other plugins we can add as needed.
 Rollup is configured in `*gulpfile.js`*

### PurgeCSS ###

 [PurgeCSS](https://purgecss.com/) looks at the **.liquid** files in the *`/dist`* folder as well as at **.js** files in *`/src/js/`* folder. It will look for any css selectors and not strip those out of the generated css. That means that any css selectors not in the **.js** or **.liquid** files (in their respective directories) will be removed from the css automatically upon each generation of that file. To see what selectors are being stripped we can run `npm run log:purgedCSS`. This will generated the related css files in *`/src/tmp/`*. 

 The way PurgeCSS parses js files is by making each word a selector. This is helpful because it gets all css that needs to stay in stylesheets but sometimes can leave css that isn't being used (though this seems rare). 

 **Example:** If we had no paragraph tags in the .liquid files but had a paragraph as a selector for some styles i.e. ` p { color: red}`. We would want this removed because it isn't in use, but if we have a variable in js all named p (i.e. `var p = 2;`) it may not remove it from the css. 

### *Caveats ###

 This one isn't really that big of deal but, at this, I'm not watching the .liquid files with Gulp. This means JS and CSS builds don't get triggered when you only make a change to a *`.liquid`* file. Most of the time this is not an issue. The only issue I have noticed is if a CSS selector or class is purged and then you add it to a .liquid file to use then you have to trigger a CSS rebuild. The other solution is to have gulp rebuild CSS and possibly JS src files upon each *`.liquid`* file change. If you want to do this go to line 118 in *`gulpfile.js`* and change it to this `watch(config.deepSass, config.liquid, series('build:css'));`

### *Note ###
 I got the shopify theme files (*`/dist/`*) from another git repo. I tried to clean up the files and include all the minimum required files that shopify needs. 
 You can replaced the entire contents of the *`/dist`* folder with any shopify starter theme. Just make sure it's the same structure(i.e. *`/dist/assets`*, *`/dist/snippets`*,  etc...).Please let me know if I missing any files or base code that is needed. 
 
 P.S. I currently don't have the *`layout/checkout.liquid`* since that's for *Shopify Plus+* only. You can also add this yourself.