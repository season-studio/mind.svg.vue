<template>
    <div :class="getClass('panelClass', 'tab-panel-main')" :style="panelStyle" tabindex="1" @blur.stop="onMainBlur" @mousedown.stop="nop" >
        <div class="tab-panel-header">
            <div v-for="(item, index) in tabs" :key="index" 
                :class="index === currentPanel ? 'tab-panel-caption tab-panel-caption-selected' : 'tab-panel-caption'" 
                @click="onSelectPanel(index)">
                {{ _T(typeof item === "string" ? item : item.id) }}
            </div>
            <div class="tab-panel-header-idle-bar">
                <slot name="header">&nbsp;</slot>
            </div>
        </div>
        <div class="tab-panel-content">
            <slot></slot>
        </div>
    </div>
</template>

<style>
    .tab-panel-main {
        padding: 3px;
        background-color: rgba(246, 246, 246, 0.8);
        border: 0px;
        border-radius: 6px;
        box-shadow: 0px 0px 6px rgba(128, 128, 128, 0.6);
        position: absolute;
        top: 0px;
        left: 0px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin: 0px;
        z-index: 999;
        outline: none;
        font-size: 10px;
        color: #333;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -khtml-user-select: none; /* Konqueror */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently not supported by any browser */
    }

    .tab-panel-header {
        margin: 0px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-end;
        font-size: 10px;
        width: 100%;
    }

    .tab-panel-caption {
        border-radius: 6px 6px 0px 0px;
        font-weight: bold;
        border: 1px dashed #ddd;
        background-color: rgba(226, 226, 226, 0.6);
        text-align: center;
        padding: 6px 6px 0px 6px;
    }

    .tab-panel-caption-selected {
        border-bottom: 1px solid rgba(0, 0, 0, 0);
        background-color: rgba(255, 255, 255, 0.9);
    }

    .tab-panel-header-idle-bar {
        border-bottom: 1px dashed #ddd;
        flex-grow: 1;
        justify-content: flex-end;
        align-items: flex-end;
        text-align: end;
        margin-right: 6px;
    }

    .tab-panel-content {
        border-radius: 0px 6px 6px 6px;
        font-weight: normal;
        border: 1px dashed #ddd;
        border-top: 0px;
        background-color: rgba(255, 255, 255, 0.9);
        text-align: left;
        padding: 6px;
        min-width: 170px;
    }
</style>

<script>

import { get as _T } from "./js/translate";

export default {
    data() {
        return {
            currentPanel: undefined,
            childBlurHandler: undefined
        }
    },
    props: {
        panelClass: String,
        panelStyle: Object,
        tabs: {
            type: Array,
            required: true,
            validator: function (_value) {
                return (_value instanceof Array) && (_value.length > 0);
            }
        },
        defaultPanel: {
            type: Number,
            default: 0
        }
    },
    methods: {
        _T,
        getClass(_item, _default) {
            return `${_default || ""} ${(this.customClass && this.customClass[_item]) || ""}`;
        },
        nop() {},
        blurCurrentPanel() {
            const index = this.currentPanel;
            if (index !== undefined) {
                const panelID = this.tabs[index];
                this.$emit("panel-blur", index, (typeof panelID === "string") ? panelID : panelID.id);
            }
        },
        onMainBlur(_event) {
            let realBlur = true;
            if (this.$el.isSameNode(_event.target)) {
                // 容器自身触引发的失去焦点的事件，如果新焦点在其子元素下则不算失去焦点，继续监听子元素的失去焦点事件
                const focusNode = _event.relatedTarget;
                if (focusNode) {
                    if (this.$el.isSameNode(focusNode.closest("div.tab-panel-main"))) {
                        realBlur = false;
                        focusNode.removeEventListener("blur", this.childBlurHandler);
                        focusNode.addEventListener("blur", this.childBlurHandler);
                    }
                }
            } else {
                // 容器下属的元素的失去焦点的事件, 如果新焦点是容器或者容器下的其他子元素，也不算失去焦点
                const focusNode = _event.relatedTarget;
                if (focusNode) {
                    if (this.$el.isSameNode(focusNode)) {
                        realBlur = false;
                    } else if (this.$el.isSameNode(focusNode.closest("div.tab-panel-main"))) {
                        realBlur = false;
                        focusNode.removeEventListener("blur", this.childBlurHandler);
                        focusNode.addEventListener("blur", this.childBlurHandler);
                    }
                }
            }
            if (realBlur) {
                this.blurCurrentPanel();
            }
        },
        onSelectPanel(_index) {
            if ((_index >= 0) && (_index < this.tabs.length) && (_index !== this.currentPanel)) {
                this.blurCurrentPanel();
                this.currentPanel = _index;
                const panelID = this.tabs[_index];
                this.$emit("panel-selected", _index, (typeof panelID === "string") ? panelID : panelID.id);
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.childBlurHandler = this.onMainBlur.bind(this);
            const len = this.tabs.length;
            let index = this.defaultPanel;
            this.currentPanel = (index = (index < 0) ? 0 : ((index >= len) ? (len - 1) : index));
            const panelID = this.tabs[index];
            this.$emit("panel-selected", index, (typeof panelID === "string" || !panelID) ? panelID : panelID.id);
            this.$nextTick(() => this.$el.focus());
        });
    }
}
</script>