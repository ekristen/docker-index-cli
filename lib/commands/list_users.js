var util = require('util');
var request = require('request');
var easytable = require('easy-table')

function usage(err) {
  if (err) {
    console.log(err);
    console.log();
  }
  console.log('Usage: listUsers <index>')
  console.log('Example: listUsers index.private.io')
  process.exit(10);
}

module.exports = function(dockercfg) {

  return {

    callback: function(options) {
      if (options['_'].length != 2) {
        usage('Error: Invalid number of arguments');
      }

      var cmd = options[0];
      var index = options[1] || indexcfg.index;

      if (typeof(dockercfg[index]) == "undefined" || typeof(dockercfg[index].auth) == "undefined") {
        console.log('Error: Unknown Index -- Index is not defined in your ~/.dockercfg file')
        process.exit(10);
      }

      var protocol = (options.http == true) ? 'http' : 'https';
      var url = util.format('%s://%s/users', protocol, index);

      request.get(url, {
        headers: {
          'Authorization': 'Basic ' + dockercfg[index].auth
        }
      }, function(err, res, body) {
        if (err) {
          console.error('Error: ' + err);
        }

        if (res.statusCode != 200) {
          console.error('Error: ' + body);
          process.exit(1);
        }

        try {
          var users = JSON.parse(body);
        }
        catch (e) {
          console.error('Whoops, unable to parse data.');
          console.error('Error: ' + e);
          process.exit(5);
        }

        var t = new easytable;

        users.forEach(function(user) {
          t.cell('Username', user);
          t.newRow();
        });

        console.log(t.toString());
      });
    }

    
  };

};
