!function () {
    //配置可能用到的系统基本信息
    function getSysInfo() {
        let obj = {
            screen: {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            },
            design: {
                width: 1125,
                height: 2436
            }
        };
        console.log("view size: (" + document.body.clientWidth + ", " + document.body.clientHeight + ")")

        obj['scale'] = obj.screen.width / obj.design.width;

        //viewport用于相对屏幕复原y坐标
        //相对屏幕底部坐标100举例：最终y坐标 = viewport.height-100;
        obj['viewport'] = {
            width: (obj.design.width - ((obj.design.width * obj.scale) - obj.screen.width) / obj.scale),
            height: (obj.design.height - ((obj.design.height * obj.scale) - obj.screen.height) / obj.scale)
        }

        return obj;
    }
    $.getSysInfo = getSysInfo;

    //app主逻辑
    let app;
    let elapsed = 0.0;
    //资源加载管理器
    const loader = PIXI.Loader.shared;
    const sysInfo = $.getSysInfo();
    //主内容容器
    let mainContainer;
    let overlay;
    // let tween;
    // 脚本入口
    function init() {
        //基于设计稿的尺寸创建PIXI App对象
        app = new PIXI.Application({
            width: sysInfo.design.width,
            height: sysInfo.design.height,
            backgroundColor: 0x0c0f18,
            sharedLoader: true,
            legacy: true
        });
        //根据当前窗口的可视区域缩放PIXI App画布尺寸
        app.view.style.transformOrigin = '0% 0%';
        app.view.style.transform = "scale(" + sysInfo.scale + ")";
        //将PIXI 画布添加到body中
        document.body.appendChild(app.view);
        // app.ticker.add(loop);

        //加载所有静态资源
        loadAllAssets([
            'assets/images/button/create_enable.png',
            'assets/images/button/create_disable.png',
            'assets/images/button/save.png',
            'assets/images/page/dialog.png',

            // 场景逻辑，最后整合成一个文件
            //replace start
            'js/app/scenes/scene1.js',
            'js/app/scenes/scene2.js',
            // 'js/app/scenes/scene3.js',
            // 'js/app/scenes/scene4.js',
            // 'js/app/scenes/scene5.js',
            // 'js/app/scenes/scene6.js',
            // 'js/app/scenes/scene7.js'
            //replace end
        ], (e) => {
            //使用loading div显示静态资源加载总进度
            $.setMainLoading(50 + Math.round(e.progress) / 100 * 50);
        }, (e) => {
            onLoad();
        });
    }
    //统一加载静态资源的函数
    function loadAllAssets(resources, pcb, ccb) {
        for (let i = 0; i < resources.length; i++) {
            let key = (resources[i]);

            if (key.indexOf(".js") >= 0) {
                loader.add(key, resources[i], (res) => {
                    eval(res.data);
                });
            } else {
                loader.add(key, resources[i]);
            }
        }

        loader.onComplete.add(() => {
            // console.log("all resources loaded");
        });

        loader.onLoad.add((e) => {
            // console.log(Object.keys(e.resources));
        });

        if (pcb) loader.onProgress.add(pcb);
        if (ccb) loader.onComplete.add(ccb);

        loader.load();
    }
    //获取已加载的静态资源
    function getAsset(key) {
        // console.log("resources: " + loader.resources[key].name);
        return loader.resources[key];
    }
    //初始化场景
    function onLoad() {
        console.log("onLoad");

        let scene = new PIXI.Container();
        app.stage.addChild(scene);

        document.getElementById("divLoading").style.zIndex = -1;
        document.getElementById("divPage1").style.zIndex = 1;
        document.getElementById("style1").addEventListener("click", () => { showPopup(); });
        document.getElementById("btnConfirm").addEventListener("click", () => { hidePopup(); });
        document.getElementById("btnCancel").addEventListener("click", () => { hidePopup(); });

        let btnCreate = document.getElementById("btnCreate");
        btnCreate.addEventListener("click", () => {
            btnCreate.style.display = "none";
            document.getElementById("divPage1").style.zIndex = -1;
            switchScene(1);
        });

        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            spaceBetween: 6,
            // autoplay: true,
            pagination: {
                el: '.swiper-pagination',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

        animate();
        setTimeout(changeTip, 1500);

        overlay = new PIXI.Sprite();
        let gr = new PIXI.Graphics();
        gr.beginFill(0x000);
        gr.drawRect(0, 0, sysInfo.viewport.width, sysInfo.viewport.height);
        gr.endFill();
        overlay.addChild(gr);
        gr.alpha = .9;
        app.stage.addChild(overlay);
        overlay.y = 0;
        overlay.interactive = true;
        overlay.visible = false;
    }

    function changeTip(from = 1) {
        doFade(from, 1 - from, () => {
            changeTip(1 - from);
        });
    }

    function doFade(opacityFrom, opacityTo, callback) {
        // console.log("doFade->from: " + opacityFrom + ", to: " + opacityTo);
        var txtTip = document.getElementById("txtTip");
        // console.log(txtTip);
        var fadeDuration = opacityTo == 1 ? 400 : 1000;
        tween = new TWEEN.Tween({ opacity: opacityFrom });
        tween.to({ opacity: opacityTo }, fadeDuration);
        tween.easing(TWEEN.Easing.Sinusoidal.InOut);
        tween.onUpdate(lerp => {
            // console.log("tween work->opacity: " + lerp.opacity);
            txtTip.style.opacity = lerp.opacity;
        });
        tween.start();
        tween.onComplete(function () {
            // console.log('doFade->tween finish')
            if (callback) {
                var keepDuration = opacityTo == 1 ? 2000 : 0;
                setTimeout(callback, keepDuration);
            }
        });
    }
    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
    }

    function showPopup() {
        var dialog = document.getElementById("divDialog");
        dialog.style.display = "flex";
    }

    function hidePopup() {
        var dialog = document.getElementById("divDialog");
        dialog.style.display = "none";
    }

    //切换场景
    function switchScene(index, args) {
        //切换前先删除画面内容
        app.stage.removeChild(mainContainer);
        mainContainer = new PIXI.Container();
        app.stage.addChild(mainContainer);
        //调用场景配置函数
        console.log("switch scene[" + index + "], args[" + args + "]");
        this['scene' + index](args);
    }
    //翻译多个文本
    async function translate() {
        console.log("++++++++ translate->begin");
        let value = document.getElementById("txtInput").value;
        if (value.trim() == "") {
            showMultiResult("提示->请输入要翻译的内容");
            return;
        }

        value = value.replace("，", ",");
        words = value.split(",");
        wordList = [];
        for (var i = 0; i < words.length; i++) {
            wordList.push(words[i]);
        }

        let result = await SERVER.callApi({
            path: 'translate_multi',
            method: "POST",
            dataType: "json",
            data: {
                content: wordList,
                src: "zh-cn",
                dest: "en"
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
            showMultiResult("翻译结果->" + JSON.stringify(data));
        });

        console.log("++++++++ translate->end");
    }
    //显示多个文本的翻译结果
    function showMultiResult(text) {
        document.getElementById("txtTranslateResult").innerText = text;
    }

    init();
}();