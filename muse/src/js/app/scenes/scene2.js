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

    let settingRepeatTimes = 0;
    let imageRepeatTimes = 0;
    imgComplete.onerror = () => {
        console.log("scene2.loadImage->repeat times: " + imageRepeatTimes);
        if (imageRepeatTimes < 3) {
            setTimeout(() => { imgComplete.src = imagePath; }, 1000);
        }
        imageRepeatTimes += 1;
    };
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
            var response = await SERVER.callApi(params = {
                path: "query_settings?task_id=" + taskId,
                Headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Method": "GET, POST",
                }
            });
            console.log("----get setting response----");
            console.log(response);
            txtSetting.value = JSON.stringify(response, null, "\t");
        } catch (e) {
            console.log("scene2.getSetting->error: ");
            console.log(e);

            if (settingRepeatTimes < 3) {
                console.log("scene2.getSetting->repeat times: " + settingRepeatTimes);
                setTimeout(getSetting, 1000);
            }
            settingRepeatTimes += 1;
        }
    }

    getSetting();
}