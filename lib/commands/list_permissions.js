var request = require('request');
var easytable = require('easy-table')

function usage(err) {
  if (err) {
    console.log(err);
    console.log();
  }
  console.log('Usage: docker-index listIndices')
  process.exit(10);
}

module.exports = function(indexcfg, dockercfg) {

  return {

    callback: function(options) {
      var cmd = options[0];
      var arg1 = options[1];

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

      request.get('https://' + index + '/users/' + username + '/permissions', {
        headers: {
          'Authorization': 'Basic ' + dockercfg[index].auth
        }
      }, function(err, res, body) {
        if (err) {
          console.error('Error: ' + err);
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
