//1.导入nodejs-websocket
const ws = require('nodejs-websocket');
const PORT = 3000;
const TYPE_ENTER = 0;
const TYPE_LEAVE = 1;
const TYPE_MSG = 2;

//记录当前连接用户数量
let count = 0;

// 2.创建一个server
const server = ws.createServer(connect => {
    console.log('有新用户连接上来了');

    count++;
    connect.userName = `用户${count}`

    // 告诉所有人，有人加入
    broadcast({
        type: TYPE_ENTER,
        msg: `${connect.userName}进入了聊天室`,
        time: new Date().toLocaleDateString(),
        user: connect.userName
    });


    //每当接收到用户传递过来的数据，text事件会被触发
    connect.on('text', data => {
        console.log(data);
        connect.sendText(data);

        // 当接收到用户消息时，广播出去
        broadcast({
            type: TYPE_MSG,
            msg: data,
            time: new Date().toLocaleDateString(),
            user: connect.userName
        });
    })

    //断开连接事件
    connect.on('close', () => {
        console.log('连接断开了');
        count--;

        // 广播出去
        broadcast({
            type: TYPE_LEAVE,
            msg: `${connect.userName}离开了聊天室`,
            time: new Date().toLocaleDateString(),
            user: connect.userName
        });
    })

    connect.on('error', data => {
        console.log('发生异常');
    })
});

//广播，给所有用户发送消息
function broadcast(msg) {
    server.connections.forEach(function (conn) {
        conn.sendText(JSON.stringify(msg))
    })
}

server.listen(PORT, () => {
    console.log('websocket服务启动成功，监听了端口号：' + PORT);
})