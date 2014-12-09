var util = require('util');
var request = require('request');
var easytable = require('easy-table')

function usage(err) {
  if (err) {
    console.log(err);
    console.log();
  }
  console.log('Usage: docker-index listPermissions <user>@<index>')
  process.exit(10);
}

module.exports = function(dockercfg) {

  return {

    callback: function(options) {
      var cmd = options[0];
      var arg1 = options[1];

      if (options['_'].length != 2) {
        usage('Error: Invalid number of arguments');
      }

      var parts1 = arg1.split('@');

      if (parts1.length != 2) {
        usage('Error: Invalid format.')
      }

      var parts2 = parts1[1].split('/', 1);
      
      var username = parts1[0];
      var index = parts2[0];
      var repo = parts2[1];

      if (typeof(dockercfg[index]) == "undefined" || typeof(dockercfg[index].auth) == "undefined") {
        console.log('Error: Unknown Index -- Index is not defined in your ~/.dockercfg file')
        process.exit(10);
      }
      
      var protocol = (options.http == true) ? 'http' : 'https';
      var url = util.format('%s://%s/users/%s/permissions', protocol, index, username);

      var url_options = {};
      url_options.url = url
      if (options['insecure'] == true) {
        url_options['strictSSL'] = false;
      }
      url_options.headers = {
        'Authorization': 'Basic ' + dockercfg[index].auth
      };

      request.get(url_options, function(err, res, body) {
        if (err) {
          console.error(util.format('%s', err));
          process.exit(1);
        }

        if (res.statusCode != 200) {
          console.error(body);
          return;
        }

        try {
          var perms = JSON.parse(body);
        }
        catch (e) {
          console.error(e);
          process.exit(5);
        }

        console.log('Permissions for ' + username + ' on ' + index);
        console.log()

        var t = new easytable;

        for (var entry in perms) {
          t.cell('Namespace/Repo', entry);
          t.cell('Access Level', perms[entry]);
          t.newRow();
        }
      
        console.log(t.toString());
      });
    }

  };

};
