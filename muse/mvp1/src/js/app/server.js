!function () {
    var SERVER = {}

    // var baseUrl = "http://127.0.0.1:5550/";
    // var baseUrl = "http://192.168.0.102:5550/";
    // var baseUrl = "http://192.168.180.142:5550/";
    var baseUrl = "http://region-4.autodl.com:40410/api/";

    async function callApi(params) {
        if (!request) throw new Error("pls confirm request already mounted");

        console.log("method: " + params.method + ", content: " + params.path)
        const res = await request({
            url: baseUrl + params.path,
            method: params.method || "GET",
            headers: params.headers || {},
            data: params.data
        })

        return res;
    }

    async function request(params) {
        const url = params.url;
        const method = params.method || 'GET';

        let headers = {
            // "Content-Type": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        };
        if (params.headers) {
            for (let item in params.headers) {
                headers[item] = params.headers[item];
            }
        }

        let data = {};
        if (params.data) {
            for (let item in params.data) {
                data[item] = params.data[item];
            }
        }

        let body;
        if (headers['Content-Type'] == 'application/json') {
            body = JSON.stringify(data);
        } else if (headers['Content-Type'] == 'application/x-www-form-urlencoded') {
            let bodys = [];
            for (let item in data) {
                bodys.push(item + '=' + data[item]);
            }
            body = bodys.join("&");
        }

        console.log("method:" + method + ", url: " + url);
        console.log(headers);
        // console.log(data);
        // console.log(body);

        if (method.toLowerCase() == 'get') {
            body = null;
        }

        const res = await fetch(url, {
            method: method,
            // mode: "no-cors",
            mode: "cors",
            body: body,
            headers: headers,
        });

        // console.log("ok: " + res.ok + ", text: " + res.text() + ", json: " + res.json());
        // console.log(res);
        try {
            console.log("server.request->print response: ");
            console.log(res);
            return await res.json();
        } catch (e) {
            console.log("server.request->error: ");
            console.log(e);
            return null;
        }
    }
    SERVER.callApi = callApi;

    function download(url, callback) {
        console.log("download->url: " + url);
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.responseType = "blob"; //返回类型blob
        request.mode = "cors";
        request.onload = function () { //定义请求完成的处理函数
            console.log("download->request.status: " + request.status);
            if (request.status == 200 && callback != null) {
                var blob = this.response;
                callback(window.URL.createObjectURL(blob));
                console.log('download->complete');
            } else if (this.status === 504) {
                console.log('download->time out');
            } else {
                console.log('download->failed');
            }
        };
        request.send();
    }
    SERVER.download = download;

    window.SERVER = SERVER;
}();