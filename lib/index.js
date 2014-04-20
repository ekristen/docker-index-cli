var fs = require('fs');
var nomnom = require('nomnom');
var request = require('request');
var easytable = require('easy-table');

if (!fs.existsSync(process.env.HOME + '/.dockercfg')) {
  console.log('First use docker login to authenticate to your registry/index');
  process.exit(1);
}

try {
  var config = JSON.parse(fs.readFileSync(process.env.HOME + '/.dockercfg', {encoding: 'utf-8'}));
}
catch (e) {
  console.error('Unable to parse .dockercfg file');
  process.exit(2);
}

try {
  var indexcfg = JSON.parse(fs.readFileSync(process.env.HOME + '/.indexcfg', {encoding: 'utf-8'}));
}
catch (e) {
}


nomnom.script('docker-index');

nomnom.option('debug', {
  abbr: 'd',
  flag: true,
  help: 'Debugging Mode'
});

nomnom.command('listUsers')
  .help('test')
  .option('index', {
    flag: false,
    default: indexcfg.index || '',
    help: 'Which index to talk against'
  })
  .callback(function(options) {
    request.get('http://' + options.index + '/users', {
      headers: {
        'Authorization': 'Basic ' + config[options.index].auth
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
  });


nomnom.command('addUser')
  .help('test')
  .option('index', {
    flag: false,
    default: indexcfg.index || '',
    help: 'Which index to talk against'
  })
  .option('username', {
    flag: false,
    abbr: 'u',
    help: 'username',
    required: true
  })
  .option('password', {
    flag: false,
    required: true,
    abbr: 'p',
    help: 'password'
  })
  .option('email', {
    flag: false,
    required: true,
    abbr: 'e',
    help: 'email address for user',
  })
  .callback(function(options) {
    request.post('http://' + options.index + '/users', {
      headers: {
        'Authorization': 'Basic ' + config[options.index].auth
      },
      form: {
        username: options.username,
        password: options.password,
        email: options.email
      }
    }, function(err, res, body) {
      if (err) {
        console.error('Error: ' + err);
        return;
      }

      console.log(body);
    });
  });

nomnom.command('listPermissions')
  .help('test')
  .usage('listPermissions <username>')
  .option('index', {
    flag: false,
    default: indexcfg.index || '',
    help: 'Which index to talk against'
  })
  .callback(function(options) {
    var username = options['1'];
    request.get('http://' + options.index + '/users/' + username + '/permissions', {
      headers: {
        'Authorization': 'Basic ' + config[options.index].auth
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

      console.log('Permissions for ' + username);
      console.log()

      var t = new easytable;

      for (var entry in perms) {
        t.cell('Namespace/Repo', entry);
        t.cell('Access Level', perms[entry]);
        t.newRow();
      }
      
      console.log(t.toString());
    });
  });


nomnom.command('addPermission')
  .help('test')
  .usage('addPermission <namespace/repo> <permission>')
  .option('index', {
    flag: false,
    default: indexcfg.index || '',
    help: 'Which index to talk against'
  })
  .callback(function(options) {
    var username = options['1'];
    request.put('http://' + options.index + '/users/' + username + '/permissions', {
      headers: {
        'Authorization': 'Basic ' + config[options.index].auth
      },
      form: {
        repo: options['2'],
        access: options['3']
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
        var result = JSON.parse(body);
      }
      catch (e) {
        console.error(e);
        process.exit(5);
      }

      console.log(result);
    });
  });


nomnom.command('removePermission')
  .help('test')
  .usage('removePermission <username> <namespace/repo> <permission>')
  .option('index', {
    flag: false,
    default: indexcfg.index || '',
    help: 'Which index to talk against'
  })
  .callback(function(options) {
    var username = options['1'];
    var repo = options['2'];
    request.del('http://' + options.index + '/users/' + username + '/permissions/' + repo, {
      headers: {
        'Authorization': 'Basic ' + config[options.index].auth
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
        var result = JSON.parse(body);
      }
      catch (e) {
        console.error(e);
        process.exit(5);
      }

      console.log(result);
    });
  });


nomnom.command('listIndexes')
  .help('--auth will show decoded authentication details')
  .option('auth', {
    abbr: 'a',
    flag: true,
    help: 'Show authentication details'
  })
  .callback(function(options) {
    console.log('List of Indexes (from .dockercfg)\n');

    var t = new easytable;

    for (var index in config) {
      t.cell('Index', index);
      t.cell('Email', config[index].email);

      if (options.auth == true) {
        t.cell('Auth', config[index].auth);
      }

      t.newRow();
    }
    
    console.log(t.toString());
  });


nomnom.command('listImages')
  .help('--auth will show decoded authentication details')
  .option('index', {
    flag: false,
    default: indexcfg.index || '',
    help: 'Which index to talk against'
  })
  .callback(function(options) {
    request.get('http://' + options.index + '/images', {
      headers: {
        'Authorization': 'Basic ' + config[options.index].auth
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
        var result = JSON.parse(body);
      }
      catch (e) {
        console.error(e);
        process.exit(5);
      }

      console.log('List of Images in Indexes\n');

      var t = new easytable;

      result.forEach(function(image) {
        var parts = image.split('_');

        t.cell('Namespace', parts[0]);
        t.cell('Repository', parts[1]);
        t.cell('ID', image);

        t.newRow();
      });
  
      console.log(t.toString());
    });
  });


nomnom.command('setIndex')
  .help()
  .usage('setIndex <index_name>')
  .callback(function(options) {
    if (typeof(options['1']) == 'undefined') {
      process.exit(4);
    }
    var index = options['1'];
    if (typeof(config[index]) == 'undefined') {
      process.exit(5);
    }

    var data = { index: index };

    fs.writeFile(process.env.HOME + '/.indexcfg', JSON.stringify(data), function(err) {
      if (err) {
        console.error('unable to save config');
        process.exit(4);
      }
      
      console.log('Configuration file updated');
    });
  });

nomnom.parse();




