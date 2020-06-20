<template>
    <div :class="`image-ctrl-box ${panelClass}`" 
        :style="Object.assign(positionStyle, panelStyle)"
        tabindex="-1">
        <item-with-tip :tip="_T('resize image')" class="image-resize-button">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0, 0, 40, 40" @mousedown.stop="onTriggerResizeIcon">
                <path d="M19 1L27 9H24V13L23 14H15L14 13V9H11L19 1M29 11L37 19L29 27V24H25L24 23V24 15L25 14H29V11M11 29H14V25L15 24H23L24 25V29H27L19 37L11 29M9 27V24H13L14 23V15L13 14H9V11L1 19L9 27M16 19A2 2 0 1 1 22 19A2 2 0 1 1 16 19" />
            </svg>
        </item-with-tip>
        <item-with-tip :tip="_T('pick image')" class="image-ctrl-button image-pick-button" @click="onPickImage">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20">
                <path d="M5 8V3H9L11 4.5H17V16H5L2 8H14L17 16" />
            </svg>
        </item-with-tip>
        <item-with-tip :tip="_T('delete image')" class="image-ctrl-button image-delete-button" @click="$emit('delete-image', topic)">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20">
                <path d="M3 4H17M7 4V2H13V4M4 6L6 16H14L16 6M7 6L8 14M13 6L12 14M10 6V12" />
            </svg>
        </item-with-tip>
    </div>
</template>

<style>
    .image-ctrl-box {
        border: 1px dashed #999;
        position: absolute;
        z-index: 999;
        box-sizing: border-box;
        outline: none;
    }

    .image-resize-button {
        border: 1px solid #999;
        border-radius: 10px;
        position: absolute;
        float: right;
        right: -10px;
        bottom: -10px;
        width: 20px;
        height: 20px;
        box-sizing: border-box;
        fill: rgba(128, 128, 128, 0.5);
        cursor: nwse-resize;
    }

    .image-resize-button:hover {
        border: 1px dashed #09f;
        fill: rgba(0, 153, 255, 0.6);
        cursor: nwse-resize;
    }

    .image-ctrl-button {
        fill: none;
        stroke: rgba(128, 128, 128, 0.5);
        stroke-width: 1;
        border: 1px dashed transparent;/* #999; */
        border-radius: 6px;
        position: absolute;
        float: right;
    }

    .image-ctrl-button:hover {
        stroke: rgba(0, 153, 255, 0.6);
        border: 1px dashed #09f;
    }

    .image-pick-button {
        right: -26px;
        top: 0px;
    }

    .image-delete-button {
        right: -26px;
        top: 22px;
    }

    .image-delete-button:hover {
        stroke: rgba(255, 0, 0, 0.6);
        border-color: #f00;
    }
</style>

<script>
import itemWithTip from "./itemWithTip";
import { mouseButton, pickFile, imageExtNames } from "./js/utility";
import { get as _T } from "./js/translate";

export default {
    components: {
        itemWithTip
    },
    data() {
        return {
            showWidth: 0,
            showHeight: 0,
            clientTop: 0,
            clientLeft: 0,
            resizingHandler: undefined,
            submitResizingHandler: undefined
        }
    },
    computed: {
        positionStyle() {
            return {
                left: `${this.initZone.x}px`,
                top: `${this.initZone.y}px`,
                width: `${this.showWidth}px`,
                height: `${this.showHeight}px`
            }
        }
    },
    watch: {
        initZone(_value) {
            this.showWidth = _value.width;
            this.showHeight = _value.height;
        }
    },
    props: {
        panelClass: {
            type: String,
            default: ""
        },
        panelStyle: Object,
        initZone: {
            type: [Object, DOMRect],
            required: true
        },
        topic: {
            type: Object,
            required: true
        }
    },
    methods: {
        _T,
        onTriggerResizeIcon(_event) {
            if (mouseButton(_event) === 1) {
                const zone = this.$el.getBoundingClientRect();
                this.clientTop = zone.y;
                this.clientLeft = zone.x;
                document.addEventListener("mousemove", this.resizingHandler);
                document.addEventListener("mouseup", this.submitResizingHandler);
            }
        },
        onSubmitResizing() {
            document.removeEventListener("mousemove", this.resizingHandler);
            document.removeEventListener("mouseup", this.submitResizingHandler);
            this.$emit("resize", this.topic, this.showWidth, this.showHeight);
        },
        onMouseMove(_event) {
            if (mouseButton(_event) === 1) {
                this.showWidth = _event.clientX - this.clientLeft;
                this.showHeight = _event.clientY - this.clientTop;
            } else {
                this.onSubmitResizing();
            }
        },
        onPickImage() {
            pickFile(imageExtNames).then(_file => {
                this.$emit("set-image", this.topic, _file);
            });
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.resizingHandler = this.onMouseMove.bind(this);
            this.submitResizingHandler = this.onSubmitResizing.bind(this);
            this.showWidth = this.initZone.width || 0;
            this.showHeight = this.initZone.height || 0;
            this.$el.focus();
        })
    }
}
</script>