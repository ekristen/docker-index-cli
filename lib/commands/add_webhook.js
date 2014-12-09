var util = require('util');
var request = require('request');
var easytable = require('easy-table')

function usage(err) {
  if (err) {
    console.log(err);
    console.log();
  }
  console.log('Usage: addWebhook <index>/<repo> <webhook_url> <events>');
  console.log('Example: addWebhook index.private.io/base/ubuntu https://example.com/testing/one new,existing');
  console.log('Events: new,existing');
  process.exit(10);
}

module.exports = function(dockercfg) {

  return {

    callback: function(options) {
      var cmd = options[0];
      var arg1 = options[1];
      var webhook_url = options[2];
      var webhook_events = options[3] || 'new';

      if (options['_'].length < 3 || options['_'].length > 4 ) {
        usage('Error: Wrong number of arguments');
      }

      var parts2 = arg1.split('/');
      var index = parts2.shift();

      if (typeof(dockercfg[index]) == "undefined" || typeof(dockercfg[index].auth) == "undefined") {
        console.log('Error: Unknown Index -- Index is not defined in your ~/.dockercfg file')
        process.exit(10);
      }

      if (parts2.length > 2) {
        usage('Error: Invalid repository format. Given: ' + parts2.join('/') + ', Expected: namespace/repo OR repo')
      }

      var repository = parts2.join('/');

      var protocol = (options.http == true) ? 'http' : 'https';
      var url = util.format('%s://%s/webhooks/%s', protocol, index, repository);

      var url_options = {};
      url_options.url = url
      if (options['insecure'] == true) {
        url_options['strictSSL'] = false;
      }
      url_options.headers = {
        'Authorization': 'Basic ' + dockercfg[index].auth
      };
      url_options.form = {
        url: webhook_url,
        events: webhook_events.split(','),
      };

      request.post(url_options, function(err, res, body) {
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

        console.log(result);
      });
    }
    
  };
  
};
