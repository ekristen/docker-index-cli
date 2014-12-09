var util = require('util');
var request = require('request');
var easytable = require('easy-table')

function usage(err) {
  if (err) {
    console.log(err);
    console.log();
  }
  console.log('Usage: listWebhooks <index>[/<namespace>]')
  console.log('Example: listWebhooks index.private.io/base/repo')
  process.exit(10);
}

module.exports = function(dockercfg) {

  return {

    callback: function(options) {
      if (options['_'].length != 2) {
        usage('Error: Invalid number of arguments');
      }

      var parts1 = options[1].split('/');

      if (parts1.length > 3) {
        usage('Error: Invalid index/repository format')
      }

      var index = parts1.shift();
      var repository = parts1.join('/');

      if (typeof(dockercfg[index]) == "undefined" || typeof(dockercfg[index].auth) == "undefined") {
        console.log('Error: Unknown Index -- Index is not defined in your ~/.dockercfg file')
        process.exit(10);
      }

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

        console.log("Webhook(s) for '" + repository + "'");
        console.log()

        if (result.length == 0) {
          console.log('No webhooks for this repository');
        }
        else {
          var t = new easytable;

          result.forEach(function(webhook) {
            var events = [];
            if (webhook.new == 'true')
              events.push('new');
            if (webhook.existing == 'true')
              events.push('existing');

            t.cell('URL', webhook.url);
            t.cell('Events', events.join(', '))
            t.newRow();
          });
  
          console.log(t.toString());
        }
      });
    }
    
  };
  
};
