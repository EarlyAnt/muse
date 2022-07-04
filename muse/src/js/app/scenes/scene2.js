this.scene2 = function (imagePath) {
    console.log("scene2 start");
    console.log("scene1->imagePath: " + imagePath);


    let scene = new PIXI.Container();
    mainContainer.addChild(scene);
    // overlay.visible = true;

    document.getElementById("divPage3").style.zIndex = 1;

    let imgComplete = document.getElementById("imgComplete");
    imgComplete.src = imagePath;
    COOKIE.setCookie("taskId", "", -1);
    COOKIE.setCookie("translation", "", -1);
}