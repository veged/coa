'use strict';

/**
 * Rejection marker for synchronous flow control.
 * Used to detect rejected values in synchronous parsing loops.
 */
class Rejection {
    constructor(reason) {
        this.reason = reason;
    }

    toPromise() {
        return Promise.reject(this.reason);
    }
}

function isRejection(val) {
    return val instanceof Rejection;
}

module.exports = { Rejection, isRejection };
