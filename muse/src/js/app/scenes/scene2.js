this.scene2 = function (taskId, imagePath) {
    console.log("scene2 start");
    console.log("scene2->taskId: " + taskId);
    console.log("scene2->imagePath: " + imagePath);


    let scene = new PIXI.Container();
    mainContainer.addChild(scene);
    // overlay.visible = true;

    let clickTimes = 0;

    document.getElementById("divPage3").style.display = "";

    let txtSetting = document.getElementById("txtSetting");
    let imgComplete = document.getElementById("imgComplete");
    imgComplete.src = imagePath;
    COOKIE.setCookie("taskId", "", -1);
    COOKIE.setCookie("translation", "", -1);

    document.getElementById("btnRetry").addEventListener("click", () => {
        location.reload();
    });

    document.getElementById("txtShare").addEventListener("click", () => {
        clickTimes += 1;
        if (clickTimes == 3) {
            imgComplete.style.display = "none";
            txtSetting.style.display = "";
        } else if (clickTimes == 4) {
            clickTimes = 0;
            imgComplete.style.display = "";
            txtSetting.style.display = "none";
        }
    });

    async function getSetting() {
        try {
            var response = await SERVER.callApi(params = { path: "query_settings?task_id=" + taskId });
            console.log("----get setting response----");
            console.log(response);
            txtSetting.value = JSON.stringify(response, null, "\t");
        } catch (e) {
            console.log("scene2.getSetting->error: ");
            console.log(e);
        }
    }

    getSetting();
}