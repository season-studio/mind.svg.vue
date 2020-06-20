/**
 * 动态触发链接
 */
export function dynInvokeLink(_url, _target) {
    if (_url) {
        const aElement = document.createElement("a");
        if (aElement) {
            aElement.href = _url;
            aElement.rel = "noopener";
            _target && (aElement.target = _target);
            aElement.click();
        }
    }
}

/**
 * 拾取文件
 */
export function pickFile(_fileType) {
    return new Promise((resoleve, reject) => {
        try {
            const inputElement = document.createElement("input");
            inputElement.type = "file";
            _fileType && (inputElement.accept = _fileType);
            inputElement.addEventListener("change", () => { 
                const files = inputElement.files;
                if (files.length > 0) {
                    resoleve(files[0]);
                } else {
                    reject(0);
                }
            });
            inputElement.click();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 获取鼠标按键
 */
export function mouseButton(_event) {
    return (_event.which === undefined) ? (_event.button + 1) : _event.which;
}

/**
 * 图片文件扩展名
 */
export const imageExtNames = ".jpg,.jpeg,.png,.gif,.ico,.bmp,.svg";