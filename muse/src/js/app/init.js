!function () {
    let $ = {};
    window.$ = $;

    //初始化入口，全异步加载
    //init.js中只包含loading所需的基础内容
    function setMainLoading(progress) {
        progress = Math.round(progress);
        const progressbar = document.querySelector(".loading>.progress>div:nth-child(2)");
        progressbar.style.width = progress + '%';
        const text = document.querySelector(".loading>.text");
        text.innerText = `上线中...${progress}%`;

        if (progress == 100) {
            const loading = document.querySelector(".loading");
            loading.classList.add('hide');
        }
    }
    $.setMainLoading = setMainLoading;

    function init() {
        console.log("js脚本入口");

        $.mid = "MEDDY936193133884029188";

        loadJSQue([
            // 第三方库：远端库
            "https://cdn.staticfile.org/qiniu-js/3.4.0/qiniu.min.js",
            "https://pixijs.download/release/pixi.js",

            // 第三方库：本地库
            "./js/libs/gsap.min.js",
            "./js/libs/pixi.min.js",
            "./js/libs/pixi-spine.js",
            "./js/libs/pixi.textinput.min.js",
            "./js/libs/weui.min.js",
            //replace start
            "./js/app/server.js",
            "./js/app/main.js",
            //replace end
        ], (p) => {
            // setMainLoading(p*50);
        });
    }

    async function loadJSQue(arr, cb) {
        for (let i = 0; i < arr.length; i++) {
            const res = await loadJS(arr[i]);
            if (cb) cb((i + 1) / arr.length);
        }
    }

    function loadJS(src, cb) {
        return new Promise(async (resolve, reject) => {
            const head = document.getElementsByTagName('head')[0];
            const script = document.createElement("script");
            script.type = 'text/javascript';

            script.onload = () => {
                if (cb) cb(src);
                else resolve(src);
            }
            script.src = src;
            head.appendChild(script);
        });
    }
    $.loadJS = loadJS;

    window.onload = init();
}();
