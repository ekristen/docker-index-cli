var util = require('util');
var request = require('request');
var easytable = require('easy-table')

function usage(err) {
  if (err) {
    console.log(err);
    console.log();
  }
  console.log('Usage: listImages <index>[/<namespace>]')
  console.log('Example: listImages index.private.io/base')
  process.exit(10);
}

module.exports = function(dockercfg) {

  return {

    callback: function(options) {
      if (options['_'].length != 2) {
        usage('Error: Invalid number of arguments');
      }

      var parts1 = options[1].split('/');

      if (parts1.length > 2) {
        usage('Error: Invalid index/repository format')
      }

      var index = parts1.shift();

      if (typeof(dockercfg[index]) == "undefined" || typeof(dockercfg[index].auth) == "undefined") {
        console.log('Error: Unknown Index -- Index is not defined in your ~/.dockercfg file')
        process.exit(10);
      }

      var namespace = null;
      if (parts1.length == 1) {
        var namespace = parts1.join('/');
      }

      var protocol = (options.http == true) ? 'http' : 'https';
      var url = util.format('%s://%s/images', protocol, index);

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
          var result = JSON.parse(body);
        }
        catch (e) {
          console.error(e);
          process.exit(5);
        }

        result.sort();

        console.log('List of Images\n');
        if (namespace != null) {
          console.log('Namespace: ' + namespace + '\n')
        }

        var t = new easytable;

        result.forEach(function(image) {
          var parts = image.split('_');

          if (namespace == null || (namespace != null && parts[0] == namespace)) {
            t.cell('Namespace', parts.shift());
            t.cell('Repository', parts.join('_'));
            t.cell('ID', image);

            t.newRow();
          }
        });
  
        console.log(t.toString());
      });
    }
    
  };
  
};
