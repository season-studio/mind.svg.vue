<template>
    <div :class="`marker-panel-default ${panelClass}`" :style="panelStyle">
        <div class="marker-line" v-for="(list, type) in collection" :key="type">
            <div class="marker-name">{{_T(`marker-${type}`)}}</div>
            <div class="marker-list">
                <div @click="onSetData(type, undefined)"
                    :class="undefined === data[type] ? 'marker-selected' : 'marker-noselected'">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="22" width="22" class="marker-none">
                        <path d="M2 10A8 8 0 1 1 19 10A8 8 0 1 1 2 10M6 6L16 16" />
                    </svg>
                </div>
                <div v-for="(value, index) in list" :key="index" @click="onSetData(type, index)"
                    :class="String(index) === String(data[type]) ? 'marker-selected' : 'marker-noselected'">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="22" width="22" v-html="value"></svg>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .marker-panel-default {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .marker-line {
        display: grid;
        grid-template-columns: 50px auto;
        justify-content: flex-start;
        align-items: center;
        margin: 0px 0px 3px 0px;
    }

    .marker-name {
        text-align: justify;
        text-justify: inter-ideograph;
    }

    .marker-name:after{
        content: "";
        display: inline-block;
        width: 100%;
    }

    .marker-list {
        padding: 0px 0px 0px 6px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        max-width: 146px;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .marker-selected {
        border: 1px dashed rgba(128, 128, 128, 0.3);
        border-radius: 6px;
        background-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0px 0px 6px #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .marker-noselected {
        border: 1px dashed rgba(0, 0, 0, 0);
        border-radius: 6px;
        background-color: rgba(0, 0, 0, 0);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .marker-none {
        fill: none;
        stroke: #09f;
        stroke-width: 1;
        stroke-dasharray: 3, 3;
    }
</style>

<script>
import { get as _T } from "./js/translate";

export default {
    data() {
        return {
            isModified: false,
            data: {}
        };
    },
    props: {
        panelClass: {
            type: String,
            default: ""
        },
        panelStyle: Object,
        collection: Object,
        initValue: Object
    },
    methods: {
        _T,
        clear() {
            this.data = {};
            this.$forceUpdate();
        },
        getResult() {
            return this.data;
        },
        onSetData(_name, _value) {
            if (_value === undefined) {
                delete this.data[_name];
            } else {
                this.data[_name] = _value;
            }
            if ((!this.initValue) || (_value !== this.initValue[_name])) {
                this.isModified = true;
            }
            this.$forceUpdate();
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.initValue) {
                this.data = Object.assign({}, this.initValue);
            }
        });
    }
}
</script>