this.scene1 = function() {
    let scene = new PIXI.Container();
    mainContainer.addChild(scene);

    overlay.visible = true;
    scene.y = -160;

    // boy按钮
    let btn_boy = new PIXI.Sprite(getAsset("assets/scene1/btn_boy_0.png").texture);
    scene.addChild(btn_boy);

    let text_boy = new PIXI.Sprite(getAsset("assets/scene1/text_boy.png").texture);
    btn_boy.addChild(text_boy);
    btn_boy.x = 214;
    text_boy.x = 68;
    text_boy.y = 363;

    let boy_iconcheck = new PIXI.Sprite(getAsset("assets/scene1/iconcheck.png").texture);
    btn_boy.addChild(boy_iconcheck);
    boy_iconcheck.x = boy_iconcheck.y = 180;

    //girl按钮
    let btn_girl = new PIXI.Sprite(getAsset("assets/scene1/btn_girl_0.png").texture);
    scene.addChild(btn_girl);

    let text_girl = new PIXI.Sprite(getAsset("assets/scene1/text_girl.png").texture);
    btn_girl.addChild(text_girl);
    btn_girl.x = 648;
    text_girl.x = 68;
    text_girl.y = 363;

    let girl_iconcheck = new PIXI.Sprite(getAsset("assets/scene1/iconcheck.png").texture);
    btn_girl.addChild(girl_iconcheck);
    girl_iconcheck.x = girl_iconcheck.y = 180;

    btn_boy.y = btn_girl.y = (sysInfo.viewport.height - 275) / 2;
    boy_iconcheck.visible = girl_iconcheck.visible = false;

    btn_boy.interactive = btn_boy.buttonMode = btn_girl.interactive = btn_girl.buttonMode = true;

    btn_boy.on('pointerdown', () => {
        boy_iconcheck.visible = true;
        girl_iconcheck.visible = false;
        btn_boy.texture = getAsset("assets/scene1/btn_boy_1.png").texture;
        btn_girl.texture = getAsset("assets/scene1/btn_girl_0.png").texture;
        switchScene(2, 1);
    });
    btn_girl.on('pointerdown', () => {
        boy_iconcheck.visible = false;
        girl_iconcheck.visible = true;
        btn_boy.texture = getAsset("assets/scene1/btn_boy_0.png").texture;
        btn_girl.texture = getAsset("assets/scene1/btn_girl_1.png").texture;
        switchScene(2, 2);
    });
}