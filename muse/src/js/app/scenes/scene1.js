this.scene1 = function (taskId, prompt_tanslation, newTask) {
    console.log("scene1 start");
    console.log("scene1->taskId: " + taskId);
    console.log("scene1->prompt_tanslation: " + prompt_tanslation);
    console.log("scene1->newTask: " + newTask);

    const START_TASK = "即将开始生成图片...";
    const WAIT_TASK = "任务排队中...";
    const LAST_TASK = "正在尝试继续上一个任务...";
    const TASK_DURATION = 2;

    let clickTimes = 0;
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

    imgProcedure.addEventListener("click", () => {
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
    let timer = setInterval(() => {
        refresh();
    }, 10000);

    async function refresh() {
        var response = await SERVER.callApi(params = { path: "query_progress?task_id=" + taskId });
        console.log("----query progress response----");
        console.log(response);

        if (response.progress == 0) {
            var queueNumber = response.queue_num;
            if (queueNumber == 0) {
                txtProgress.innerText = START_TASK;
            }
            else {
                txtProgress.innerText = WAIT_TASK + "(大约等待" + (queueNumber * TASK_DURATION).toFixed(0) + "分钟)";
            }
        } else if (response.progress > 0) {
            txtProgress.innerText = "正在生成图片...(" + response.progress + "%)";
            SERVER.download(response.progress_img, (imageObj) => {
                imgProcedure.src = imageObj;
            });            
            console.log("scene1->progress: " + txtProgress.innerText + ", imagePath: " + imgProcedure.src);
        }

        if (response.progress == 100) {
            clearTimeout(timer);
            setTimeout(() => {
                document.getElementById("divPage2").style.display = "none";
                switchScene(2, taskId, response.progress_img);
            }, 500);
        }
    }
}