<template>
    <div id="app">
        <mind-item-with-tip tip="This is DEMO">
            <h3>Mind SVG in VUE</h3>
            <p>You can operate the mind map by mouse or the following key:</p>
            <div class="app-demo-tip">
                <span><b>ctrl+alt+n</b>: create a mind map</span>
                <span><b>ctrl+down</b>: add a new child topic</span>
                <span><b>ctrl+right</b>: add a new sibling topic</span>
                <span><b>up</b>: select the parent topic</span>
                <span><b>down</b>: select the first child topic</span>
                <span><b>left</b>: select the previous sibling topic</span>
                <span><b>right</b>: select the next sibling topic</span>
                <span><b>enter</b>: edit the focus topic</span>
                <span><b>delete</b>: delete the focus topic</span>
            </div>
        </mind-item-with-tip>
        <div id="svg_main">
            <mind-svg-view ref="mindView" 
                view-class="mind-my-class" 
                :key-action-map="{
                    'ctrl+alt+n': onNew, 
                    'ctrl+down': 'addSubTopic', 
                    'ctrl+right': 'addSiblingTopic',
                    'up': 'selectParent',
                    'down': 'selectChild',
                    'left': 'selectPreviousSibling',
                    'right': 'selectNextSibling',
                    'enter': 'editTopic',
                    'delete': 'deleteTopic'
                }" 
                :mind-config="{draggable: true}"/>
        </div>
    </div>
</template>

<style>
    .mind-my-class {
        right: 0px;
        height: 480px;
        border:1px dotted #000;
    }
</style>

<script>
    // 测试用数据
    const mindData = {
        title: "Root Topic",
        labels: ["This is a test"],
        children: [{
            title: "first",
            children: [{
                title: "mail to authoer",
                href: "mailto:season_studio@outlook.com",
                markers: {
                    priority: 1,
                    task: "quarter"
                }
            }, {
                title: "download",
                labels: ["npm", "nodejs", "github", "clone"],
                markers: {
                    priority: 9,
                    task: "done"
                }
            }],
        }, {
            title: "second",
            children: [{
                title: "feature",
                children: [{
                    title: "showing mindmap"
                }, {
                    title: "operating mindmap in script"
                }]
            }, {
                title: "limit",
                children: [{
                    title: "visaul operation exclude dragging should be implemented by yourself"
                }]
            }]
        }, {
            title: "starting with layout left",
            image: {
                src: "https://github.githubassets.com/images/modules/site/logos/node-logo.png",
                width: 126,
                height: 57
            },
            labels: [
                "hasImage?",
                "yes"
            ],
            notes: "goto nodejs",
            href: "https://nodejs.org/",
            direction: 1,
            children: [{
                title: "node.js"
            },{
                title: "ES2017",
                markers: {
                    priority: 6
                }
            }]
        }]
    };

    export default {
        name: 'App',
        methods: {
            onNew() {
                window.mv = this.$refs.mindView.showMind(mindData);
            }
        }
    }
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.app-demo-tip {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.app-demo-tip span {
    margin: 6px;
    background: #ffd;
    font-size: 10px;
    color: #333;
    white-space: nowrap;
}
</style>
