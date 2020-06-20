<template>
    <div :class="panelClass" :style="panelStyle">
        <div v-if="showValue || inEditLink" class="link-show-line">
            <div class="link-icon">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20">
                    <path d="M9 7L11 5A2 2 0 0 1 15 9L13 11M7 9L5 11A2 2 0 0 0 9 15L11 13M7 13L13 7" />
                </svg>
            </div>
            <input v-if="inEditLink" class="link-input" @blur="onConfirmLink" @keydown.enter.prevent.stop="onConfirmLink" @keydown.esc.prevent.stop="onCancelEdit" @keydown.stop="nop" />
            <div v-else class="link-field" @click="onTriggerLink">
                {{ showValue }}
            </div>
        </div>
        <div class="link-edit-line">
            <item-with-tip :tip="_T('add or modify the link')" class="link-edit-button" @click="onEditLink">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20">
                    <path d="M9 7L11 5A2 2 0 0 1 15 9L13 11M7 9L5 11A2 2 0 0 0 9 15L11 13M7 13L13 7" />
                </svg>
            </item-with-tip>
            <item-with-tip :tip="_T('add or modify connection attachment')" class="link-edit-button" @click="onPickAttachment">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20">
                    <path d="M5 8V3H9L11 4.5H17V16H5L2 8H14L17 16" />
                </svg>
            </item-with-tip>
        </div>
    </div>
</template>

<style>
    .link-show-line {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        height: 22px;
    }

    .link-icon {
        fill: none;
        stroke: #fff;
        stroke-width: 1.5;
        stroke-opacity: 0.8;
        background-color: #09f;
        border: 1px solid #569BC9;
        border-right: 0;
        border-radius: 6px 0px 0px 6px;
        height: 100%;
        width: 22px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .link-field {
        border: 1px solid #569BC9;
        padding: 0px 3px 0px 3px;
        border-left: 0;
        border-radius: 0px 6px 6px 0px;
        height: 100%;
        max-width: 150px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        text-overflow : ellipsis;
        overflow: hidden;
    }

    .link-field:hover {
        background-color: #09f;
        color: #fff;
    }

    .link-input {
        border: 1px solid #569BC9;
        padding: 0px 3px 0px 3px;
        border-left: 0;
        border-radius: 0px 6px 6px 0px;
        height: 24px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        outline: none;
        box-sizing: border-box;
        background-color: rgba(255, 255, 255, 0.9);
    }

    .link-edit-line {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: flex-end;
    }

    .link-edit-button {
        margin: 3px 0px 0px 3px;
        border: 1px dashed #09f;
        fill: none;
        stroke: #09f;
        stroke-width: 1.5;
        stroke-opacity: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        min-width: 22px;
        height: 22px;
        padding: 3px;
        border-radius: 6px;
    }

    .link-edit-button:hover {
        color: #fff;
        stroke: #fff;
        background-color: #09f;
        border: 1px solid #569BC9;
    }
</style>

<script>
import { Constants } from "mind.svg.js";
import itemWithTip from "./itemWithTip";
import * as utility from "./js/utility";
import { get as _T } from "./js/translate";

export default {
    components: {
        itemWithTip
    },
    data() {
        return {
            isModified: false,
            showValue: null,
            isAttachment: false,
            inEditLink: false
        }
    },
    props: {
        panelClass: {
            type: String,
            default: ""
        },
        panelStyle: Object,
        attachmentPrefix: {
            type: String,
            default: Constants.ATTACHMENT_LINK_PREFIX
        },
        initValue: String,
        queryAttachmentURL: Function,
        insertAttachment: Function
    },
    methods: {
        _T,
        nop() {},
        parseInitValue() {
            if (this.initValue && String(this.initValue).startsWith(this.attachmentPrefix)) {
                this.isAttachment = true;
                this.showValue = String(this.initValue).substr(this.attachmentPrefix.length);
            } else {
                this.showValue = this.initValue;
                this.isAttachment = false;
            }
        },
        getResult() {
            return this.isAttachment ? `${this.attachmentPrefix}${this.showValue}` : this.showValue;
        },
        clear() {
            this.isModified = false;
            this.showValue = null;
            this.isModified = true;
        },
        onTriggerLink() {
            if (this.isAttachment) {
                this.queryAttachmentURL && this.queryAttachmentURL(this.showValue, (_url) => {
                    utility.dynInvokeLink(_url, "_blank");
                });
            } else {
                utility.dynInvokeLink(this.showValue, "_blank");
            }
        },
        onEditLink() {
            this.inEditLink = true;
            this.$nextTick(() => {
                if (!this.isAttachment) {
                    const node = this.$el.querySelector("input.link-input");
                    node && (node.value = this.showValue, node.focus());
                }
            });
        },
        onConfirmLink() {
            const node = this.$el.querySelector("input.link-input");
            if (node && this.inEditLink) {
                const value = String(node.value).trim();
                if (value && (this.isAttachment || (value !== this.showValue))) {
                    this.isAttachment = false;
                    this.isModified = true;
                    this.showValue = value;
                }
            }
            this.inEditLink = false;
        },
        onCancelEdit() {
            this.inEditLink = false;
        },
        onPickAttachment() {
            utility.pickFile().then(_file => {
                this.insertAttachment && this.insertAttachment(_file, (_name) => {
                    this.isAttachment = true;
                    this.isModified = true;
                    this.showValue = _name;
                });
            });
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.parseInitValue();
        });
    }
}
</script>