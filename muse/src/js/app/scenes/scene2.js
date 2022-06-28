this.scene2 = function (gender) {
    console.log("scene2 start");

    let scene = new PIXI.Container();
    mainContainer.addChild(scene);
    // overlay.visible = true;

    document.getElementById("divPage3").style.display = '';

    var buttonWidth = 960, buttonHeight = 141;
    let btnSave = new PIXI.Sprite(getAsset("assets/images/button/save.png").texture);
    btnSave.x = (sysInfo.viewport.width - buttonWidth) / 2;
    btnSave.y = sysInfo.viewport.height - (0 + 240);
    btnSave.width = buttonWidth;
    btnSave.height = buttonHeight;
    btnSave.interactive = btnSave.buttonMode = true;
    btnSave.on('pointerdown', (e) => {

    });
    scene.addChild(btnSave);
}