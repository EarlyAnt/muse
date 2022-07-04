this.scene1 = function (taskId, prompt_tanslation, newTask) {
    console.log("scene1 start");
    console.log("scene1->taskId: " + taskId);
    console.log("scene1->prompt_tanslation: " + prompt_tanslation);
    console.log("scene1->newTask: " + newTask);

    const NEW_TASK = "任务排队中...";
    const LAST_TASK = "正在尝试继续上一个任务...";

    let clickTimes = 0;
    let scene = new PIXI.Container();
    mainContainer.addChild(scene);
    // overlay.visible = true;

    document.getElementById("prompt_tanslation").innerText = prompt_tanslation;
    document.getElementById("divPage2").style.zIndex = 1;

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

    let timer = setInterval(async () => {
        var response = await SERVER.callApi(params = { path: "query_progress?task_id=" + taskId });

        if (response.progress == 0) {
            txtProgress.innerText = newTask ? NEW_TASK : LAST_TASK;
        } else if (response.progress > 0) {
            txtProgress.innerText = "正在生成图片...(" + response.progress + "%)";
            imgProcedure.src = SERVER.imgUrl + response.progress_img;
            // console.log("scene1->progress: " + txtProgress.innerText + ", imagePath: " + imgProcedure.src);
        }

        if (response.progress == 100) {
            clearTimeout(timer);
            setTimeout(() => {
                document.getElementById("divPage2").style.zIndex = -1;
                switchScene(2, imgProcedure.src);
            }, 500);
        }

    }, 5000);


    // // 测试代码
    // let index = 1;
    // let timer = setInterval(() => {
    //     imgProcedure.src = "../src/assets/images/ufo/0" + index + ".png";
    //     txtProgress.innerText = "正在生成图片...(" + ((index / 6) * 100).toFixed(0) + "%)";
    //     index += 1;
    //     if (index > 6) {
    //         clearInterval(timer);
    //         txtProgress.innerText = "正在生成图片...(100%)";
    //         setTimeout(() => {
    //             document.getElementById("divPage2").style.zIndex = -1;
    //             switchScene(2);
    //         }, 500);
    //     }
    // }, 1000);
}