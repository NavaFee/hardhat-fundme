/* Example in Node.js */
// const { setGlobalDispatcher, ProxyAgent } = require("undici")
// const proxyAgent = new ProxyAgent("https://127.0.0.1:7890")
// setGlobalDispatcher(proxyAgent)

var axios = require("axios")

var config = {
    method: "get",
    url: "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5000&convert=USD",
    headers: {
        "X-CMC_PRO_API_KEY": "7a55fe6b-50b0-48c2-8964-2da8e6ffacf9",
        "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
        Accept: "*/*",
        Host: "sandbox-api.coinmarketcap.com",
        Connection: "keep-alive",
    },
}

axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data))
    })
    .catch(function (error) {
        console.log(error)
    })
//curl -H "X-CMC_PRO_API_KEY: 7a55fe6b-50b0-48c2-8964-2da8e6ffacf9" -H "Accept: application/json" -d "start=1&limit=5000&convert=USD" -G https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest
