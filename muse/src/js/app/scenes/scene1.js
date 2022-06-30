this.scene1 = function (taskId) {
    console.log("scene1 start");
    console.log("scene1->taskId: " + taskId);

    let scene = new PIXI.Container();
    mainContainer.addChild(scene);
    // overlay.visible = true;

    document.getElementById("divPage2").style.zIndex = 1;
    let imgProcedure = document.getElementById("imgProcedure");
    let txtProgress = document.getElementById("txtProgress");

    let timer = setInterval(async () => {
        var response = await SERVER.callApi(params = { path: "query_progress?task_id=" + taskId });

        if (response.progress == 0) {
            txtProgress.innerText = "任务排队中...";
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