if (typeof global.__coverage__ === 'undefined') { global.__coverage__ = {}; }
if (!global.__coverage__['/Users/jordan/Projects/coa/lib/arg.js']) {
   global.__coverage__['/Users/jordan/Projects/coa/lib/arg.js'] = {"path":"/Users/jordan/Projects/coa/lib/arg.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":1,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0},"b":{"1":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":12}}},"2":{"name":"(anonymous_2)","line":18,"loc":{"start":{"line":18,"column":23},"end":{"line":18,"column":34}}},"3":{"name":"Arg","line":24,"loc":{"start":{"line":24,"column":4},"end":{"line":24,"column":23}}},"4":{"name":"(anonymous_4)","line":118,"loc":{"start":{"line":118,"column":27},"end":{"line":118,"column":47}}},"5":{"name":"(anonymous_5)","line":124,"loc":{"start":{"line":124,"column":33},"end":{"line":124,"column":54}}},"6":{"name":"(anonymous_6)","line":128,"loc":{"start":{"line":128,"column":27},"end":{"line":128,"column":38}}},"7":{"name":"(anonymous_7)","line":138,"loc":{"start":{"line":138,"column":34},"end":{"line":138,"column":45}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":176,"column":14}},"2":{"start":{"line":3,"column":2},"end":{"line":3,"column":20}},"3":{"start":{"line":5,"column":2},"end":{"line":5,"column":29}},"4":{"start":{"line":7,"column":2},"end":{"line":7,"column":29}},"5":{"start":{"line":18,"column":2},"end":{"line":174,"column":7}},"6":{"start":{"line":24,"column":4},"end":{"line":27,"column":5}},"7":{"start":{"line":25,"column":6},"end":{"line":25,"column":23}},"8":{"start":{"line":26,"column":6},"end":{"line":26,"column":33}},"9":{"start":{"line":36,"column":4},"end":{"line":36,"column":44}},"10":{"start":{"line":45,"column":4},"end":{"line":45,"column":46}},"11":{"start":{"line":54,"column":4},"end":{"line":54,"column":42}},"12":{"start":{"line":62,"column":4},"end":{"line":62,"column":42}},"13":{"start":{"line":75,"column":4},"end":{"line":75,"column":42}},"14":{"start":{"line":85,"column":4},"end":{"line":85,"column":42}},"15":{"start":{"line":98,"column":4},"end":{"line":98,"column":44}},"16":{"start":{"line":107,"column":4},"end":{"line":107,"column":46}},"17":{"start":{"line":116,"column":4},"end":{"line":116,"column":48}},"18":{"start":{"line":118,"column":4},"end":{"line":120,"column":6}},"19":{"start":{"line":119,"column":6},"end":{"line":119,"column":38}},"20":{"start":{"line":122,"column":4},"end":{"line":122,"column":52}},"21":{"start":{"line":124,"column":4},"end":{"line":126,"column":6}},"22":{"start":{"line":125,"column":6},"end":{"line":125,"column":46}},"23":{"start":{"line":128,"column":4},"end":{"line":136,"column":6}},"24":{"start":{"line":129,"column":6},"end":{"line":129,"column":14}},"25":{"start":{"line":130,"column":6},"end":{"line":130,"column":15}},"26":{"start":{"line":131,"column":6},"end":{"line":131,"column":47}},"27":{"start":{"line":132,"column":6},"end":{"line":134,"column":7}},"28":{"start":{"line":133,"column":8},"end":{"line":133,"column":36}},"29":{"start":{"line":135,"column":6},"end":{"line":135,"column":26}},"30":{"start":{"line":138,"column":4},"end":{"line":140,"column":6}},"31":{"start":{"line":139,"column":6},"end":{"line":139,"column":62}},"32":{"start":{"line":152,"column":4},"end":{"line":152,"column":48}},"33":{"start":{"line":160,"column":4},"end":{"line":160,"column":42}},"34":{"start":{"line":170,"column":4},"end":{"line":170,"column":46}},"35":{"start":{"line":172,"column":4},"end":{"line":172,"column":15}}},"branchMap":{"1":{"line":132,"type":"if","locations":[{"start":{"line":132,"column":6},"end":{"line":132,"column":6}},{"start":{"line":132,"column":6},"end":{"line":132,"column":6}}]}}};
}
var __cov_RUl1CI2V4EBN5GkunSff5g = global.__coverage__['/Users/jordan/Projects/coa/lib/arg.js'];
__cov_RUl1CI2V4EBN5GkunSff5g.s['1']++;
(function () {
    __cov_RUl1CI2V4EBN5GkunSff5g.f['1']++;
    __cov_RUl1CI2V4EBN5GkunSff5g.s['2']++;
    var Arg, Cmd, Opt;
    __cov_RUl1CI2V4EBN5GkunSff5g.s['3']++;
    Cmd = require('./cmd').Cmd;
    __cov_RUl1CI2V4EBN5GkunSff5g.s['4']++;
    Opt = require('./opt').Opt;
    __cov_RUl1CI2V4EBN5GkunSff5g.s['5']++;
    exports.Arg = Arg = function () {
        __cov_RUl1CI2V4EBN5GkunSff5g.f['2']++;
        function Arg(_cmd) {
            __cov_RUl1CI2V4EBN5GkunSff5g.f['3']++;
            __cov_RUl1CI2V4EBN5GkunSff5g.s['7']++;
            this._cmd = _cmd;
            __cov_RUl1CI2V4EBN5GkunSff5g.s['8']++;
            this._cmd._args.push(this);
        }
        __cov_RUl1CI2V4EBN5GkunSff5g.s['9']++;
        Arg.prototype.name = Opt.prototype.name;
        __cov_RUl1CI2V4EBN5GkunSff5g.s['10']++;
        Arg.prototype.title = Cmd.prototype.title;
        __cov_RUl1CI2V4EBN5GkunSff5g.s['11']++;
        Arg.prototype.arr = Opt.prototype.arr;
        __cov_RUl1CI2V4EBN5GkunSff5g.s['12']++;
        Arg.prototype.req = Opt.prototype.req;
        __cov_RUl1CI2V4EBN5GkunSff5g.s['13']++;
        Arg.prototype.val = Opt.prototype.val;
        __cov_RUl1CI2V4EBN5GkunSff5g.s['14']++;
        Arg.prototype.def = Opt.prototype.def;
        __cov_RUl1CI2V4EBN5GkunSff5g.s['15']++;
        Arg.prototype.comp = Cmd.prototype.comp;
        __cov_RUl1CI2V4EBN5GkunSff5g.s['16']++;
        Arg.prototype.input = Opt.prototype.input;
        __cov_RUl1CI2V4EBN5GkunSff5g.s['17']++;
        Arg.prototype.output = Opt.prototype.output;
        __cov_RUl1CI2V4EBN5GkunSff5g.s['18']++;
        Arg.prototype._parse = function (arg, args) {
            __cov_RUl1CI2V4EBN5GkunSff5g.f['4']++;
            __cov_RUl1CI2V4EBN5GkunSff5g.s['19']++;
            return this._saveVal(args, arg);
        };
        __cov_RUl1CI2V4EBN5GkunSff5g.s['20']++;
        Arg.prototype._saveVal = Opt.prototype._saveVal;
        __cov_RUl1CI2V4EBN5GkunSff5g.s['21']++;
        Arg.prototype._checkParsed = function (opts, args) {
            __cov_RUl1CI2V4EBN5GkunSff5g.f['5']++;
            __cov_RUl1CI2V4EBN5GkunSff5g.s['22']++;
            return !args.hasOwnProperty(this._name);
        };
        __cov_RUl1CI2V4EBN5GkunSff5g.s['23']++;
        Arg.prototype._usage = function () {
            __cov_RUl1CI2V4EBN5GkunSff5g.f['6']++;
            __cov_RUl1CI2V4EBN5GkunSff5g.s['24']++;
            var res;
            __cov_RUl1CI2V4EBN5GkunSff5g.s['25']++;
            res = [];
            __cov_RUl1CI2V4EBN5GkunSff5g.s['26']++;
            res.push(this._name, ' : ', this._title);
            __cov_RUl1CI2V4EBN5GkunSff5g.s['27']++;
            if (this._req) {
                __cov_RUl1CI2V4EBN5GkunSff5g.b['1'][0]++;
                __cov_RUl1CI2V4EBN5GkunSff5g.s['28']++;
                res.push(' ', '(required)');
            } else {
                __cov_RUl1CI2V4EBN5GkunSff5g.b['1'][1]++;
            }
            __cov_RUl1CI2V4EBN5GkunSff5g.s['29']++;
            return res.join('');
        };
        __cov_RUl1CI2V4EBN5GkunSff5g.s['30']++;
        Arg.prototype._requiredText = function () {
            __cov_RUl1CI2V4EBN5GkunSff5g.f['7']++;
            __cov_RUl1CI2V4EBN5GkunSff5g.s['31']++;
            return 'Missing required argument:\n  ' + this._usage();
        };
        __cov_RUl1CI2V4EBN5GkunSff5g.s['32']++;
        Arg.prototype.reject = Cmd.prototype.reject;
        __cov_RUl1CI2V4EBN5GkunSff5g.s['33']++;
        Arg.prototype.end = Cmd.prototype.end;
        __cov_RUl1CI2V4EBN5GkunSff5g.s['34']++;
        Arg.prototype.apply = Cmd.prototype.apply;
        __cov_RUl1CI2V4EBN5GkunSff5g.s['35']++;
        return Arg;
    }();
}.call(this));
