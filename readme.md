 Need to have theme kit installed and have node.
 Download then run npm install.
 Go to dist/ and place your config.yml with the live theme and development theme (live should come after development):
  ```
#development config

development:
  theme_id: [development_theme_id]
  password: [password]
  store: brandhaus-dev.myshopify.com

#live/ production
live:
  theme_id: [live_theme_id]
  password: [password]
  store: brandhaus-dev.myshopify.com
  read-only: true

  ```
  Once you have the config.yml setup you can ```run npm run start```. This will open the preview link and start watch your theme files.
  You can also run npm run other commands such as:

    ```dev:deploy ``` deploy your dev theme
    ```dev:watch``` watch development theme,
    ```dev:open``` open preview link for development theme,
    ```dev:download``` downlaod all development theme files,
    ```live:deploy``` deploy to live (first must chage read only to false in config.yml",
    ```live:download``` download all live theme files