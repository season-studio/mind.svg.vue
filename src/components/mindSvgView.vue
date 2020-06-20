<template>
    <div ref="mainBox" :class="`mind-svg-view-basic ${viewClass || ''}`"
        @mousemove="onMouseMove" 
        @mousedown="onMouseDown" 
        @mouseup="onMouseUp" 
        @mousewheel="onMouseWheel" 
        @mouseleave="endMouseAction"
        @dblclick="onDoubleClick"
        @keydown="onKeydown"
        @contextmenu.prevent.stop="nop">
        <div class="mind-svg-tool-box">
            <item-with-tip :tip="_T('move canvas', '\n', 'push down mouse\'s left button and move the mouse')" text-align="right" class="mind-svg-tool-item mind-svg-tool-move-button">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="38" height="38" @mousedown="onMoveTrigger">
                    <path d = "M19 1L27 9H24V13L23 14H15L14 13V9H11L19 1M29 11L37 19L29 27V24H25L24 23V24 15L25 14H29V11M11 29H14V25L15 24H23L24 25V29H27L19 37L11 29M9 27V24H13L14 23V15L13 14H9V11L1 19L9 27M16 19A2 2 0 1 1 22 19A2 2 0 1 1 16 19" />
                </svg>
            </item-with-tip>
            <item-with-tip :tip="_T('zoom canvas', '\n', 'push down mouse\'s left button and move up and down', '\n', 'or wheel the mouse')" text-align="right" class="mind-svg-tool-item mind-svg-tool-zoom-button">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="38" height="38" @mousedown="onZoomTrigger">
                    <path d = "M2 33L15 22A13 13 0 1 1 17 24L5 36Q1 37 2 33M15 14A8.5 8.5 0 1 0 35 13.5A8.5 8.5 0 1 0 15 14M19 13H24V8H26V13H31V15H26V20H24V15H19V13" />
                </svg>
            </item-with-tip>
            <item-with-tip :tip="_T('move canvas to center')" class="mind-svg-tool-item" @click="onCenterTrigger">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="38" height="38">
                    <path transform="matrix(0.8,0,0,0.8,4,4)" d = "M4 18H1V1H18V4L16 6H6V16L4 18M20 4V1H37V18H34L32 16V6H22L20 4M34 20H37V37H20V34L22 32H32V22L34 20M18 34V37H1V20H4L6 22V32H16L18 34M11 18H18V11H20V18H27V20H20V27H18V20H11V18" />
                </svg>
            </item-with-tip>
        </div>
        <div v-if="mainEdit" class="mind-main-edit-box" :style="{paddingBottom:`${this.mainEdit.underHeight}px`, top:`${this.mainEdit.top}px`, left:`${this.mainEdit.left}px`}">
            <input class="mind-title-input" :style="{width:`${this.mainEdit.titleWidth}px`, height:`${this.mainEdit.titleHeight}px`}" v-model="mainEdit.title"
                @keydown.enter.stop="onConfirmTitle" @keydown.esc.prevent.stop="onRestoreTitle" @keydown.stop="nop" />
            <div class="mind-main-edit-toolbar mind-main-edit-toolbar-top">
                <item-with-tip :tip="_T('add sub topic')" class="mind-main-edit-button" @click="onAddSubTopic">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="18">
                        <path d="M1 10H5M3 8V12M7 10V6H17V10H7V14H17V10" />
                    </svg>
                </item-with-tip>
                <item-with-tip :tip="_T('add sibling topic')" class="mind-main-edit-button" @click="onAddSiblingTopic">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="18">
                        <path d="M3 3H15V7H3V3M6 10H12M9 8V12M3 13H15V17H3V13" />
                    </svg>
                </item-with-tip>
                <item-with-tip :tip="_T('delete this topic')" class="mind-main-edit-button mind-main-delete-button" @click="onDeleteTopic">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="18">
                        <path d="M3 4H17M7 4V2H13V4M4 6L6 16H14L16 6M7 6L8 14M13 6L12 14M10 6V12" />
                    </svg>
                </item-with-tip>
            </div>
            <div class="mind-main-edit-toolbar mind-main-edit-toolbar-bottom">
                {{_T("add")}}:&nbsp;&nbsp;
                <item-with-tip :tip="_T('markers')" v-if="!mainEdit.hasMarkers" item-class="mind-main-edit-button" @click="onInvokePropertyFromMainEdit('markers')">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="22" width="22">
                        <path d="M3 19V4H13V13H3M13 8H19V16H10V13" />
                    </svg>
                </item-with-tip>
                <item-with-tip :tip="_T('labels')" v-if="!mainEdit.hasLabels" item-class="mind-main-edit-button" @click="onInvokePropertyFromMainEdit('labels')">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="22" width="22">
                        <path d="M3 10.5L7 5H19V17H7L3 10.5M6 10.5A2 2 0 1 1 10 10.5A2 2 0 1 1 6 10.5" />
                    </svg>
                </item-with-tip>
                <item-with-tip :tip="_T('image')" v-if="!mainEdit.hasImage" item-class="mind-main-edit-button" @click="onInvokePickImageFromMainEdit">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="22" width="22">
                        <path d="M3 5H18V17H3V5M3 16L7 10L10 13L13 7L18 13" />
                    </svg>
                </item-with-tip>
                <item-with-tip :tip="_T('notes')" v-if="!mainEdit.hasNotes" item-class="mind-main-edit-button" @click="onInvokePropertyFromMainEdit('notes')">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="22" width="22">
                        <path d="M3 1H13L18 6V20H3V1M13 1V6H18M6 4H10M6 7H10M6 10H15M6 13H15M6 16H13" />
                    </svg>
                </item-with-tip>
                <item-with-tip :tip="_T('link or attachment')" v-if="!mainEdit.hasHref" item-class="mind-main-edit-button" @click="onInvokePropertyFromMainEdit('href')">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="22" width="22">
                        <path d="M9 7L11 5A2 2 0 0 1 15 9L13 11M7 9L5 11A2 2 0 0 0 9 15L11 13M7 13L13 7" />
                    </svg>
                </item-with-tip>
            </div>
        </div>
        <tab-panel ref="propertyPanel" v-if="propertyData !== undefined" panel-class="mind-property-box" :panel-style="propertyPosition" :tabs="propertyTabs" :default-panel="propertyData.index"
            @panel-blur="onPropertyPanelBlur" @panel-selected="onPropertyPanelSelected">
            <template v-slot:header>
                <item-with-tip :tip="_T('clear property in this page')" class="mind-property-clear-button" @click="onClearProperty">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="11" height="11">
                        <path d="M1 2H10M4 1H7M2 3.5L3 10H8L9 3.5M4 3.5L4.5 8.5M7 3.5L6.5 8.5" />
                    </svg>
                </item-with-tip>
            </template>
            <labels-panel ref="labels" v-if="propertyData.id === 'labels'" :labels="propertyData.value" />
            <notes-panel ref="notes" v-else-if="propertyData.id === 'notes'" :initValue="propertyData.value" />
            <link-panel ref="href" v-else-if="propertyData.id === 'href'" :initValue="propertyData.value" :insert-attachment="onInsertAttachmentForHref" :queryAttachmentURL="onQueryAttachmentURLfromProperty" />
            <markers-panel ref="markers" v-else-if="propertyData.id === 'markers'" :initValue="propertyData.value" :collection="markerDefs" />
        </tab-panel>
        <image-box v-if="imageCtrlData" :init-zone="imageCtrlData.initZone" :topic="imageCtrlData.topic"
            @resize="onResizeImage" @set-image="onSetImage" @delete-image="onDeleteImage" />
    </div>
