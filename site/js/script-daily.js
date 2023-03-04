
function scriptDaily() {


    const now = moment().format("HH:mm");   
    //console.log(data)
    console.log(now)
    //console.log("run")
   // var data = new Date();
    //console.log(data)
    //hour = data.getHours()
    //min = data.getMinutes()
    //sec = data.getSeconds()
    //hoursScript = hour+":"+min;
    //hoursC = hour+":"+min+":"+sec;
    //console.log(hoursC)

    
   
    if (now == "02:00") {
        $.get("/usuarios", function (usuarios) {
            for (let u of usuarios) {
               let user = u 
               $.ajax({
                'url': `/usuarios/${user.cod}/registros/data-script`,
                'type': 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            })
            }
        });
        console.log("RODOU O SCRIPT DIARIO")
        setTimeout(scriptDaily,60000);
    } else{
        setTimeout(scriptDaily, 1000);
    }
}
scriptDaily()