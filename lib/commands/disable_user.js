var util = require('util');
var request = require('request');

function usage(err) {
  if (err) {
    console.log(err);
    console.log();
  }
  console.log('Usage: disableUser <user>@<index>')
  console.log('Example: disableUser testuser@index.private.io')
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
      var url = util.format('%s://%s/users/%s/disable', protocol, index, username);

      request.put(url, {
        headers: {
          'Authorization': 'Basic ' + dockercfg[index].auth
        }
      }, function(err, res, body) {
        if (err) {
          console.log(util.format('Error: %s', err.code));
          return;
        }

        if (res.statusCode != 201) {
          console.error('Error: ' + body);
          process.exit(1);
        }

        console.log(body);
      });
    }

    
  };

};