</template>

<style>
    .mind-svg-view-basic {
        position: relative;
    }

    .mind-property-clear-button {
        fill: none;
        stroke: #bbb;
        stroke-opacity: 0.6;
        stroke-width: 1;
    }

    .mind-property-clear-button:hover {
        fill: none;
        stroke: #c00;
        stroke-opacity: 0.6;
        stroke-width: 1;
    }

    .mind-main-edit-box {
        position: absolute;
        z-index: 999;
    }

    .mind-title-input {
        outline: none;
        box-sizing: border-box;
    }

    .mind-main-edit-toolbar {
        position: absolute;
        background-color: rgba(255, 255, 255, 0.9);
        border: 0px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-items: center;
        align-items: center;
        font-size: 13px;
        box-shadow: 0px 0px 6px #ccc;
        padding: 3px 6px 3px 6px;
        border-radius: 6px;
        white-space: nowrap;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -khtml-user-select: none; /* Konqueror */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently not supported by any browser */
    }

    .mind-main-edit-toolbar-top {
        top: -33px;
        right: 0px;
    }

    .mind-main-edit-toolbar-bottom {
        bottom: -33px;
        right: 0px;
    }

    .mind-main-edit-button {
        fill: none;
        stroke: rgba(128, 128, 128, 0.5);
        stroke-width: 1;
        border: 1px dashed transparent;
        border-radius: 6px;
        position: relative;
    }

    .mind-main-edit-button:hover {
        stroke: rgba(0, 153, 255, 0.6);
        border: 1px dashed #09f;
    }

    .mind-main-delete-button:hover {
        stroke: rgba(255, 0, 0, 0.6);
        border-color: #f00;
    }

    .mind-svg-tool-box {
        position: relative;
        padding: 6px;
        border: 0px;
        border-radius: 6px;
        background-color: transparent;
        box-shadow: none;
        top: 0px;
        z-index: 99;
        margin: 17px;
        display: flex;
        flex-direction: column;
        float: right;
        justify-content: center;
        align-items: flex-start;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -khtml-user-select: none; /* Konqueror */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently not supported by any browser */
    }

    .mind-svg-tool-item {
        fill: #ddd;
        fill-opacity: 0.6;
        stroke: #ddd;
        stroke-opacity: 0.3;
        stroke-width: 0.5;
        font-size: 10px;
        margin: 0px 0px 10px 0px;
    }

    .mind-svg-tool-item:hover {
        fill: #bbb;
        fill-opacity: 0.8;
        stroke: #ddd;
        stroke-opacity: 0.3;
    }

    .mind-svg-tool-move-button {
        cursor: move;
    }

    .mind-svg-tool-zoom-button {
        cursor: n-resize;
    }

