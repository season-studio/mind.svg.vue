const words = {

}

let debugStorage = undefined;

export function debug(_storage) {
    debugStorage = _storage;
}

export function map(_new) {
    return Object.assign(words, _new);
}

export function get() {
    const count = arguments.length;
    let ret = "";
    for (let idx = 0; idx < count; idx++) {
        const item = arguments[idx];
        const found = words[item];
        ret += found || item;
        debugStorage && (debugStorage[item] = "");
    }
    return ret;
}
