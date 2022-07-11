this.scene1 = function (taskId, prompt_tanslation, newTask) {
    console.log("scene1 start");
    console.log("scene1->taskId: " + taskId);
    console.log("scene1->prompt_tanslation: " + prompt_tanslation);
    console.log("scene1->newTask: " + newTask);

    let INITIALIZING = "正在初始化...";
    let MODEL_LOADING = "正在加载模型...";
    let MODEL_CALCULATING = "正在匹配参数...";
    let waitTextStarted = false;

    const START_TASK = "即将开始生成图片...";
    const WAIT_TASK = "任务排队中...";
    const LAST_TASK = "正在尝试继续上一个任务...";
    const TASK_DURATION = 2;

    let imageCreating = false;
    let clickTimes = 0;
    let taskIdInCookie = COOKIE.getCookie("taskId");

    let scene = new PIXI.Container();
    mainContainer.addChild(scene);
    // overlay.visible = true;

    document.getElementById("prompt_tanslation").innerText = prompt_tanslation;
    document.getElementById("divPage2").style.display = "";

    let imgProcedure = document.getElementById("imgProcedure");
    let txtProgress = document.getElementById("txtProgress");

    if (!newTask) {
        txtProgress.innerText = LAST_TASK
    }

    txtProgress.addEventListener("click", () => {
        clickTimes += 1;
        console.log("scene1->clickTimes: " + clickTimes);
        if (clickTimes >= 5) {
            COOKIE.setCookie("taskId", "", -1);
            COOKIE.setCookie("translation", "", -1);
            console.log("scene1->clear cookie");
            location.reload();
            return;
        }
    });

    refresh();
    let timerTask = setInterval(() => {
        refresh();
    }, 10000);

    let timerWait;
    function showWaitText() {
        if (waitTextStarted)
            return;

        waitTextStarted = true;
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
    }

    async function refresh() {
        try {
            if (taskId != taskIdInCookie) {
                console.log("++++++++ scene1.refresh->has two taskId, 'taskId': " + taskId + ", 'taskIdInCookie': " + taskIdInCookie);
                taskId = taskIdInCookie;
            }

            var response = await SERVER.callApi(params = { path: "query_progress?task_id=" + taskId });
            console.log("----query progress response----");
            console.log(response);

            if (response.progress == 0) {
                var queueNumber = response.queue_num;
                if (queueNumber == 0) {
                    showWaitText();
                }
                else {
                    txtProgress.innerText = WAIT_TASK + "(大约等待" + (queueNumber * TASK_DURATION).toFixed(0) + "分钟)";
                }
            } else if (response.progress > 0) {
                imageCreating = true;
                txtProgress.innerText = "正在生成图片...(" + response.progress + "%)";
                SERVER.download(response.progress_img, (imageObj) => {
                    imgProcedure.src = imageObj;
                });
                console.log("scene1->progress: " + txtProgress.innerText + ", imagePath: " + imgProcedure.src);
            }

            if (response.progress == 100) {
                clearInterval(timerTask);
                setTimeout(() => {
                    document.getElementById("divPage2").style.display = "none";
                    switchScene(2, taskId, response.progress_img);
                }, 500);
            }
        } catch (e) {
            console.log("scene1.refresh->error: ");
            console.log(e);
        }
    }
}