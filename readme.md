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
 - `dev` opens development theme preview link, start watcing src files, and starts themekit watch
 - `dev:deploy` deploy your dev theme
 - `dev:watch` watch development theme,
 - `dev:open` open preview link for development theme,
 - `dev:download` downlaod all development theme files,
 - `live:deploy` deploy to live (first must chage read only to fals - in config.yml",
 - `live:download` download all live theme files

 #### Project Structure ####
 ```
  node_modules/
  dist/
   ├─ assets/                 - built css and js files  go here
   ├─ config.yml              - where shopify's config file gets placed
   └─ ...                     - where we edit liquid files
  src/                        - this src folder where we edit our js and sass files
   ├─ js/
   │    ├─ modules/          - place to put javascript modules
   │    ├─ main.js           - main js files used across site
   │    └─ ...               - other pages of site js go here ie.e cart.js
   ├─ sass/
   │    ├─ modules/          - place to put scss modules
   │    ├─ styles.scss       - main styles used across the site
   │    ├─ _headers.scss     - example of partials starts with _
   │    └─ ...     
   ├─ tmp/                    - used for temp output from gulp, i.e. rejected css          
   ├─ gulpfile.js             - use this to edit build pipelines if needed
   └─ ... 
 ```