<template>
    <div :class="panelClass" :style="panelStyle">
        <div class="labels-box">
            <div v-for="(item, index) in values" :key="index" class="label-item" :style="{backgroundColor:labelColor(item)}">
                <span>{{item}}</span>
                &nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="10" height="10" class="label-delete-button" @click="onDeleteLabel(index)">
                    <path d="M1 1L10 10 M10 1L1 10" />
                </svg>
            </div>
        </div>
        <div style="width:100%">
            <input v-if="inEditMode" class="label-input" @blur="onAddLabel" @keydown.enter.prevent.stop="onAddLabel" @keydown.esc.prevent.stop="onCancelAdd" @keydown.stop="nop" />
            <div v-else class="label-add-button" style="width: 100%" @click="onInvokeAdd">
                +&nbsp;{{_T("add")}}
            </div>
        </div>
    </div>
</template>

<style>
    .label-delete-button {
        fill: none;
        stroke: #fff;
        stroke-opacity: 0.6;
        stroke-width: 1;
    }

    .label-add-button {
        border: 1px dashed #09F;
        border-radius: 0px;
        color: #09f;
        text-align: center;
        padding: 6px 0px 6px 0px;
    }

    .label-add-button:hover {
        border: 1px dashed #09F;
        border-radius: 0px;
        color: #09f;
        text-align: center;
        font-weight: bold;
    }

    .label-input {
        width: 100%; 
        box-sizing: border-box;
        outline: none;
        font-size: 10px;
        padding: 6px;
        border: 1px solid rgba(128, 128, 128, 0.3);
        background-color: rgba(255, 255, 255, 0.9);
    }

    .labels-box {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        max-width: 260px;
    }

    .label-item {
        color: #fff;
        margin: 0px 3px 3px 0px;
        padding: 3px;
    }
</style>

<script>
import { get as _T } from "./js/translate";

export default {
    data() {
        return {
            inEditMode: false,
            isModified: false,
            values: undefined
        };
    },
    props: {
        panelClass: {
            type: String,
            default: ""
        },
        panelStyle: Object,
        labels: Array
    },
    methods: {
        _T,
        nop() {},
        labelColor(_str) {
            let ret = 0;
            const workStr = String(_str);
            for (let item of workStr) {
                ret += item.charCodeAt();
                if (ret > 360) {
                    ret %= 360;
                    break;
                }
            }
            return `hsl(${ret}, 100%, 26%)`;
        },
        getResult() {
            return this.values;
        },
        clear() {
            if (this.values && this.values.length > 0) {
                this.values = [];
                this.isModified = true;
                this.$forceUpdate();
            }
        },
        onDeleteLabel(_index) {
            (this.values instanceof Array) && (this.values.splice(_index, 1), this.isModified = true, this.$forceUpdate());
        },
        onInvokeAdd() {
            this.inEditMode = true;
            this.$nextTick(() => {
                const node = this.$el.querySelector("input.label-input");
                node && (node.focus(), node.value = "");
            });
        },
        onAddLabel() {
            const node = this.$el.querySelector("input.label-input");
            if (node && this.inEditMode) {
                const value = String(node.value).trim();
                value && ((this.values || (this.values = [])).push(value), this.isModified = true);
            }
            this.inEditMode = false;
        },
        onCancelAdd() {
            this.inEditMode = false;
        }
    },
    mounted() {
        this.values = this.labels;
    }
}
</script>