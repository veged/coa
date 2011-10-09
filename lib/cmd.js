var Cmd, Color, Q, path, sys;
var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
sys = require('sys');
path = require('path');
Color = require('./color').Color;
Q = require('q');
/**
Command

Top level entity. Commands may have options and arguments.
@namespace
@class Presents command
*/
exports.Cmd = Cmd = (function() {
  /**
  @constructs
  @param {COA.Cmd} [cmd] parent command
  */  function Cmd(cmd) {
    if (!(this instanceof Cmd)) {
      return new Cmd(cmd);
    }
    this._parent(cmd);
    this._cmds = [];
    this._cmdsByName = {};
    this._opts = [];
    this._optsByKey = {};
    this._args = [];
  }
  Cmd.prototype._parent = function(cmd) {
    if (cmd) {
      cmd._cmds.push(this);
    }
    this._cmd = cmd || this;
    return this;
  };
  /**
  Set a canonical command identifier to be used anywhere in the API.
  @param {String} _name command name
  @returns {COA.Cmd} this instance (for chainability)
  */
  Cmd.prototype.name = function(_name) {
    this._name = _name;
    return this._cmd._cmdsByName[_name] = this;
  };
  /**
  Set a long description for command to be used anywhere in text messages.
  @param {String} _title command title
  @returns {COA.Cmd} this instance (for chainability)
  */
  Cmd.prototype.title = function(_title) {
    this._title = _title;
    return this;
  };
  /**
  Create new or add existing subcommand for current command.
  @param {COA.Cmd} [cmd] existing command instance
  @returns {COA.Cmd} new subcommand instance
  */
  Cmd.prototype.cmd = function(cmd) {
    if (cmd) {
      return cmd._parent(this);
    } else {
      return new Cmd(this);
    }
  };
  /**
  Create option for current command.
  @returns {COA.Opt} new option instance
  */
  Cmd.prototype.opt = function() {
    return new (require('./opt').Opt)(this);
  };
  /**
  Create argument for current command.
  @returns {COA.Opt} new argument instance
  */
  Cmd.prototype.arg = function() {
    return new (require('./arg').Arg)(this);
  };
  /**
  Add (or set) action for current command.
  @param {Function} act action function,
      invoked in the context of command instance
      and has the parameters:
          - {Object} opts parsed options
          - {Array} args parsed arguments
          - {Object} res actions result accumulator
      It can return rejected promise by Cmd.reject (in case of error)
      or any other value treated as result.
  @param {Boolean} [force=false] flag for set action instead add to existings
  @returns {COA.Cmd} this instance (for chainability)
  */
  Cmd.prototype.act = function(act, force) {
    if (!act) {
      return this;
    }
    if (!force && this._act) {
      this._act.push(act);
    } else {
      this._act = [act];
    }
    return this;
  };
  /**
  Apply function with arguments in context of command instance.
  @param {Function} fn
  @param {Array} args
  @returns {COA.Cmd} this instance (for chainability)
  */
  Cmd.prototype.apply = function() {
    var args, fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    fn.apply(this, args);
    return this;
  };
  /**
  Make command "helpful", i.e. add -h --help flags for print usage.
  @returns {COA.Cmd} this instance (for chainability)
  */
  Cmd.prototype.helpful = function() {
    return this.opt().name('help').title('Help').short('h').long('help').flag().only().act(function() {
      return this.usage();
    }).end();
  };
  Cmd.prototype._exit = function(msg, code) {
    if (msg) {
      sys.error(msg);
    }
    return process.exit(code || 0);
  };
  /**
  Build full usage text for current command instance.
  @returns {String} usage text
  */
  Cmd.prototype.usage = function() {
    var res;
    res = [];
    if (this._title) {
      res.push(this._fullTitle());
    }
    res.push('', 'Usage:');
    if (this._cmds.length) {
      res.push(['', '', Color('lred', this._fullName()), Color('lblue', 'COMMAND'), Color('lgreen', '[OPTIONS]'), Color('lpurple', '[ARGS]')].join(' '));
    }
    if (this._opts.length + this._args.length) {
      res.push(['', '', Color('lred', this._fullName()), Color('lgreen', '[OPTIONS]'), Color('lpurple', '[ARGS]')].join(' '));
    }
    res.push(this._usages(this._cmds, 'Commands'), this._usages(this._opts, 'Options'), this._usages(this._args, 'Arguments'));
    return res.join('\n');
  };
  Cmd.prototype._usage = function() {
    return Color('lblue', this._name) + ' : ' + this._title;
  };
  Cmd.prototype._usages = function(os, title) {
    var o, res, _i, _len;
    if (!os.length) {
      return;
    }
    res = ['', title + ':'];
    for (_i = 0, _len = os.length; _i < _len; _i++) {
      o = os[_i];
      res.push('  ' + o._usage());
    }
    return res.join('\n');
  };
  Cmd.prototype._fullTitle = function() {
    return (this._cmd === this ? '' : this._cmd._fullTitle() + '\n') + this._title;
  };
  Cmd.prototype._fullName = function() {
    return (this._cmd === this ? '' : this._cmd._fullName() + ' ') + path.basename(this._name);
  };
  Cmd.prototype._ejectOpt = function(opts, opt) {
    var pos;
    if ((pos = opts.indexOf(opt)) >= 0) {
      if (opts[pos]._arr) {
        return opts[pos];
      } else {
        return opts.splice(pos, 1)[0];
      }
    }
  };
  Cmd.prototype._checkRequired = function(opts, args) {
    var all, i, _results;
    if (!(this._opts.filter(function(o) {
      return o._only && o._name in opts;
    })).length) {
      all = this._opts.concat(this._args);
      _results = [];
      while (i = all.shift()) {
        if (i._req && i._checkParsed(opts, args)) {
          return this.reject(i._requiredText());
        }
      }
      return _results;
    }
  };
  Cmd.prototype._parseCmd = function(argv, unparsed) {
    var cmd, i, optSeen;
    if (unparsed == null) {
      unparsed = [];
    }
    argv = argv.concat();
    optSeen = false;
    while (i = argv.shift()) {
      if (!i.indexOf('-')) {
        optSeen = true;
      }
      if (!optSeen && /^\w[\w-_]*$/.test(i) && (cmd = this._cmdsByName[i])) {
        return cmd._parseCmd(argv, unparsed);
      }
      unparsed.push(i);
    }
    return {
      cmd: this,
      argv: unparsed
    };
  };
  Cmd.prototype._parseOptsAndArgs = function(argv) {
    var arg, args, i, m, nonParsed, nonParsedArgs, nonParsedOpts, opt, opts, res;
    opts = {};
    args = {};
    nonParsedOpts = this._opts.concat();
    nonParsedArgs = this._args.concat();
    while (i = argv.shift()) {
      if (i === '--') {
        args.raw = argv.splice(0);
      } else if (!i.indexOf('-')) {
        if (m = i.match(/^(--\w[\w-_]*)=(.*)$/)) {
          i = m[1];
          argv.unshift(m[2]);
        }
        if (opt = this._ejectOpt(nonParsedOpts, this._optsByKey[i])) {
          if (Q.isPromise(res = opt._parse(argv, opts))) {
            return res;
          }
        } else {
          return this.reject("Unknown option: " + i);
        }
      } else {
        if (arg = nonParsedArgs.shift()) {
          if (arg._arr) {
            nonParsedArgs.unshift(arg);
          }
          if (Q.isPromise(res = arg._parse(i, args))) {
            return res;
          }
        } else {
          return this.reject("Unknown argument: " + i);
        }
      }
      nonParsed = nonParsedOpts.concat(nonParsedArgs);
      while (i = nonParsed.shift()) {
        if ('_def' in i) {
          i._saveVal(opts, i._def);
        }
      }
    }
    return {
      opts: opts,
      args: args
    };
  };
  Cmd.prototype._parseArr = function(argv) {
    var cmd, res, _ref;
    _ref = this._parseCmd(argv), cmd = _ref.cmd, argv = _ref.argv;
    if (Q.isPromise(res = cmd._parseOptsAndArgs(argv))) {
      return res;
    }
    return {
      cmd: cmd,
      opts: res.opts,
      args: res.args
    };
  };
  Cmd.prototype._do = function(input, succ, err) {
    var cmd, defer, parsed;
    defer = Q.defer();
    parsed = this._parseArr(input);
    cmd = parsed.cmd || this;
    [this._checkRequired].concat(cmd._act || []).reduce(__bind(function(res, act) {
      return res.then(__bind(function(res) {
        return act.call(cmd, parsed.opts, parsed.args, res);
      }, this));
    }, this), defer.promise).fail(__bind(function(res) {
      return err.call(cmd, res);
    }, this)).then(__bind(function(res) {
      return succ.call(cmd, res);
    }, this));
    return defer.resolve(Q.isPromise(parsed) ? parsed : void 0);
  };
  /**
  Parse arguments from simple format like NodeJS process.argv
  and run ahead current program, i.e. call process.exit when all actions done.
  @param {Array} argv
  @returns {COA.Cmd} this instance (for chainability)
  */
  Cmd.prototype.run = function(argv) {
    var cb;
    if (argv == null) {
      argv = process.argv.slice(2);
    }
    cb = function(code) {
      return function(res) {
        var _ref, _ref2;
        return this._exit((_ref = res.stack) != null ? _ref : res.toString(), (_ref2 = res.exitCode) != null ? _ref2 : code);
      };
    };
    this._do(argv, cb(0), cb(1));
    return this;
  };
  /**
  Return reject of actions results promise with error code.
  Use in .act() for return with error.
  @param {Object} reject reason
      You can customize toString() method and exitCode property
      of reason object.
  @returns {Q.promise} rejected promise
  */
  Cmd.prototype.reject = function(reason) {
    return Q.reject(reason);
  };
  /**
  Finish chain for current subcommand and return parent command instance.
  @returns {COA.Cmd} parent command
  */
  Cmd.prototype.end = function() {
    return this._cmd;
  };
  return Cmd;
})();