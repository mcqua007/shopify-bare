 ## Getting Started ##

 **Pre-requisites**: Need to have [Shopify Theme Kit](https://shopify.github.io/themekit/), [Node/NPM](https://nodejs.org/), [Gulp Cli](https://gulpjs.com/docs/en/getting-started/quick-start) installed.
 
 #### Configuration ####
After cloning repo then `cd project-name` and run command `npm install`.
This will install all of the build dependencies.

 Go to `dist/` folder and place your `config.yml` with the live theme and development theme (live should come after development):
```
#development config
development:
  theme_id: [development_theme_id]
  password: [password]
  store: [store_url]

#live/ production
live:
  theme_id: [live_theme_id]
  password: [password]
  store: [store_url]
  read-only: true
```
  Once you have the `config.yml` setup you can run `npm run dev` inside the projects root. This will start development on your dev theme by opening a preview link, starting themekit to watch for changes, and also start watching for changes in your `src/` folder.

#### Commands ####
  List of commands you can use with npm:
 - `npm run dev` opens development theme preview link, start watching src files, and starts theme kit watch
 - `npm run dev:deploy` deploy your development theme
 - `npm run dev:watch` watch development theme,
 - `npm run dev:open` open preview link for development theme
 - `npm run dev:download` downlaod all development theme files
 - `npm run live:deploy` deploy to live (first must chage read only to fals - in `config.yml`
 - `npm run live:download` download all live theme files

 #### Project Structure ####
 ```
  node_modules/
  dist/
   ├─ assets/                 - built css and js files  go here
   ├─ config.yml              - where shopify's config file gets placed
   └─ ...                     - where we edit liquid files
  src/                        - this src folder where we edit our js and sass files
   ├─ js/
   │    ├─ modules/           - place to put javascript modules
   │    ├─ main.js            - main js files used across site
   │    └─ ...                - other pages of site js go here ie.e cart.js
   ├─ sass/ 
   │    ├─ modules/           - place to put scss modules
   │    ├─ styles.scss        - main styles used across the site
   │    ├─ _headers.scss      - example of partials starts with _
   │    └─ ...     
   ├─ tmp/                    - used for temp output from gulp, i.e. rejected css          
   ├─ gulpfile.js             - use this to edit build pipelines if needed
   └─ ... 
 ```
#### Rollup ####
 [Rollup](https://rollupjs.org/guide/en/) is used to bundle [ES6 javascript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) within other files and use in the browser. This also performs tree shaking so it's only imports what we use.
 We can import form node_modules but usually tree shaking doesn't work as well so the bundle size is larger. Rollup also has other plugins we can add as needed.
 Rollup is configured in gulpfile.js

#### PurgeCSS ####

 [PurgeCSS](https://purgecss.com/) looks at the .liquid files in the `/dist` folder as well as at .js files in `/src/js/` folder. It will look for any css selectors and not strip those out of the generated css. That means that any css selectors not in the .js or .liquid files (in their respective directories) will be removed from the css automatically upon each generation of that file. To see what selectors are being stipped we can run `gulp rejectedCSS`. This will generated the related css files in `/src/tmp/`. 

 The way PurgeCSS parses js files is by making each word a selector. This is helpfull because it gets all css that needs to stay in stylesheets but sometimes can leave css that isn't being used (though this seems rare). 

 **Example:** If we had no paragrpah tags in the .liquid files but had a pragraph as a selector for some stlyes i.e. ` p { color: red}`. We would want this removed because it isn't in use, but if we have a variable in js all named p (i.e. `var p = 2;`) it may not remove it from the css. 
