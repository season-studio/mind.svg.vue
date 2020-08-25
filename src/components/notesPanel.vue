<template>
    <div :class="panelClass" :style="panelStyle">
        <textarea ref="input" class="notes-input" @blur="onSubmitValue" @keydown.esc.stop="onRestoreValue" @keydown.stop="nop"></textarea>
    </div>
</template>

<style>
    .notes-input {
        width: 100%; 
        height: 57px;
        box-sizing: border-box;
        outline: none;
        min-width: 170px;
        font-size: 10px;
        border: 1px solid rgba(128, 128, 128, 0.3);
        background-color: rgba(255, 255, 255, 0.9);
    }
</style>

<script>
export default {
    data() {
        return {
            isModified: false
        };
    },
    props: {
        panelClass: {
            type: String,
            default: ""
        },
        panelStyle: Object,
        initValue: {
            type: String,
            default: ""
        }
    },
    methods: {
        nop() {},
        getResult() {
            return this.$refs.input.value;
        },
        clear() {
            this.$refs.input.value = "";
            this.initValue && (this.isModified = true);
        },
        blur() {
            this.onSubmitValue();
        },
        onSubmitValue() {
            (this.initValue !== this.$refs.input.value) && (this.isModified = true);
        },
        onRestoreValue() {
            this.$refs.input.value = this.initValue;
        }
    },
    mounted() {
        this.$nextTick(this.onRestoreValue.bind(this));
    }
}
</script>