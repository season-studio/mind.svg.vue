const words = {

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
    }
    return ret;
}
