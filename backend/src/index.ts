import * as http from 'http'
import Router from "./Router/router"

const server = http.createServer()
server.on('request', Router).listen(3000, 'localhost', () => {
    console.log(`server running at localhost:${3000}`)
})
