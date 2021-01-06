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