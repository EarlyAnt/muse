this.scene2 = function (imagePath) {
    console.log("scene2 start");
    console.log("scene1->imagePath: " + imagePath);


    let scene = new PIXI.Container();
    mainContainer.addChild(scene);
    // overlay.visible = true;

    document.getElementById("divPage3").style.zIndex = 1;

    let imgComplete = document.getElementById("imgComplete");
    imgComplete.src = imagePath;

    var buttonWidth = 960, buttonHeight = 141;
    let btnSave = PIXI.Sprite.from("assets/images/button/save.png");
    btnSave.x = (sysInfo.viewport.width - buttonWidth) / 2;
    btnSave.y = sysInfo.viewport.height - (0 + 240);
    btnSave.width = buttonWidth;
    btnSave.height = buttonHeight;
    btnSave.interactive = btnSave.buttonMode = true;
    btnSave.on('pointerdown', (e) => {

    });
    scene.addChild(btnSave);
}