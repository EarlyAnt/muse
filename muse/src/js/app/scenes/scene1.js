this.scene1 = function () {
    console.log("scene1 start");

    let scene = new PIXI.Container();
    mainContainer.addChild(scene);
    // overlay.visible = true;

    document.getElementById("divPage2").style.display = '';
    let imgProcedure = document.getElementById("imgProcedure");
    let txtProgress = document.getElementById("txtProgress");
    let index = 1;
    let timer = setInterval(() => {
        imgProcedure.src = "../src/assets/images/ufo/0" + index + ".png";
        txtProgress.innerText = "正在生成图片...(" + ((index / 6) * 100).toFixed(0) + "%)";
        index += 1;
        if (index > 6) {
            clearInterval(timer);
            txtProgress.innerText = "正在生成图片...(100%)";
            setTimeout(() => {
                document.getElementById("divPage2").style.display = 'none';
                switchScene(2);
            }, 1000);
        }
    }, 1000);
}