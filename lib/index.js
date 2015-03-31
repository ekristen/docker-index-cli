var fs = require('fs');
var nomnom = require('nomnom');
var request = require('request');
var easytable = require('easy-table');
var package = require('../package');
var config = require('rc')('docker-index-cli', {
  http: false,
  insecure: false
});

if (!fs.existsSync(process.env.HOME + '/.dockercfg')) {
  console.log('First use docker login to authenticate to your registry/index');
  process.exit(1);
} else {
  try {
    var dockercfg = JSON.parse(fs.readFileSync(process.env.HOME + '/.dockercfg', {encoding: 'utf-8'}));
  }
  catch (e) {
    console.error('Unable to parse .dockercfg file');
    process.exit(2);
  }  
}

nomnom
  .script('docker-index')
  .option('http', {
    flag: true,
    help: 'use http instead, this is INSECURE!',
    default: config.http
  })
  .option('insecure', {
    flag: true,
    help: 'ignore self-signed ssl cerificates',
    default: config.insecure
  })
  .option('version', {
    flag: true,
    help: 'prints version and exits',
    callback: function() { return package.version; }
  })
  .help('Available Commands:\n\n - listUsers\n - listPermissions\n - addPermission\n - removePermission\n - listImages\n - listIndices\n')

var listUsers = require('./commands/list_users.js')(dockercfg);
nomnom.command('listUsers')
  .callback(listUsers.callback);

var enableUser = require('./commands/enable_user.js')(dockercfg);
nomnom.command('enableUser').callback(enableUser.callback);

var disableUser = require('./commands/disable_user.js')(dockercfg);
nomnom.command('disableUser').callback(disableUser.callback);

var getUser = require('./commands/get_user.js')(dockercfg);
nomnom.command('getUser').callback(getUser.callback);

var createUser = require('./commands/create_user.js')(dockercfg)
nomnom.command('createUser').callback(createUser.callback)

var deleteUser = require('./commands/delete_user.js')(dockercfg)
nomnom.command('deleteUser').callback(deleteUser.callback)

var grantAdmin = require('./commands/grant_admin.js')(dockercfg)
nomnom.command('grantAdmin').callback(grantAdmin.callback)

var revokeAdmin = require('./commands/revoke_admin.js')(dockercfg)
nomnom.command('revokeAdmin').callback(revokeAdmin.callback)


var listPermissions = require('./commands/list_permissions.js')(dockercfg);
nomnom.command('listPermissions')
  .callback(listPermissions.callback);

var addPermission = require('./commands/add_permission.js')(dockercfg);
nomnom.command('addPermission')
  .callback(addPermission.callback);

var removePermission = require('./commands/remove_permission.js')(dockercfg);
nomnom.command('removePermission')
  .callback(removePermission.callback);

var listImages = require('./commands/list_images.js')(dockercfg);
nomnom.command('listImages')
  .callback(listImages.callback);

var listIndices = require('./commands/list_indices.js')(dockercfg);
nomnom.command('listIndices')
  .callback(listIndices.callback);
nomnom.command('listIndexes')
  .callback(listIndices.callback);

var listWebhooks = require('./commands/list_webhooks.js')(dockercfg);
nomnom.command('listWebhooks')
  .callback(listWebhooks.callback);

var addWebhook = require('./commands/add_webhook.js')(dockercfg);
nomnom.command('addWebhook')
  .callback(addWebhook.callback);

var removeWebhook = require('./commands/remove_webhook.js')(dockercfg);
nomnom.command('removeWebhook')
  .callback(removeWebhook.callback);

var pingWebhook = require('./commands/ping_webhook.js')(dockercfg);
nomnom.command('pingWebhook')
  .callback(pingWebhook.callback);

nomnom.parse();
