this.scene1 = function (taskId, prompt_tanslation, newTask) {
    console.log("scene1 start");
    console.log("scene1->taskId: " + taskId);
    console.log("scene1->prompt_tanslation: " + prompt_tanslation);
    console.log("scene1->newTask: " + newTask);

    let scene = new PIXI.Container();
    mainContainer.addChild(scene);
    // overlay.visible = true;

    let INITIALIZING = "正在初始化...";
    let MODEL_LOADING = "正在加载模型...";
    let MODEL_CALCULATING = "模型计算中...";

    const START_TASK = "即将开始生成图片...";
    const WAIT_TASK = "任务排队中...";
    const LAST_TASK = "正在尝试继续上一个任务...";
    const TASK_DURATION = 2;
    const TIME_LIMIT = 1800;

    var vm = new Vue({
        el: '#divPage2',
        data: {
            divPage2: null,
            txtTranslation: null,
            imgProcedure: null,
            txtProgress: null,

            timerTask: null,
            timerWait: null,

            waitTextStarted: false,
            imageCreating: false,
            clickTimes: 0,
            taskIdInCookie: COOKIE.getCookie("taskId"),
            beginTime: new Date(),

            baseUrl: 'http://region-4.autodl.com:40410/api/',
        },
        methods: {
            //刷新提示文字
            showWaitText: function () {
                if (this.waitTextStarted)
                    return;

                this.waitTextStarted = true;
                let seconds = 0;
                timerWait = setInterval(() => {
                    if (imageCreating) {
                        clearInterval(timerWait);
                        return;
                    }

                    if (seconds >= 0 && seconds < 10) {
                        txtProgress.innerText = INITIALIZING;
                    } else if (seconds >= 10 && seconds < 25) {
                        txtProgress.innerText = MODEL_LOADING;
                    } else if (seconds >= 25 && seconds < 45) {
                        txtProgress.innerText = MODEL_CALCULATING;
                    } else if (seconds >= 45) {
                        txtProgress.innerText = START_TASK;
                    }

                    seconds += 1;
                }, 1000);
            },
            //刷新进度
            refresh: async function () {
                try {
                    if (taskId != this.taskIdInCookie) {
                        console.log("++++++++ scene1.refresh->has two taskId, 'taskId': " + taskId + ", 'taskIdInCookie': " + this.taskIdInCookie);
                        taskId = this.taskIdInCookie;
                    }

                    var response = await SERVER.callApi(params = { path: "query_progress?task_id=" + taskId });
                    console.log("----query progress response----");
                    console.log(response);

                    if (response.progress == -1) {
                        reload("服务器异常，请稍后重试！", true);
                    } else if (response.progress == 0) {
                        var waitTime = this.getWaitTime();
                        console.log("scene1.refresh->waitTime: " + waitTime);
                        if (waitTime > TIME_LIMIT) {
                            reload("服务器繁忙，等待时间太久，请稍后再试！");
                            return;
                        }

                        var queueNumber = response.queue_num;
                        if (queueNumber == 0) {
                            showWaitText();
                        }
                        else {
                            txtProgress.innerText = WAIT_TASK + "(大约等待" + (queueNumber * TASK_DURATION).toFixed(0) + "分钟)";
                        }
                    } else if (response.progress > 0) {
                        this.imageCreating = true;
                        this.txtProgress.innerText = "正在生成图片...(" + response.progress + "%)";
                        SERVER.download(response.progress_img, (imageObj) => {
                            this.imgProcedure.src = imageObj;
                        });
                        console.log("scene1->progress: " + this.txtProgress.innerText + ", imagePath: " + this.imgProcedure.src);
                    }

                    if (response.progress == 100) {
                        clearInterval(this.timerTask);
                        setTimeout(() => {
                            this.divPage2.style.display = "none";
                            switchScene(2, taskId, response.progress_img);
                        }, 500);
                    }
                } catch (e) {
                    console.log("scene1.refresh->error: ");
                    console.log(e);
                }
            },
            //获取等待时间
            getWaitTime: function () {
                var endTime = new Date();
                var span = endTime - this.beginTime;
                return span / 1000;
            },
            //返回主页
            goback: function () {
                this.clickTimes += 1;
                console.log("scene1->clickTimes: " + this.clickTimes);
                if (this.clickTimes >= 5) {
                    this.reload();
                    return;
                }
            },
            //返回主页
            reload: function (tip = "", errorColor = false) {
                clearInterval(this.timerWait);
                clearInterval(this.timerTask);
                this.txtProgress.innerText = tip;
                if (errorColor)
                    this.txtProgress.style.color = "#F00";
                setTimeout(() => {
                    COOKIE.setCookie("taskId", "", -1);
                    COOKIE.setCookie("translation", "", -1);
                    console.log("scene1.reload->clear cookie");
                    location.reload();
                }, 3000);
            }
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

            this.divPage2 = document.getElementById("divPage2");
            this.txtTranslation = document.getElementById("prompt_tanslation");
            this.imgProcedure = document.getElementById("imgProcedure");
            this.txtProgress = document.getElementById("txtProgress");

            this.divPage2.style.display = "";
            this.txtTranslation.innerText = prompt_tanslation;

            if (!newTask) {
                this.txtProgress.innerText = LAST_TASK
            }

            this.refresh();
            this.timerTask = setInterval(() => {
                this.refresh();
            }, 10000);
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
}