var Cmd, Color, Opt, fs;
fs = require('fs');
Color = require('./color').Color;
Cmd = require('./cmd').Cmd;
/**
## Option
Named entity. Options may have short and long keys for use from command line.
@namespace
@class Presents option
*/
exports.Opt = Opt = (function() {
  /**
  @constructs
  @param {COA.Cmd} cmd parent command
  */  function Opt(_cmd) {
    this._cmd = _cmd;
    this._cmd._opts.push(this);
  }
  /**
  Set a canonical option identifier to be used anywhere in the API.
  @param {String} _name option name
  @returns {COA.Opt} this instance (for chainability)
  */
  Opt.prototype.name = function(_name) {
    this._name = _name;
    return this;
  };
  /**
  Set a long description for option to be used anywhere in text messages.
  @param {String} _title option title
  @returns {COA.Opt} this instance (for chainability)
  */
  Opt.prototype.title = Cmd.prototype.title;
  /**
  Set a short key for option to be used with one hyphen from command line.
  @param {String} _short
  @returns {COA.Opt} this instance (for chainability)
  */
  Opt.prototype.short = function(_short) {
    this._short = _short;
    return this._cmd._optsByKey['-' + _short] = this;
  };
  /**
  Set a short key for option to be used with double hyphens from command line.
  @param {String} _long
  @returns {COA.Opt} this instance (for chainability)
  */
  Opt.prototype.long = function(_long) {
    this._long = _long;
    return this._cmd._optsByKey['--' + _long] = this;
  };
  /**
  Make an option boolean, i.e. option without value.
  @returns {COA.Opt} this instance (for chainability)
  */
  Opt.prototype.flag = function() {
    this._flag = true;
    return this;
  };
  /**
  Makes an option accepts multiple values.
  Otherwise, the value will be used by the latter passed.
  @returns {COA.Opt} this instance (for chainability)
  */
  Opt.prototype.arr = function() {
    this._arr = true;
    return this;
  };
  /**
  Makes an option required.
  @returns {COA.Opt} this instance (for chainability)
  */
  Opt.prototype.req = function() {
    this._req = true;
    return this;
  };
  /**
  Makes an option to act as a command,
  i.e. program will exit just after option action.
  @returns {COA.Opt} this instance (for chainability)
  */
  Opt.prototype.only = function() {
    this._only = true;
    return this;
  };
  /**
  Set a validation (or value) function for option.
  Value from command line passes through before becoming available from API.
  Using for validation and convertion simple types to any values.
  @param {Function} _val validating function,
      invoked in the context of option instance
      and has one parameter with value from command line
  @returns {COA.Opt} this instance (for chainability)
  */
  Opt.prototype.val = function(_val) {
    this._val = _val;
    return this;
  };
  /**
  Set a default value for option.
  Default value passed through validation function as ordinary value.
  @param {Object} _def
  @returns {COA.Opt} this instance (for chainability)
  */
  Opt.prototype.def = function(_def) {
    this._def = _def;
    return this;
  };
  /**
  Make option value outputing stream.
  It's add useful validation and shortcut for STDOUT.
  @returns {COA.Opt} this instance (for chainability)
  */
  Opt.prototype.output = function() {
    return this.def(process.stdout).val(function(v) {
      if (typeof v === 'string') {
        if (v === '-') {
          return process.stdout;
        } else {
          return fs.createWriteStream(v, {
            encoding: 'utf8'
          });
        }
      } else {
        return v;
      }
    });
  };
  /**
  Add action for current option command.
  This action is performed if the current option
  is present in parsed options (with any value).
  @param {Function} act action function,
      invoked in the context of command instance
      and has the parameters:
          - {Object} opts parsed options
          - {Array} args parsed arguments
          - {Object} res actions result accumulator
      It can return rejected promise by Cmd.reject (in case of error)
      or any other value treated as result.
  @returns {COA.Opt} this instance (for chainability)
  */
  Opt.prototype.act = function(act) {
    var name, opt;
    opt = this;
    name = this._name;
    this._cmd.act(function(opts) {
      var res;
      if (name in opts) {
        res = act.apply(this, arguments);
        if (opt._only) {
          return this.reject({
            toString: function() {
              return res;
            },
            exitCode: 0
          });
        } else {
          return res;
        }
      }
    });
    return this;
  };
  Opt.prototype._saveVal = function(opts, val) {
    var _name;
    if (this._val) {
      val = this._val(val);
    }
    if (this._arr) {
      (opts[_name = this._name] || (opts[_name] = [])).push(val);
    } else {
      opts[this._name] = val;
    }
    return this;
  };
  Opt.prototype._parse = function(argv, opts) {
    return this._saveVal(opts, this._flag ? true : argv.shift());
  };
  Opt.prototype._checkParsed = function(opts, args) {
    return !opts.hasOwnProperty(this._name);
  };
  Opt.prototype._usage = function() {
    var nameStr, res;
    res = [];
    nameStr = this._name.toUpperCase();
    if (this._short) {
      res.push('-', Color('lgreen', this._short));
      if (!this._flag) {
        res.push(' ' + nameStr);
      }
      res.push(', ');
    }
    if (this._long) {
      res.push('--', Color('green', this._long));
      if (!this._flag) {
        res.push('=' + nameStr);
      }
    }
    res.push(' : ', this._title);
    return res.join('');
  };
  Opt.prototype._requiredText = function() {
    return 'Missing required option:\n  ' + this._usage();
  };
  /**
  Finish chain for current option and return parent command instance.
  @returns {COA.Cmd} parent command
  */
  Opt.prototype.end = Cmd.prototype.end;
  return Opt;
})();