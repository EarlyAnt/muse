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
    // 脚本入口
    function init() {
        //基于设计稿的尺寸创建PIXI App对象
        app = new PIXI.Application({
            width: sysInfo.design.width,
            height: sysInfo.design.height,
            backgroundColor: 0xfdf8f4,
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
            'assets/main/bg.png',
            'assets/main/bg2.png',
            'assets/main/bigcanister.png',
            'assets/main/btn_next.png',
            'assets/main/label.png',
            'assets/main/bucket.json',
            'assets/main/btn_mysign.png',
            'assets/main/tips.png',
            'assets/main/nosigns.png',

            'assets/scene1/btn_boy_0.png',
            'assets/scene1/btn_boy_1.png',
            'assets/scene1/btn_girl_0.png',
            'assets/scene1/btn_girl_1.png',
            'assets/scene1/text_boy.png',
            'assets/scene1/text_girl.png',
            'assets/scene1/iconcheck.png',

            'assets/scene7/btn_left.png',
            'assets/scene7/btn_right.png',
            'assets/scene7/btn_close.png',

            'assets/scene2/camera_tips.json',
            'assets/scene2/tips.png',

            'assets/scene3/tips.png',
            'assets/scene4/tips.png',
            'assets/scene4/cardframe.png',
            'assets/scene4/cardsample.png',
            'assets/scene4/cardmask.png',
            'assets/scene4/iconscrape.png',
            'assets/scene4/anicut.json',
            'assets/scene4/btn_getmorepoint.png',
            'assets/scene4/tips2.png',
            'assets/scene4/imglost30.png',

            'assets/scene5/btn_retry.png',
            'assets/scene5/framebg.png',
            'assets/scene5/img_100.png',
            'assets/scene5/img_200.png',
            'assets/scene5/img_300.png',
            'assets/scene5/label_110.png',
            'assets/scene5/label_120.png',
            'assets/scene5/label_130.png',
            'assets/scene5/label_210.png',
            'assets/scene5/label_220.png',
            'assets/scene5/label_230.png',
            'assets/scene5/label_240.png',
            'assets/scene5/label_250.png',
            'assets/scene5/label_260.png',
            'assets/scene5/label_270.png',
            'assets/scene5/label_310.png',
            'assets/scene5/label_320.png',

            'assets/scene6/btn_again.png',
            'assets/scene6/btn_share.png',
            'assets/scene6/btn_unlock.png',
            'assets/scene6/label.png',
            'assets/scene6/frame.png',
            'assets/scene6/sharetips.png',
            'assets/scene6/btn_again2.png',

            'assets/poster/bg.png',
            'assets/poster/m_logo.png',
            'assets/poster/labelbg1.png',
            'assets/poster/labelbg2.png',
            'assets/poster/btn_pen.png',
            'assets/poster/btn_close.png',
            'assets/poster/btn_confirm.png',
            'assets/poster/input_frame.png',
            'assets/poster/bg_flower.png',
            'assets/poster/bg_flower2.png',
            'assets/poster/img_qrcode.png',
            'assets/poster/img_qrcodeword.png',
            'assets/poster/line.png',
            'assets/poster/qian_title/400.png',
            'assets/poster/qian_title/500.png',
            'assets/poster/qian_title/600.png',
            'assets/poster/qian_title/700.png',
            'assets/poster/qian_slogan/410.png',
            'assets/poster/qian_slogan/420.png',
            'assets/poster/qian_slogan/510.png',
            'assets/poster/qian_slogan/520.png',
            'assets/poster/qian_slogan/530.png',
            'assets/poster/qian_slogan/610.png',
            'assets/poster/qian_slogan/620.png',
            'assets/poster/qian_slogan/710.png',
            'assets/poster/qian_word/411.png',
            'assets/poster/qian_word/412.png',
            'assets/poster/qian_word/421.png',
            'assets/poster/qian_word/422.png',
            'assets/poster/qian_word/511.png',
            'assets/poster/qian_word/521.png',
            'assets/poster/qian_word/531.png',
            'assets/poster/qian_word/611.png',
            'assets/poster/qian_word/612.png',
            'assets/poster/qian_word/621.png',
            'assets/poster/qian_word/711.png',
            'assets/poster/prop_chicken.png',
            'assets/poster/prop_pepper.png',
            'assets/poster/prop_ketchup.png',

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
        document.getElementById("btnTranslate").addEventListener("click", translate);

        // let tContainer = new PIXI.Container();
        // app.stage.addChild(tContainer);

        // let img_bg = new PIXI.Sprite(getAsset("assets/main/bg.png").texture);
        // tContainer.addChild(img_bg);

        // var bucket = new PIXI.spine.Spine(getAsset("assets/main/bucket.json").spineData);
        // tContainer.addChild(bucket);
        // bucket.autoUpdate = true;
        // bucket.state.timeScale = 1.6;
        // bucket.y = -160;
        // bucket.state.setAnimation(0, 'animation', true);

        // let btn_next = new PIXI.Sprite(getAsset("assets/main/btn_next.png").texture);
        // btn_next.x = 261;
        // btn_next.y = sysInfo.viewport.height - (86 + 240);
        // tContainer.addChild(btn_next);

        // btn_next.interactive = btn_next.buttonMode = true;
        // btn_next.on('pointerdown', (e) => {
        //     switchScene(1);
        // });

        // overlay = new PIXI.Sprite();
        // let gr = new PIXI.Graphics();
        // gr.beginFill(0x000);
        // gr.drawRect(0, 0, sysInfo.viewport.width, sysInfo.viewport.height);
        // gr.endFill();
        // overlay.addChild(gr);
        // gr.alpha = .9;
        // app.stage.addChild(overlay);
        // overlay.y = 0;
        // overlay.interactive = true;
        // overlay.visible = false;
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

    // init();
    onLoad();
}();