</style>

<script>
import { MindSVG, Event, EVENT, Constants, AttachmentCollection } from "mind.svg.js";
import "mind.svg.js/css/mind.svg.default.css";

import tabPanel from "./tabPanel";
import labelsPanel from "./labelsPanel";
import notesPanel from "./notesPanel";
import linkPanel from "./linkPanel";
import markersPanel from "./markersPanel";
import imageBox from "./imageBox";
import itemWithTip from "./itemWithTip";
import { mouseButton, pickFile, imageExtNames } from "./js/utility";
import * as cmd from "./js/cmd";
import { get as _T } from "./js/translate";

// 定义默认配置
const defaultMindConfig = {
    maxScale: 3,
    minScale: 0.3
};

// 定义鼠标控制动作的ID号
const MOUSEACTION_MOVE = 1;
const MOUSEACTION_ZOOM = 2;

// 鼠标动作处理程序映射表
const mouseActionMap = {
    /**
     * 移动画布的处理程序
     */
    [MOUSEACTION_MOVE](_event) {
        const log = this.mouseLog;
        if ((log.button === undefined) || (mouseButton(_event) === log.button)) {
            if (log && log.x !== undefined && log.y !== undefined) {
                let deltaX = parseInt(log.x - _event.clientX);
                let deltaY = parseInt(log.y - _event.clientY);
                this.mind.moveBy(isNaN(deltaX) ? 0 : deltaX, isNaN(deltaY) ? 0 : deltaY);
            }
            log.x = _event.clientX;
            log.y = _event.clientY;
        } else {
            this.endMouseAction();
        }
    },

    /**
     * 缩放画布的处理程序 
     */
    [MOUSEACTION_ZOOM](_event) {
        const log = this.mouseLog;
        if ((log.button === undefined) || (mouseButton(_event) === log.button)) {
            if (log && log.y !== undefined) {
                if (log.y > _event.clientY) {
                    this.mind.scaleBy(1.25);
                } else if (log.y < _event.clientY) {
                    this.mind.scaleBy(0.8);
                }
            }
            log.y = _event.clientY;
        } else {
            this.endMouseAction();
        }
    }
}

// 下部细节数据显示标题映射表
const propertyTabs = [{
    id: "labels",
    events: [EVENT.EVENT_INVOKE_LABELS, EVENT.EVENT_INVOKE_LABEL_MORE]
}, {
    id: "markers",
    events: [EVENT.EVENT_INVOKE_MARKERS]
},{
    id: "notes",
    events: [EVENT.EVENT_INVOKE_NOTES]
},{
    id: "href",
    events: [EVENT.EVENT_INVOKE_LINK]
}];

