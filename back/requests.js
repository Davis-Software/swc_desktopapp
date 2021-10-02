const { ipcMain } = require("electron")
const axios = require("axios")
const https = require("https")
const qs = require("querystring")

const http_instance = axios.create({
    httpsAgent: new https.Agent(
        {
            rejectUnauthorized: true
        }
    )
})


exports.get = async (url, data) => {
    if(!data) data = {}
    return (await http_instance.get(url, {
        params: data
    })).data
}
exports.post = async (url, data) => {
    return (await http_instance.post(url, qs.stringify(data))).data
}

exports.ping = async (url) => {
    return !!(await http_instance.get(url))
}


ipcMain.handle("get", (_, ...args) => {return exports.get(...args)})
ipcMain.handle("post", (_, ...args) => {return exports.post(...args)})
ipcMain.handle("ping", (_, ...args) => {return exports.ping(...args)})


