var request = require('request');
var easytable = require('easy-table')

function usage(err) {
  if (err) {
    console.log(err);
    console.log();
  }
  console.log('Usage: listIndices OR listIndexes')
  process.exit(10);
}

module.exports = function(dockercfg) {

  return {
    
    callback: function(options) {
      console.log('List of Indexes (from .dockercfg)\n');

      var t = new easytable;

      for (var index in dockercfg) {
        t.cell('Index', index);
        t.cell('Email', dockercfg[index].email);

        if (options.auth == true) {
          t.cell('Auth', dockercfg[index].auth);
        }

        t.newRow();
      }
    
      console.log(t.toString());
    }
    
  };
  
};
