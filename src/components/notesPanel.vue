<template>
    <div :class="panelClass" :style="panelStyle">
        <textarea class="notes-input" @blur="onSubmitValue" @keydown.esc.stop="onRestoreValue" @keydown.stop="nop" v-model="value"></textarea>
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
            isModified: false,
            value: ""
        };
    },
    props: {
        panelClass: {
            type: String,
            default: ""
        },
        panelStyle: Object,
        initValue: String
    },
    methods: {
        nop() {},
        getResult() {
            return this.value;
        },
        clear() {
            if (this.initValue) {
                this.value = "";
                this.isModified = true;
            }
        },
        onSubmitValue(_event) {
            const node = _event.target;
            if (node) {
                this.value = this.value.trim();
                if (this.initValue !== this.value) {
                    this.isModified = true;
                }
            }
        },
        onRestoreValue() {
            this.value = this.initValue;
        }
    },
    mounted() {
        this.$nextTick(() => {
            const initValue = String(this.initValue || "").trim();
            this.value = initValue;
        });
    }
}
</script>