// 按键别名表
const keyAlias = {
    "arrowright": "right",
    "arrowleft": "left",
    "arrowup": "up",
    "arrowdown": "down",
    "escape": "esc"
}

// 组件的导出对象
export default {
    components: {
        tabPanel,
        labelsPanel,
        notesPanel,
        linkPanel,
        markersPanel,
        imageBox,
        itemWithTip
    },
    data () {
        return {
            mind: undefined,
            attachments: new AttachmentCollection(),
            mouseAction: undefined,
            mouseLog: undefined,
            inlineInputValue: "",
            propertyData: undefined,
            propertyPosition: undefined,
            propertyTabs,
            markerDefs: {},
            imageCtrlData: undefined,
            mainEdit: undefined
        }
    },
    props: {
        viewClass: String,
        propertyPanelTopMargin: {
            type: Number,
            default: 6
        },
        moveCursor: String,
        zoomCursor: String,
        mindConfig: Object,
        keyActionMap: Object
    },
    watch: {
        mindConfig(_value) {
            _value && this.mind.config(_value);
        }
    },
    methods: {
        _T,
        // 空处理
        nop() {},
        // 提取mind中的预定义元素
        pickDefs() {
            const markerDefs = (this.markerDefs = {});
            for (const item of this.mind.getDefs()) {
                if (item.type !== "icon") {
                    const collection = (markerDefs[item.type] || (markerDefs[item.type] = {}));
                    collection[item.value] = item.node.outerHTML;
                }
            }
        },
        // 启动鼠标控制动作
        startMouseAction(_action, _log) {
            this.mouseAction = _action;
            this.mouseLog = _log;
            this.blurFloatPanel();
        },
        // 结束鼠标控制动作
        endMouseAction() {
            this.mouseAction = undefined;
            this.mouseLog = undefined;
            this.mind.svg.style("cursor", "auto");
        },
        // 启动画布移动控制
        startMoveCtrl(_event, _button) {
            this.startMouseAction(MOUSEACTION_MOVE, {
                x: _event.clientX, 
                y: _event.clientY,
                button: _button
            });
            this.mind.svg.style("cursor", this.moveCursor || "move");
        },
        // 启动画布缩放控制
        startZoomCtrl(_event, _button) {
            this.startMouseAction(MOUSEACTION_ZOOM, {
                y: _event.clientY,
                button: _button
            });
            this.mind.svg.style("cursor", this.zoomCursor || "n-resize");
        },
        // 由控制图标触发画布移动的起始
        onMoveTrigger(_event) {
            if (mouseButton(_event) === 1) {
                this.startMoveCtrl(_event, 1);
            }
            Event.handledEvent(_event, false);
        },
        // 由控制图标触发画布缩放的起始
        onZoomTrigger(_event) {
            if (mouseButton(_event) === 1) {
                this.startZoomCtrl(_event, 1);
            }
            Event.handledEvent(_event, false);
        },
        // 触发画布居中
        onCenterTrigger() {
            this.toCenter(undefined, 1);
        },
        // 接收到鼠标移动，调用具体的鼠标控制画布的处理
        onMouseMove(_event) {
            if (Event.fromMindSVG(_event, this.mind)) {
                const fn = mouseActionMap[this.mouseAction];
                (typeof fn === "function") && fn.call(this, _event);
            }
        },
        // 接收到鼠标按下，触发画布控制动作的起始
        onMouseDown(_event) {
            if (Event.fromMindSVG(_event, this.mind)) {
                const button = mouseButton(_event);
                if ((button === 1) || (button === 2)) {
                    this.startMoveCtrl(_event, button);
                }
            }
        },
        // 接收到鼠标弹起，结束正在进行的画布控制动作
        onMouseUp() {
            this.endMouseAction();
        },
        // 由鼠标滚轮事件触发画布的缩放
        onMouseWheel(_event) {
            if (_event.deltaY > 0) {
                this.mind.scaleBy(1.25);
            } else {
                this.mind.scaleBy(0.8);
            }
            this.blurFloatPanel();
            Event.handledEvent(_event);
        },
        // 双击触发主编辑功能
        onDoubleClick(_event) {
            const stamp = Event.eventStamp(_event);
            if (stamp === Constants.STAMP_TOPIC_TITLE) {
                this.editTopic();
            }
        },
        // 重载标题内容到编辑框
        onRestoreTitle() {
            if (this.mainEdit && this.mainEdit.topic) {
                this.mainEdit.title = this.mainEdit.topic.topicData("title");
                this.blurFloatPanel();
                this.$nextTick(() => {
                    this.mind.container.node.focus();
                });
            }
        },
        // 确认了标题的输入
        onConfirmTitle() {
            if (this.mainEdit && this.mainEdit.topic) {
                const newValue = String(this.mainEdit.title).trim();
                const oriValue = this.mainEdit.topic.topicData("title");
                if (newValue !== oriValue) {
                    this.mainEdit.topic.topicData("title", newValue);
                }
            }
            this.mainEdit = undefined;
        },
        // 删除主题
        onDeleteTopic() {
            if (this.mainEdit && this.mainEdit.topic) {
                this.mainEdit.topic.remove();
            }
            this.mainEdit = undefined;
        },
        // 添加子主题
        onAddSubTopic() {
            if (this.mainEdit && this.mainEdit.topic) {
                this.addSubTopic(this.mainEdit.topic);
            }
            this.mainEdit = undefined;
        },
        // 添加同级主题
        onAddSiblingTopic() {
            if (this.mainEdit && this.mainEdit.topic) {
                this.addSiblingTopic(this.mainEdit.topic);
            }
            this.mainEdit = undefined;
        },
        // 从主编辑画面触发属性页
        onInvokePropertyFromMainEdit(_id) {
            if (this.mainEdit && this.mainEdit.topic) {
                for (let item of propertyTabs) {
                    if (item.id === _id) {
                        this.mainEdit.topic.fireEvent(item.events[0], {topic:this.mainEdit.topic});
                        break;   
                    }
                }
            }
            this.mainEdit = undefined;
        },
        // 从主编辑画面触发添加图片
        onInvokePickImageFromMainEdit() {
            if (this.mainEdit && this.mainEdit.topic) {
                pickFile(imageExtNames).then(_file => {
                    this.onSetImage(this.mainEdit.topic, _file);
                    this.mainEdit = undefined;
                });
            }
        },
        // 触发下端属性的显示和编辑
        onInvokeUnderLine(_event) {
            const topic = _event.detail.value.topic;
            // 定位默认的tab页
            let index = 0;
            for (let idx in propertyTabs) {
                const item = propertyTabs[idx];
                if (item.events.indexOf(_event.type) >= 0) {
                    index = Number(idx);
                    break;
                }
            }
            // 初始化数据
            if (!this.propertyData) {
                this.propertyData = {
                    index,
                    topic,
                    modified: {}
                };
                // 初始化显示位置
                const itemZone = topic.relativeZone(undefined, this.$refs.mainBox);
                const titleZone = topic.relativeZone("title", this.$refs.mainBox);
                this.propertyPosition = {
                    left: `${titleZone.x}px`,
                    top: `${itemZone.y + itemZone.height + this.propertyPanelTopMargin}px`
                };
            }
        },
        // 触发清除当前页的所有属性
        onClearProperty() {
            const propertys = this.propertyData;
            if (propertys) {
                // 如果之前有属性在处理中，则记录被修改的属性
                if (propertys.id) {
                    const panel = this.$refs[propertys.id];
                    panel && (typeof panel.clear === "function") && panel.clear();
                }
            }
        },
        // 某个具体的属性页失去焦点了，提取属性页里面的数据进行缓存
        onPropertyPanelBlur(_index, _id) {
            const propertys = this.propertyData;
            if (propertys) {
                const panel = this.$refs[_id];
                if (panel && panel.isModified) {
                    propertys.modified[_id] = panel.getResult();
                }
            }
        },
        // 属性页被选择，实行属性页数据的切换
        onPropertyPanelSelected(_index, _id) {
            const propertys = this.propertyData;
            if (propertys) {
                propertys.id = _id;
                propertys.value = (_id in propertys.modified) ? propertys.modified[_id] : propertys.topic.topicData(_id);
                this.$forceUpdate();
            }
        },
        // 属性页失去焦点，批量生效属性
        submitPropertyPanel() {
            const propertys = this.propertyData;
            if (propertys) {
                this.$refs.propertyPanel.blurCurrentPanel();
                if (propertys.topic && propertys.modified && (Object.getOwnPropertyNames(propertys.modified).length > 0)) {
                    propertys.topic.topicData(propertys.modified);
                    this.propertyData = undefined;
                }
            }
        },
        // 查询附件的链接
        onQueryAttachmentURLEvent(_event) {
            _event.detail && (_event.detail.result = String(this.attachments.item(_event.detail.value)))
        },
        // 查询附件的链接
        onQueryAttachmentURLfromProperty(_name, _cb) {
            (typeof _cb === "function") && _cb(String(this.attachments.item(_name)));
        },
        // 在链接编辑页面添加了附件
        onInsertAttachmentForHref(_file, _cb) {
            if (_file) {
                const checkRepeat = this.attachments.item(_file.name);
                const {name} = this.attachments.item(checkRepeat ? undefined : _file.name, _file);
                (typeof _cb === "function") && _cb(name);
                return true;
            }
        },
        // 显示图片控制框
        showImageCtrlBox(_topic, _width, _height) {
            if (_topic) {
                const initZone = _topic.relativeZone("image", this.$refs.mainBox);
                _width && (initZone.width = _width);
                _height && (initZone.height = _height);
                this.imageCtrlData = { initZone, topic: _topic };
            }
        },
        // 触发图片控制
        onInvokeImageControl(_event) {
            this.showImageCtrlBox(_event.detail.value.topic);
        },
        // 生效对图片大小的修改
        onResizeImage(_topic, _width, _height) {
            const image = _topic.topicData("image");
            if (image) {
                image.width = _width;
                image.height = _height;
                _topic && _topic.topicData("image", image);
                this.showImageCtrlBox(_topic);
                this.$forceUpdate();
            }
        },
        // 设置图片
        onSetImage(_topic, _file) {
            if (_topic && _file) {
                const checkRepeat = this.attachments.item(_file.name);
                const {name, value:attachment} = this.attachments.item(checkRepeat ? undefined : _file.name, _file);
                const img = new Image();
                img.onload = () => {
                    const {width:imgWidth} = _topic.titleZone;
                    const imgHeight = img.height * imgWidth / img.width
                    _topic.topicData("image", {
                        src: Constants.ATTACHMENT_LINK_PREFIX + name,
                        width: imgWidth,
                        height: imgHeight
                    });
                    this.showImageCtrlBox(_topic);
                    this.$forceUpdate();
                }
                img.src = String(attachment);
            }
        },
        // 清除图片
        onDeleteImage(_topic) {
            _topic && _topic.topicData("image", null);
            this.imageCtrlData = undefined;
        },
        // 按键按下，转义到按键对应的动作映射表中去
        onKeydown(_event) {
            let key = "";
            _event.ctrlKey && (key += "ctrl+");
            _event.altKey && (key += "alt+");
            const inputKey = String(_event.key).toLowerCase();
            key += keyAlias[inputKey] || inputKey;
            const fn = this.keyActionMap && this.keyActionMap[key];
            if (typeof fn === "function") {
                fn(this, this.mind, this.mind.focusTopic);
                Event.handledEvent(_event);
            } else if (typeof fn === "string") {
                const cmdFn = cmd[fn];
                (typeof cmdFn === "function") ? cmdFn.call(this, this.mind.focusTopic) : console.warn(`Unknown Command: ${fn}`);
                Event.handledEvent(_event);
            }
        }
    },
    mounted() {
        for (const cmdName in cmd) {
            this[cmdName] = cmd[cmdName].bind(this);
        }
        this.mind = new MindSVG(this.$refs.mainBox);
        this.mind.config(defaultMindConfig);
        this.mindConfig && this.mind.config(this.mindConfig);
        for (let item of propertyTabs) {
            for (let eventName of item.events) {
                this.mind.on(eventName, this.onInvokeUnderLine.bind(this));
            }
        }
        this.pickDefs();
        this.mind.on(EVENT.EVENT_INVOKE_IMAGE, this.onInvokeImageControl.bind(this));
        this.mind.on(EVENT.EVENT_QUERY_ATTACHMENT, this.onQueryAttachmentURLEvent.bind(this));
        this.mind.on(EVENT.EVENT_FOCUS_CHANGE, (_event) => this.$emit("focus-topic-changed", _event.detail.value));
        this.mind.on(EVENT.EVENT_END_DRAG, this.blurFloatPanel.bind(this));
    }
}
</script>