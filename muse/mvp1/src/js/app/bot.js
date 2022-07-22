!function () {
    BOT = {}

    let content = "";
    let timer = null;

    function start(callback, interval = 500, count = 3, symbol = '.') {
        stop();
        timer = setInterval(() => {
            if (content.length < count) {
                content += symbol;
            } else {
                content = "";
            }

            // console.log("BOT.show->content: " + content + ", count: " + count + ", interval: " + interval + ", symbol: " + symbol);
            if (callback) {
                callback(content);
            }
        }, interval);
    }
    BOT.start = start;

    function stop() {
        if (timer != null) {
            clearInterval(timer);
        }
    }
    BOT.stop = stop;

}();