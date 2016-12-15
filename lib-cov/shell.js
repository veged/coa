if (typeof global.__coverage__ === 'undefined') { global.__coverage__ = {}; }
if (!global.__coverage__['/Users/jordan/Projects/coa/lib/shell.js']) {
   global.__coverage__['/Users/jordan/Projects/coa/lib/shell.js'] = {"path":"/Users/jordan/Projects/coa/lib/shell.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},"b":{"1":[0,0],"2":[0,0]},"f":{"1":0,"2":0,"3":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":12}}},"2":{"name":"(anonymous_2)","line":3,"loc":{"start":{"line":3,"column":21},"end":{"line":3,"column":33}}},"3":{"name":"(anonymous_3)","line":8,"loc":{"start":{"line":8,"column":19},"end":{"line":8,"column":31}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":17,"column":14}},"2":{"start":{"line":3,"column":2},"end":{"line":6,"column":4}},"3":{"start":{"line":4,"column":4},"end":{"line":4,"column":88}},"4":{"start":{"line":5,"column":4},"end":{"line":5,"column":47}},"5":{"start":{"line":8,"column":2},"end":{"line":15,"column":4}},"6":{"start":{"line":9,"column":4},"end":{"line":9,"column":41}},"7":{"start":{"line":10,"column":4},"end":{"line":14,"column":5}},"8":{"start":{"line":11,"column":6},"end":{"line":11,"column":27}},"9":{"start":{"line":13,"column":6},"end":{"line":13,"column":15}}},"branchMap":{"1":{"line":4,"type":"cond-expr","locations":[{"start":{"line":4,"column":30},"end":{"line":4,"column":62}},{"start":{"line":4,"column":65},"end":{"line":4,"column":87}}]},"2":{"line":10,"type":"if","locations":[{"start":{"line":10,"column":4},"end":{"line":10,"column":4}},{"start":{"line":10,"column":4},"end":{"line":10,"column":4}}]}}};
}
var __cov_5RTH91DksdFpey9CL37YKQ = global.__coverage__['/Users/jordan/Projects/coa/lib/shell.js'];
__cov_5RTH91DksdFpey9CL37YKQ.s['1']++;
(function () {
    __cov_5RTH91DksdFpey9CL37YKQ.f['1']++;
    __cov_5RTH91DksdFpey9CL37YKQ.s['2']++;
    exports.unescape = function (w) {
        __cov_5RTH91DksdFpey9CL37YKQ.f['2']++;
        __cov_5RTH91DksdFpey9CL37YKQ.s['3']++;
        w = w.charAt(0) === '"' ? (__cov_5RTH91DksdFpey9CL37YKQ.b['1'][0]++, w.replace(/^"|([^\\])"$/g, '$1')) : (__cov_5RTH91DksdFpey9CL37YKQ.b['1'][1]++, w.replace(/\\ /g, ' '));
        __cov_5RTH91DksdFpey9CL37YKQ.s['4']++;
        return w.replace(/\\("|'|\$|`|\\)/g, '$1');
    };
    __cov_5RTH91DksdFpey9CL37YKQ.s['5']++;
    exports.escape = function (w) {
        __cov_5RTH91DksdFpey9CL37YKQ.f['3']++;
        __cov_5RTH91DksdFpey9CL37YKQ.s['6']++;
        w = w.replace(/(["'$`\\])/g, '\\$1');
        __cov_5RTH91DksdFpey9CL37YKQ.s['7']++;
        if (w.match(/\s+/)) {
            __cov_5RTH91DksdFpey9CL37YKQ.b['2'][0]++;
            __cov_5RTH91DksdFpey9CL37YKQ.s['8']++;
            return '"' + w + '"';
        } else {
            __cov_5RTH91DksdFpey9CL37YKQ.b['2'][1]++;
            __cov_5RTH91DksdFpey9CL37YKQ.s['9']++;
            return w;
        }
    };
}.call(this));
