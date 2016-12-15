var lib;

if (process.env.COVER) {
  lib = require('./lib-cov');
} else {
  lib = require('./lib');
}

module.exports = lib;
