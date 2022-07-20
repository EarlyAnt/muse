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
    let divLoading, divPage1;
    const PLACE_HOLDER = "输入任何内容";
    var promptList = ["例句：在冬日的早晨，满天飞雪，树上、屋顶上都落满了雪花，世界变得一片洁白。",
        "例句：一束光照在海底的梦幻宫殿上。",
        "例句：在夜空中，柔和的月光照耀着平静的湖面，湖边有一个宁静的小屋。"]
    var promptIndex = 0;

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

        //加载所有静态资源
        loadAllAssets([
            'assets/images/button/create_enable.png',
            'assets/images/button/create_disable.png',
            'assets/images/button/save.png',
            'assets/images/page/dialog.png',
            'assets/images/works/01.png',
            'assets/images/works/02.png',
            'assets/images/works/03.png',
            'assets/images/works/05.png',
            'assets/images/works/06.png',
            'assets/images/works/07.png',

            // 场景逻辑，最后整合成一个文件
            'js/app/scenes/scene1.js',
            'js/app/scenes/scene2.js',
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

        divLoading = document.getElementById("divLoading");
        divPage1 = document.getElementById("divPage1");
        divLoading.style.display = "none";
        console.log("vue.mounted->cookie: " + document.cookie);
        var taskId = COOKIE.getCookie("taskId");
        var translation = COOKIE.getCookie("translation");
        if (taskId != null && taskId != "") {
            console.log("main.onLoad->continue the last task");
            divPage1.style.display = "none";
            switchScene(1, taskId, translation, false);
            return;
        } else {
            console.log("vue.mounted->start a new task");
            divPage1.style.display = "";
        }

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
    }
    //切换prompt提示词
    function changeTip(from = 1) {
        doFade(from, 1 - from, () => {
            if (from == 1) {
                promptIndex = (promptIndex + 1) % promptList.length;
                txtTip.innerText = promptList[promptIndex];
            }
            changeTip(1 - from);
        });
    }
    //prompt提示词淡入淡出效果
    function doFade(opacityFrom, opacityTo, callback) {
        // console.log("doFade->from: " + opacityFrom + ", to: " + opacityTo);
        var divTip = document.getElementById("txtTip");
        // console.log(txtTip);
        var fadeDuration = opacityTo == 1 ? 400 : 1000;
        tween = new TWEEN.Tween({ opacity: opacityFrom });
        tween.to({ opacity: opacityTo }, fadeDuration);
        tween.easing(TWEEN.Easing.Sinusoidal.InOut);
        tween.onUpdate(lerp => {
            // console.log("tween work->opacity: " + lerp.opacity);
            divTip.style.opacity = lerp.opacity;
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
    //页面刷新事件
    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
    }
    //切换场景
    function switchScene(index, ...args) {
        //切换前先删除画面内容
        app.stage.removeChild(mainContainer);
        mainContainer = new PIXI.Container();
        app.stage.addChild(mainContainer);
        //调用场景配置函数
        console.log("switch scene[" + index + "], args[" + args + "]");
        this['scene' + index](...args);
    }

    var vm = new Vue({
        el: '#divRoot',
        data: {
            name: '赵思露',
            age: 25,
            sex: '女',

            btnCreate: null,
            txtPrompt: null,
            txtTip: null,
            dialog: null,

            baseUrl: 'http://region-4.autodl.com:40410/api/',
            prompt: '',
            promptEdit: '',
            style: '',
            canCreateImage: false,
            startedCreateImage: false,
            taskId: '',
            translation: '',
            imageUrl: '../../mvp0/src/assets/images/page/blank.png',
        },
        methods: {
            //用提示词填充prompt文本框
            fillPrompt: function () {
                var tip = this.txtTip.innerText.replace('例句：', '');
                if (!this.prompt.includes(tip)) {
                    this.prompt += tip;
                } else {
                    console.log("main.fillPrompt->prompt exsited: " + tip);
                }

                this.setButtonStatus(this.prompt);
            },
            //设置创造按钮的状态
            setButtonStatus: function (prompt) {
                console.log("main.setButtonStatus->prompt: " + prompt + ", style: " + this.style);
                var enable = prompt != null && prompt != "" && this.style != null && this.style != "";
                if (enable) {
                    this.btnCreate.src = "./assets/images/button/create_enable.png";
                    this.canCreateImage = true;
                } else {
                    this.btnCreate.src = "./assets/images/button/create_disable.png";
                    this.canCreateImage = false;
                }
                console.log("src: " + btnCreate.src);
            },
            //显示编辑对话框
            showPopup: function () {
                this.dialog.style.display = "";

                this.txtPrompt.focus();
                if (this.prompt != "") {
                    this.promptEdit = this.prompt;
                } else {
                    this.promptEdit = "";
                }
            },
            //隐藏编辑对话框
            hidePopup: function (confirm) {
                this.dialog.style.display = "none";

                if (confirm) {
                    this.prompt = this.promptEdit;
                    this.setButtonStatus(this.prompt);
                }
            },
            //创建图像
            createImage: function () {
                console.log("++++ start createImage image ++++");
                if (!this.canCreateImage) {
                    return;
                } else if (this.startedCreateImage) {
                    console.log("main.createImage->can not create image twice");
                    return;
                }

                this.startedCreateImage = true;
                var prompt = this.prompt.replace('，', ',').replace('。', ',').replace('例句：', '').replace('：', '');
                console.log("main.createImage->prompt: " + prompt + ", style" + this.style);

                this.$http.get(this.baseUrl + "make_image_v1?text=" + this.prompt + "&style=" + this.style).then(function (result) {
                    console.log(result);
                    this.taskId = result.body.taskId;
                    this.translation = result.body.prompt_tanslation;
                    console.log("main.createImage->taskId: " + this.taskId + ", prompt_tanslation: " + this.translation);

                    btnCreate.style.display = "none";
                    divPage1.style.display = "none";
                    COOKIE.setCookie("taskId", this.taskId, 1);
                    COOKIE.setCookie("translation", this.translation, 1);
                    switchScene(1, this.taskId, this.translation, true);
                });
            },
        },
        beforeCreate() {
            console.log("beforeCreate->time: " + new Date());
        },
        created() {
            console.log("created->time: " + new Date());
        },
        beforeMount() {
            console.log("beforeMount->time: " + new Date());
        },
        async mounted() {
            console.log("mounted->time: " + new Date());

            this.btnCreate = document.getElementById("btnCreate");
            this.txtPrompt = document.getElementById("txtPromptEdit");
            this.txtTip = document.getElementById("txtTip");
            this.dialog = document.getElementById("divDialog");

            var chkStyles = document.getElementsByClassName("imgStyleChecked");
            // console.log("chkStyle.length: " + chkStyles.length);
            for (var i = 0; i < 6; i++) {
                var imgStyle = document.getElementById("style" + i);
                // console.log("imgStyle: " + imgStyle.id);
                imgStyle.addEventListener("click", (event) => {
                    // console.log("selected style: " + event.target.id + ", name: " + event.target.name);
                    this.style = event.target.name;
                    for (var j = 0; j < chkStyles.length; j++) {
                        // console.log("target.id: " + event.target.id + ", enum.id: style" + j)              
                        chkStyles[j].style.visibility = (event.target.id == "style" + j ? "visible" : "hidden");
                    }

                    this.setButtonStatus(this.prompt);
                });
            }
        },
        beforeUpdate() {
            console.log("beforeUpdate->time: " + new Date());
        },
        updated() {
            console.log("updated->time: " + new Date());
        },
        beforeDestroy() {
            console.log("beforeDestroy->time: " + new Date());
        },
        destroyed() {
            console.log("destroyed->time: " + new Date());
        },
    });

    init();
}();