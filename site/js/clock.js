function showTime() {

    const now = moment().format("HH-mm-ss");   
    data = now.split('-'); 
    //console.log(data)
    var h = data[0] // 0 - 23 
    var m = data[1] // 0 - 59
    var s = data[2] // 0 - 59
    
    
    //data = data.toISOString().slice(0, 19);
 //   data = data.split('T');
   // console.log("nova hora", data)
 //   dataDia = data[0];
 //   dataHora = data[1];
//console.log(dataDia)
//console.log(dataHora)


    //var date = new Date();
    
  
    //var session = "";

    //if (h == 0) {
  //      h = 24;
  //  }

 //   if (h > 24) {
  //      h = h - 24;
  //      session = "";
  //  }

   // h = (h < 10) ? "0" + h : h;
   // m = (m < 10) ? "0" + m : m;
   // s = (s < 10) ? "0" + s : s;

    var time = h + ":" + m + ":" + s;
    document.getElementById("MyClockDisplay").innerText = time;
    document.getElementById("MyClockDisplay").textContent = time;

    setTimeout(showTime, 1000);

}

showTime();