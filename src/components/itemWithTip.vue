<template>
    <div :class="`item-with-tip ${itemClass}`" @mousedown.stop="nop" @click="$emit('click')">
        <slot></slot>
        <div v-if="tip" :class="tipClass" v-html="tipText"></div>
    </div>
</template>

<style>
    .item-with-tip {
        position: relative;
    }

    .item-with-tip .item-tip-text {
        display: none;
        font-size: 10px;
        color: #000;
        background-color: rgba(255, 255, 220, 0.8);
        border: 1px solid rgba(128, 128, 128, 0.3);
        padding: 3px;
        position: absolute;
        white-space: nowrap;
        z-index: 999;
    }

    .item-with-tip:hover .item-tip-text {
        display: inline-block;
    }

    .item-tip-text-align-right {
        text-align: right;
    }

    .item-tip-text-align-left {
        text-align: left;
    }

    .item-tip-text-align-center {
        text-align: center;
    }

    .item-tip-text-bottom {
        bottom: -26px;
        right: 0px;
    }

    .item-tip-text-top {
        top: 0px;
        left: 0px;
    }
</style>

<script>
export default {
    computed: {
        tipClass() {
            return this.textAlign ? `item-tip-text item-tip-text-${this.location} item-tip-text-align-${this.textAlign}` : `item-tip-text item-tip-text-${this.location}`;
        },
        tipText() {
            return String(this.tip).replace(/\n/ig, "<br/>");
        }
    },
    props: {
        tip: String,
        location: {
            type: String,
            default: "bottom"
        },
        itemClass: String,
        textAlign: String
    },
    methods: {
        nop() {}
    }
}
</script>