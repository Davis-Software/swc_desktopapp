let userdata = "TestUser"
let chat = "all"

if(socket===undefined){
    var socket = io("https://software-city.org:8080", {secure: true})
}

socket.on("error", function(er){
    alert(er)
})

socket.on('connect', function(){
    socket.emit('connected', {
        data: 'Connected',
        user: userdata
    });
});

function disconnect(){
    socket.emit("disconnected", {
        data: 'Disconnected',
        user: userdata
    })
    socket.close()
    socket = undefined;
}
window.addEventListener("unload", disconnect)
window.addEventListener("close", disconnect)

function send(message){
    if(message === ""){return}
    var string = message;
    if(string[0] === "!"){
        var parts = string.split(" ")
        var selector = parts[0]
        var value = parts[1]
        parts.splice(0, 1)
        if(selector === "!link"){
            string = `<a href="#" onclick="openwebpage(this.getAttribute('reference'))" reference="${value}">${value}</a>`
        }else if(selector === "!img"){
            string = `<img src="${value}" alt="${selector}">`
        }else if(selector === "!h1" || selector === "!h2" || selector === "!h3" || selector === "!h4" || selector === "!h5"){
            var hVal = selector.split("h")[1]
            string = `<h${hVal}>${value}</h${hVal}>`
        }else if(selector === "!blue" || selector === "!green" || selector === "!yellow" || selector === "!red" || selector === "!gray"){
            var cVal = selector.split("!")[1]
            string = `<span class="color-${cVal}">${value}</span>`
        }else{
            socket.emit("xmit", {"cmd": selector, "args": parts}, "server")
            // sendtoscreen(`${selector} => command sent`, "<-- CLIENT -->")
            // inputtext.value = ""
            return
        }
        for(var x in parts){
            if(x >= 2){
                string += ` ${parts[x]}`
            }
        }
    }
    try {
        socket.emit("xmit", {
            user: userdata,
            message: string,
            timestamp: new Date().getTime(),
            to: chat
        }, chat);
        inputtext.value = ""
    } catch (error) {
        throw error
    }

}

function askformsgs(chatw){
    socket.emit("xmit-msgs", chatw, userdata)
}

socket.on("user-conn", function(json){
    // notifyer(userdata, `${json} is online`)
    // loadOnline()
    console.log(`${json} is online`)
});
socket.on("user-disconn", function(json){
    // notifyer(userdata, `${json} is offline`)
    // loadOnline()
    console.log(`${json} is offline`)
});

socket.on('recx', function(msg){
    // notifyer(msg.user, `New message from: ${msg.user}`, msg.message, false)
    var ttime = new Date(msg.timestamp)
    var time = `${ttime.getDate()}.${ttime.getMonth()+1}.${ttime.getFullYear()} ${ttime.getHours()}:${ttime.getMinutes()}`
    if(msg.to === chat || msg.to === userdata){
        // sendtoscreen(msg.message, msg.user, time)
        console.log(msg.message, msg.user, time)
    }
});

// socket.on("recx-msgs", set_chatwin)
socket.on("recx-msgs", console.log)