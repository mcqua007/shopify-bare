/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
const yaml = require('js-yaml');
const fs = require('fs');

try {
  let fileData = fs.readFileSync('./dist/config.yml', 'utf8');
  const themeConfig = yaml.safeLoad(fileData);

  //development theme config
  var id = themeConfig.development.theme_id;
  var store = themeConfig.development.store;
} catch (e) {
  console.log('\x1b[33m%s\x1b[0m', 'Could not read config.yml, Make Sure you have a config in ./dist/config.yml');
  throw new Error(e);
}

module.exports = {
  proxy: `https://${store}?preview_theme_id=${id}&pb=0&_fd=0`,
  files: 'theme.update',
  reloadDelay: 100,
  snippetOptions: {
    rule: {
      match: /<head[^>]*>/i,
      fn(snippet, match) {
        return match + snippet;
      }
    }
  },
  //keeps adding the _fd=0 to relative links in order for shopify to force direct out of browser sync
  middleware: function(req, res, next) {
    if (!req.url.includes('_fd')) {
      req.url = req.url.match(/\?./) ? req.url + '&_fd=0' : req.url + '?_fd=0';
    }
    return next();
  }
};
