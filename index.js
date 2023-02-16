let msgSection = document.getElementById("msgArea")
  const {ipcRenderer,BrowserWindow}= require("electron");
  function openWindow(){
    ipcRenderer.send("message2","hello from renderer")
  }

  ipcRenderer.on("channel1",(e,obj)=>{
    new Notification("Electron Notification",{
      body:"Received Message"
    })
    // console.log(BrowserWindow)
    let preMsg = document.getElementById("receivedMsg").value;
    if(!preMsg){
      document.getElementById("receivedMsg").innerText= `messsage from ${obj.id} : ${obj.msg}`
    }
    else{

      document.getElementById("receivedMsg").innerText= `${preMsg}

      messsage from ${obj.id} : ${obj.msg}` ;
    }

    // document.getElementById("receivedMsg").innerHTML = `<`
  })
  function sendMessage(){
    // console.log("msg send")
    let msg = document.getElementById("sendMsg").value;
    ipcRenderer.send("parent",msg);
  }


  //getting wencontents
  let activeArr= [];
  ipcRenderer.on("sending",(e,msg)=>{
    // console.log(msg)
    activeArr.push(msg);
    // console.log(activeArr)
  //  let currentActiveWin= document.getElementById("activeWin").value;
   //updating the current active window list
   populatingActiveWindow()
   
  })

  ipcRenderer.on("deleteWindow",(e,msg)=>{
    // console.log(msg)
    let result =activeArr.filter((ele)=>{
         console.log(ele)
        return ele != msg
    })
    activeArr=result;
    populatingActiveWindow()
    // console.log(activeArr)
  })

  function populatingActiveWindow(){
    let activeWindowDiv = document.getElementById("activeWin")
    let activeWindowList =document.createElement("div");
    activeArr.map((ele,idx)=>{
      activeWindowList.innerHTML += `<span>${ele}</span>\t`
    })
    activeWindowDiv.innerText=""
    activeWindowDiv.append(activeWindowList);
  }

  let winId ;

  let mainActiveWindowDiv = document.getElementById("activeWin")
  mainActiveWindowDiv.addEventListener("click",(e)=>{
    winId =e.target.innerText;
    msgSection.style.display="block";
  })

  function sendMsg(){
    let message = document.getElementById("msg").value;
    ipcRenderer.send("main-msg",{message,winId});
    msgSection.style.display="none";
  }

