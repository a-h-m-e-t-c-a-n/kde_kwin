/*window.clientGeometry
x : 2560
y : 0
width : 1080
height : 1920
left : 2560
right : 3640
top : 0
bottom : 1920
*/
// function dump(obj) {
//    let keys=Object.keys(obj)
//    let str=""
//    for(let i=0;i<keys.length;i++){
//     str+=keys[i] +" : "+obj[keys[i]]+"\n"
//    }
//    console.error(str)
// }
// workspace.windowActivated.connect(updateActivated);
// function updateActivated(win) {
//     dump(win);
// }
//console.error("ac:init");   
function selectNextWindow(direction) {
  //console.error("ac:selectNextWindow");
  const windowList = workspace.stackingOrder; //index 0 en üstteki pencere 
  
  let normalWindows = [];
  let maximizedWindows = [];
  const cursorPos = workspace.cursorPos;

  for (const win of windowList) {
    if (win.desktopWindow || win.minimized) {
      continue; // Ignore desktop and minimized windows
    }

    let area = workspace.clientArea(KWin.MaximizeArea, win);
    let isMaximized =
      win.width > area.width - 10 && win.height > area.height - 10;

    if (
      cursorPos.x > win.x &&
      cursorPos.x < win.x + win.width &&
      cursorPos.y > win.y &&
      cursorPos.y < win.y + win.height
    ) {
      if (!isMaximized) {
        normalWindows.unshift(win);
      }
    }

    if (isMaximized) {
      maximizedWindows.unshift(win);
    }
  }

  if (normalWindows.length > 0) {
    let frontWindow = normalWindows[0];
    if(frontWindow.active){
      if(normalWindows.length>1){
        workspace.activeWindow = normalWindows[normalWindows.length-1];
        return;
      }
    }
    else{
      workspace.activeWindow = frontWindow;
      return;
    }
  }
 if (maximizedWindows.length > 0) {
    let frontWindow = maximizedWindows[0];
    if(frontWindow.active){
      if(maximizedWindows.length>1){
        workspace.activeWindow = maximizedWindows[maximizedWindows.length-1];
        return;
      }
    }
    else{
      workspace.activeWindow = frontWindow;
      return;
    }
  }
}

registerShortcut(
  "nextWindow",
  "Select next window under mouse",
  "Meta+I",
  function () {
    selectNextWindow(1);
  }
);
