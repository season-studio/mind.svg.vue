/**
 * 清空当前的导图，并用新数据显示一张导图
 * @param {Object} _data 新的导图数据
 */
export function showMind(_data) {
    this.mind.show(_data);
    return this;
}

/**
 * 获取当前焦点主题
 */ 
export function focusTopic() {
    return this.mind.focusTopic;
}

/**
 * 获取当前根主题
 */
export function rootTopic() {
    return this.mind.rootTopic;
}

/**
 * 让所有浮动的面板失效
 */
export function blurFloatPanel() {
    this.mainEdit && this.onConfirmTitle();
    this.imageCtrlData = undefined;
    this.submitPropertyPanel();
    this.$emit("blur-float-panel");
    return this;
}

/**
 * 在一定比例下让主题居中
 * @param {Topic} _topic 当前主题，如果不传入参数则使用根主题
 * @param {Number} _scale 缩放比例，如果不传入该参数则不修改当前缩放值
 */
export function toCenter(_topic, _scale) {
    (_scale !== undefined) && this.mind.scale(_scale);
    this.mind.toCenter(_topic);
    this.blurFloatPanel();
    return this;
}

/**
 * 缩放画布
 * @param {Number} _scale 缩放比例
 */
export function scale(_scale) {
    (_scale !== undefined) && this.mind.scale(_scale);
    this.blurFloatPanel();
    return this;
}

/**
 * 内容定位到画布的某个坐标处
 * @param {Number} _x x坐标点
 * @param {Number} _y y坐标点
 */
export function locate(_x, _y) {
    this.mind.move(_x, _y);
    this.blurFloatPanel();
    return this;
}

/**
 * 让主题进入主编辑模式
 * @param {Topic} _topic 当前主题，如果不传入参数则使用当前焦点主题
 */
export function editTopic(_topic) {
    _topic || (_topic = this.mind.focusTopic);
    if (_topic) {
        this.blurFloatPanel();
        this.mind.toCenter(_topic);
        _topic.focus(true);
        const editData = {
            topic: _topic
        };
        const itemZone = _topic.relativeZone(undefined, this.$refs.mainBox);
        const titleZone = _topic.relativeZone("title", this.$refs.mainBox);
        editData.top = titleZone.y;
        editData.left = titleZone.x;
        editData.titleWidth = titleZone.width;
        editData.titleHeight = titleZone.height;
        editData.underHeight = itemZone.y + itemZone.height - titleZone.y - titleZone.height;
        const topicData = _topic.topicData(); 
        editData.title = topicData.title;
        editData.hasMarkers = (topicData.markers !== undefined) && (Object.getOwnPropertyNames(topicData.markers).length > 0);
        editData.hasLabels = (topicData.labels !== undefined) && (topicData.labels instanceof Array) && (topicData.labels.length > 0);
        editData.hasHref = (topicData.href !== undefined);
        editData.hasImage = (topicData.image !== undefined);
        editData.hasNotes = (topicData.notes !== undefined);
        this.$nextTick(() => {
            this.mainEdit = editData;
            this.$nextTick(() => {
                const node = this.$el.querySelector("input.mind-title-input");
                node && node.focus();
            })
        });
    }
    return this;
}

/**
 * 删除主题
 * @param {Topic} _topic 要删除的主题，如果不传入参数则使用当前焦点主题
 */
export function deleteTopic(_topic) {
    _topic || (_topic = this.mind.focusTopic);
    if (_topic) {
        const parent = _topic.parent;
        this.blurFloatPanel();
        _topic.remove();
        parent && (this.toCenter(parent), parent.focus(true));
    }
    return this;
}

/**
 * 添加下属主题
 * @param {Topic} _topic 当前主题，如果不传入参数则使用当前焦点主题
 * @param {Object} _data 新主题的数据，若不传入则使用默认数据
 */
export function addSubTopic(_topic, _data) {
    _topic || (_topic = this.mind.focusTopic);
    if (_topic) {
        this.blurFloatPanel();
        const newTopic = _topic.addNewChild(_data);
        this.editTopic(newTopic);
    }
    return this;
}

/**
 * 添加兄弟主题
 * @param {Topic} _topic 当前主题，如果不传入参数则使用当前焦点主题
 * @param {Object} _data 新主题的数据，若不传入则使用默认数据
 */
export function addSiblingTopic(_topic, _data) {
    _topic || (_topic = this.mind.focusTopic);
    if (_topic) {
        this.blurFloatPanel();
        const parent = _topic.parent;
        if (parent) {
            const newTopic = parent.addNewChild(Object.assign({direction: _topic.direction()}, _data), false);
            newTopic && (newTopic.insertAsBrother(_topic, false, true), this.editTopic(newTopic));
        }
    }
    return this;
}

/**
 * 选中后一个兄弟主题
 * @param {Topic} _topic 当前主题，如果不传入参数则使用当前焦点主题
 */
export function selectNextSibling(_topic) {
    _topic || (_topic = this.mind.focusTopic);
    if (_topic) {
        this.blurFloatPanel();
        _topic = _topic.nextSibling;
        if (_topic) {
            _topic.focus(true);
            this.toCenter(_topic);
        }
    }
    return this;
}

/**
 * 选中前一个兄弟主题
 * @param {Topic} _topic 当前主题，如果不传入参数则使用当前焦点主题
 */
export function selectPreviousSibling(_topic) {
    _topic || (_topic = this.mind.focusTopic);
    if (_topic) {
        this.blurFloatPanel();
        _topic = _topic.previousSibling;
        if (_topic) {
            _topic.focus(true);
            this.toCenter(_topic);
        }
    }
    return this;
}

/**
 * 选中主题的父主题
 * @param {Topic} _topic 当前主题，如果不传入参数则使用当前焦点主题
 */
export function selectParent(_topic) {
    _topic || (_topic = this.mind.focusTopic);
    if (_topic) {
        this.blurFloatPanel();
        _topic = _topic.parent;
        if (_topic) {
            _topic.focus(true);
            this.toCenter(_topic);
        }
    }
    return this;
}

/**
 * 选中主题的下属子主题
 * @param {Topic} _topic 当前主题，如果不传入参数则使用当前焦点主题
 */
export function selectChild(_topic) {
    _topic || (_topic = this.mind.focusTopic);
    if (_topic) {
        this.blurFloatPanel();
        _topic = _topic.firstDescendant;
        if (_topic) {
            _topic.focus(true);
            this.toCenter(_topic);
        }
    }
    return this;
}

/**
 * 将画布内容折叠到某一等级
 * @param {Number} _level 折叠等级，0表示根主题，以下递增
 */
export function fold(_level) {
    this.blurFloatPanel();
    this.mind.fold(_level);
    return this;
}