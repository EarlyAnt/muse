!function () {
    var SERVER = {}

    function getServerURL() {
        return 'http://127.0.0.1:5550/';
        // return 'http://192.168.0.102:5550/';
        // return "http://192.168.180.142:5550/";
    }

    async function callApi(params) {
        if (!request) throw new Error("pls confirm request already mounted");

        console.log("method: " + params.method + ", content: " + params.q)

        const res = await request({
            url: getServerURL() + params.path,
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
            "Content-Type": "application/json"
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
        console.log(data);
        // console.log(body);

        if (method.toLowerCase() == 'get') {
            body = null;
        }

        const res = await fetch(url, {
            method: method,
            // mode: "no-cors",
            mode: "cors",
            body: body,
            // body: JSON.stringify({
            //     'name': '早起的蚂蚁123'
            // }),
            headers: headers,
        });

        // console.log("ok: " + res.ok + ", text: " + res.text() + ", json: " + res.json());
        // console.log(res);
        return res;
    }
    SERVER.callApi = callApi;

    window.SERVER = SERVER;
}();