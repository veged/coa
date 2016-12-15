if (typeof global.__coverage__ === 'undefined') { global.__coverage__ = {}; }
if (!global.__coverage__['/Users/jordan/Projects/coa/lib/color.js']) {
   global.__coverage__['/Users/jordan/Projects/coa/lib/color.js'] = {"path":"/Users/jordan/Projects/coa/lib/color.js","s":{"1":0,"2":0,"3":0,"4":0},"b":{},"f":{"1":0},"fnMap":{"1":{"name":"(anonymous_1)","line":23,"loc":{"start":{"line":23,"column":16},"end":{"line":23,"column":33}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":11}},"2":{"start":{"line":4,"column":0},"end":{"line":21,"column":2}},"3":{"start":{"line":23,"column":0},"end":{"line":25,"column":2}},"4":{"start":{"line":24,"column":2},"end":{"line":24,"column":59}}},"branchMap":{}};
}
var __cov_QX5zZh07NEP0sMQiChQsWA = global.__coverage__['/Users/jordan/Projects/coa/lib/color.js'];
__cov_QX5zZh07NEP0sMQiChQsWA.s['1']++;
var colors;
__cov_QX5zZh07NEP0sMQiChQsWA.s['2']++;
colors = {
    black: '30',
    dgray: '1;30',
    red: '31',
    lred: '1;31',
    green: '32',
    lgreen: '1;32',
    brown: '33',
    yellow: '1;33',
    blue: '34',
    lblue: '1;34',
    purple: '35',
    lpurple: '1;35',
    cyan: '36',
    lcyan: '1;36',
    lgray: '37',
    white: '1;37'
};
__cov_QX5zZh07NEP0sMQiChQsWA.s['3']++;
exports.Color = function (c, str) {
    __cov_QX5zZh07NEP0sMQiChQsWA.f['1']++;
    __cov_QX5zZh07NEP0sMQiChQsWA.s['4']++;
    return [
        '\x1b[',
        colors[c],
        'm',
        str,
        '\x1b[m'
    ].join('');
};
