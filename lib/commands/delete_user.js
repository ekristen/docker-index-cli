var util = require('util');
var request = require('request');

function usage(err) {
  if (err) {
    console.log(err);
    console.log();
  }
  console.log('Usage: deleteUser <user>@<index>')
  console.log('Example: deleteUser testuser@index.private.io')
  process.exit(10);
}

module.exports = function(dockercfg) {

  return {

    callback: function(options) {
      if (options['_'].length != 2) {
        usage('Error: Invalid number of arguments');
      }

      var parts1 = options[1].split('@');

      if (parts1.length != 2) {
        usage('Error: Invalid user/index format.')
      }

      var parts2 = parts1[1].split('/', 1);
      
      var username = parts1[0];
      var index = parts2[0];

      if (typeof(dockercfg[index]) == "undefined" || typeof(dockercfg[index].auth) == "undefined") {
        console.log('Error: Unknown Index -- Index is not defined in your ~/.dockercfg file')
        process.exit(10);
      }

      var protocol = (options.http == true) ? 'http' : 'https';
      var url = util.format('%s://%s/users/%s', protocol, index, username);

      var url_options = {};
      url_options.url = url
      if (options['insecure'] == true) {
        url_options['strictSSL'] = false;
      }
      url_options.headers = {
        'Authorization': 'Basic ' + dockercfg[index].auth
      };
      
      var password = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
      
      request.del(url_options, function(err, res, body) {
        if (err) {
          console.error(util.format('%s', err));
          process.exit(1);
        }

        if (res.statusCode != 200) {
          console.error('Error: ' + body);
          process.exit(1);
        }

        console.log('Password:', password)
        console.log(body);
      });
    }

    
  };

};
