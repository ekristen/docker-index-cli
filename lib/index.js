var fs = require('fs');
var nomnom = require('nomnom');
var request = require('request');
var easytable = require('easy-table');
var package = require('../package');


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
  .option('version', {
    flag: true,
    help: 'prints version and exits',
    callback: function() { return package.version; }
  })
  .help('Available Commands:\n\n - listUsers\n - listPermissions\n - addPermission\n - removePermission\n - listImages\n - listIndices\n')

var listUsers = require('./commands/list_users.js')(dockercfg);
nomnom.command('listUsers')
  .callback(listUsers.callback);


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



nomnom.parse();
