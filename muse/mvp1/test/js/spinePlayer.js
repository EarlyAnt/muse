!function () {
    SpinePlayer = {}

    var app = null;
    var scene = null;
    var animationScale = 0.001;
    var container = null;

    //初始化
    function init() {
        if (!app) {
            app = new PIXI.Application({
                width: container != null ? container.clientWidth : 100,
                height: container != null ? container.clientHeight : 100
            });

            //初始化时钟(相当于unity里的update函数)
            app.ticker.add(() => {
                if (spine != null) {
                    spine.update(0.01666666666667);//按每秒60帧的速度播放动画
                }
            });
        }
    }
    //动态设置画布大小
    function reSize(width, height) {
        if (app) {
            app.view.style.width = 50;
            app.view.style.height = 50;
            console.log("SpinePlayer.reSize->new size, width: " + app.view.style.width + ", app height: " + app.view.style.height);
        }
        else {
            console.log("SpinePlayer.reSize->error: app is null");
        }
    }
    SpinePlayer.reSize = reSize;

    function play(animationPath, animationClip, viewContainer, loaderCallback) {
        console.log("---- spine animation ----");

        try {
            container = document.getElementById(viewContainer);
            init();

            app.stop();
            app.loader.reset();
            app.loader.add('spine', animationPath).load((loader, res) => {
                if (scene != null) {
                    app.stage.removeChild(scene);
                }

                try {
                    //新建spine对象
                    spine = new PIXI.spine.Spine(res.spine.spineData);
                    spine.skeleton.setToSetupPose();
                    spine.update(0);
                    spine.autoUpdate = false;

                    //创建spine容器
                    var scene = new PIXI.Container();
                    scene.addChild(spine);

                    //计算spine动画大小和位置
                    const localRect = spine.getLocalBounds();
                    spine.position.set(- localRect.x, -localRect.y);

                    //设置spine动画缩放
                    const scale = Math.min(app.screen.width * animationScale, app.screen.height * animationScale);
                    scene.scale.set(scale, scale);
                    scene.position.set((app.screen.width - scene.width) * 0.5, (app.screen.height - scene.height) * 0.5,);

                    //将spine动画添加至舞台
                    app.stage.addChild(scene);

                    //播放spine动画
                    spine.state.setAnimation(0, animationClip, true);
                    app.start();
                    container.appendChild(app.view);
                    console.log("---- start play animation ----");

                    if (loaderCallback) {
                        loaderCallback();
                    }
                } catch (innerError) {
                    console.log("SpinePlayer.play->innerError: " + innerError);
                }
            });
        } catch (outerError) {
            console.log("SpinePlayer.play->outerError: " + outerError);
        }
    }
    SpinePlayer.play = play;

    function stop() {
        try {
            if (app != null) {
                app.stop();
                if (scene != null) {
                    app.stage.removeChild(scene);
                }

                if (container != null) {
                    container.removeChild(app.view);
                }
            }
        } catch (error) {
            console.log("SpinePlayer.stop->error: " + error);
        }
    }
    SpinePlayer.stop = stop;
}();