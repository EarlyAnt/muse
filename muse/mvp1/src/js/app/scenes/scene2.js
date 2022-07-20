this.scene2 = function (taskId, imagePath) {
    console.log("scene2 start");
    console.log("scene2->taskId: " + taskId);
    console.log("scene2->imagePath: " + imagePath);

    let scene = new PIXI.Container();
    mainContainer.addChild(scene);
    // overlay.visible = true;

    var vm = new Vue({
        el: '#divPage3',
        data: {
            divPage3: null,
            txtSetting: null,
            imgComplete: null,

            settingRepeatTimes: 0,
            imageRepeatTimes: 0,
            repeatTimesLimit: 10,
            clickTimes: 0,

            baseUrl: 'http://region-4.autodl.com:40410/api/',
        },
        methods: {
            goback: function () {
                this.clickTimes += 1;
                if (this.clickTimes == 3) {
                    this.imgComplete.style.display = "none";
                    this.txtSetting.style.display = "";
                } else if (this.clickTimes == 4) {
                    this.clickTimes = 0;
                    this.imgComplete.style.display = "";
                    this.txtSetting.style.display = "none";
                }
            },
            reload: function () {
                location.reload();
            },
            getSetting: async function () {
                try {
                    this.$http.get(this.baseUrl + "query_settings?task_id=" + taskId).then(function (result) {
                        console.log("----get setting response----");
                        console.log(result);
                        this.txtSetting.value = JSON.stringify(result.body, null, "\t");
                    });
                } catch (e) {
                    console.log("scene2.getSetting->error: ");
                    console.log(e);

                    if (this.settingRepeatTimes < this.repeatTimesLimit) {
                        console.log("scene2.getSetting->repeat times: " + this.settingRepeatTimes);
                        setTimeout(getSetting, 1000);
                    }
                    this.settingRepeatTimes += 1;
                }
            }
        },
        beforeCreate() {
            console.log("beforeCreate->time: " + new Date());
        },
        created() {
            console.log("created->time: " + new Date());
        },
        beforeMount() {
            console.log("beforeMount->time: " + new Date());
        },
        async mounted() {
            console.log("mounted->time: " + new Date());

            this.divPage3 = document.getElementById("divPage3");
            this.txtSetting = document.getElementById("txtSetting");
            this.imgComplete = document.getElementById("imgComplete");
            this.divPage3.style.display = "";

            this.imgComplete.onerror = () => {
                console.log("scene2.loadImage->repeat times: " + this.imageRepeatTimes);
                if (this.imageRepeatTimes < this.repeatTimesLimit) {
                    setTimeout(() => { this.imgComplete.src = imagePath; }, 1000);
                }
                this.imageRepeatTimes += 1;
            };
            this.imgComplete.src = imagePath;

            // COOKIE.setCookie("taskId", "", -1);
            // COOKIE.setCookie("translation", "", -1);

            this.getSetting();
        },
        beforeUpdate() {
            console.log("beforeUpdate->time: " + new Date());
        },
        updated() {
            console.log("updated->time: " + new Date());
        },
        beforeDestroy() {
            console.log("beforeDestroy->time: " + new Date());
        },
        destroyed() {
            console.log("destroyed->time: " + new Date());
        },
    });
}