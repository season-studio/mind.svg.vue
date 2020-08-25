const SYMBOL_UNDO = Symbol("mind.svg.vue.history.undo");
const SYMBOL_REDO = Symbol("mind.svg.vue.history.redo");
const SYMBOL_INPROCESS = Symbol("mind.svg.vue.history.in.process");

/**
 * 历史记录对象
 */
export default class History {
    constructor () {
        this[SYMBOL_INPROCESS] = false;
        this.clear();
    }

    /**
     * 获取当前历史数
     */
    get count() {
        return {
            undo: this[SYMBOL_UNDO].length,
            redo: this[SYMBOL_REDO].length
        }
    }

    /**
     * 获取是否正在历史处理中的标志
     */
    get inProcess() {
        return this[SYMBOL_INPROCESS];
    }

    /**
     * 清空历史记录
     * @param {number} _type 0清空UNDO历史，1清空REDO历史，不传入参数表示清空所有历史
     */
    clear(_type) {
        if (arguments.length === 0) {
            this[SYMBOL_UNDO] = [];
            this[SYMBOL_REDO] = [];
        } else if (_type === 1) {
            this[SYMBOL_UNDO] = [];
        } else {
            this[SYMBOL_REDO] = [];
        }
    }

    /**
     * 将一个新的历史项压入栈
     * 注意：一旦有新的历史入栈，则redo历史就会被清空
     * @param {Object} _item 历史项描述对象，其中必须有undo函数和redo函数
     */
    push(_item) {
        if (_item && (typeof _item.undo === "function") && (typeof _item.redo === "function")) {
            this.clear(-1);
            this[SYMBOL_UNDO].push(_item);
        }
    }

    /**
     * 执行一次历史撤销
     * 被撤销的动作会进入redo历史中
     */
    undo() {
        const item = this[SYMBOL_UNDO].pop();
        if (item) {
            this[SYMBOL_INPROCESS] = true;
            this[SYMBOL_REDO].push(item);
            (typeof item.undo === "function") && (item.undo.apply(item.undoThis, item.undoArgs));
            this[SYMBOL_INPROCESS] = false;
        }
    }

    /**
     * 执行一次历史重做
     * 被重做的动作会重新进入undo历史中
     */
    redo() {
        const item = this[SYMBOL_REDO].pop();
        if (item) {
            this[SYMBOL_INPROCESS] = true;
            this[SYMBOL_UNDO].push(item);
            (typeof item.redo === "function") && (item.redo.apply(item.redoThis, item.redoArgs));
            this[SYMBOL_INPROCESS] = false;
        }
    }
}