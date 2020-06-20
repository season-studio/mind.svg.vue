import $mindSvgView from "./components/mindSvgView";
import $itemWithTip from "./components/itemWithTip";
import * as $translate from "./components/js/translate";
import zhCN from "./components/lang/zh-cn.json";

function declareExportItem(_desc) {
    _desc.install = function (_vue) {
        if (!_desc.install.installed) {
            const args = Array.prototype.slice.call(arguments, 0);
            for (const name in _desc) {
                if (name !== "install") {
                    const item = _desc[name];
                    item.install ? item.install.apply(item, args) : _vue.component(name, item);
                }
            }
        }
    };
    return _desc;
}

export const mindSvgView = declareExportItem({mindSvgView:$mindSvgView});
export const mindItemWithTip = declareExportItem({mindItemWithTip:$itemWithTip});
export const translate = $translate;
export const lang = {
    zhCN
};
export default declareExportItem({
    mindSvgView,
    mindItemWithTip
});
