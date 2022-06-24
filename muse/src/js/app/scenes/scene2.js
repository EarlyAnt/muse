this.scene2 = function (gender) {
    overlay.visible = true;

    let scene = new PIXI.Container();
    mainContainer.addChild(scene);

    let camera_tips = new PIXI.spine.Spine(getAsset("assets/scene2/camera_tips.json").spineData);
    camera_tips.autoUpdate = true;
    camera_tips.state.timeScale = 1.6;
    scene.addChild(camera_tips);
    camera_tips.y = -742 + (sysInfo.viewport.height - 942) / 2 - 300
    camera_tips.state.setAnimation(0, 'animation', true);

    async function showLabel() {
        console.log("showLabel->meddyId: " + $.mid);
        let resultBefore = await SERVER.callApi({
            path: "api/upload/before",
            headers: {
                mid: $.mid
            },
            data: {
                gender: gender,
                filename: "file.name"
            }
        })
        console.log(resultBefore);
        if (resultBefore.code == 20000) {
            $.label_sn = resultBefore.data.label_sn;
        } else {
            console.log("showLabel->label_type: " + resultBefore.data.label_type);
        }

        console.log("showLabel->label_sn: " + $.label_sn);
        let resultAfter = await SERVER.callApi({
            path: "api/upload/after",
            headers: {
                mid: $.mid
            },
            data: {
                label_sn: $.label_sn
            }
        })
        console.log(resultAfter);
        if (resultAfter.data.label_type == 100 || resultAfter.data.label_type == 200 || resultAfter.data.label_type == 300) {
            alert("空气签: type[" + resultAfter.data.label_type + "] no[" + resultAfter.data.no + "]");
        } else {
            alert("上上签: type[" + resultAfter.data.label_type + "] no[" + resultAfter.data.no + "]");
        }
    }

    let btnUpload = document.getElementById("btnUpload");
    btnUpload.style.display = '';
    btnUpload.removeEventListener("click", showLabel);
    btnUpload.addEventListener("click", showLabel);

    let tips = new PIXI.Sprite(getAsset("assets/scene2/tips.png").texture);
    scene.addChild(tips);
    tips.x = 88;
    tips.y = camera_tips.y + 942 + 35 + 742;
}