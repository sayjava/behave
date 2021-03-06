const http = require("http");

const transactions = (total) => {
    for (var i = 0; i < total; i++) {
        const url = `http://localhost:9090/orders/${i}/transactions`;
        http.get(url, {
            headers: {
                "User-Agent": "nodejs"
            }
        }).on("end", () => {
            console.log(`SENT: ${url}`)
        })
    }
}


const orders = (total) => {
    for (var i = 0; i < total; i++) {
        const url = `http://localhost:9090/orders/:order_id/metafield`;
        http.get(url, {
            headers: {
                "User-Agent": "nodejs"
            }
        }).on("end", () => {
            console.log(`SENT: ${url}`)
        })
    }
}

const bogus = (total) => {
    for (var i = 0; i < total; i++) {
        const url = `http://localhost:9090/orders/${i}/might_not_exists_yet_but_true/something`;

        http.request(url, {
            method: i % 2 === 0 ? "POST" : "GET",
            headers: {
                "User-Agent": "nodejs"
            }
        }).on("end", () => {
            console.log(`SENT: ${url}`)
        })

    }
}

console.log(`- - - - - - - > Generating traffic - - - - - - >`)
transactions(5);
// bogus(5);