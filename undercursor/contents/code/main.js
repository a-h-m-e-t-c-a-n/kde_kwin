// function dump(obj) {
//     let keys = Object.keys(obj);
//     let str = "";
//     for (let i = 0; i < keys.length; i++) {
//         str += keys[i] + " : " + obj[keys[i]] + "\n";
//     }
//     console.error(str);
// }

function intersect(cursorX, cursorY, radius, rect) {
    let closestX = Math.max(rect.x, Math.min(cursorX, rect.x + rect.width));
    let closestY = Math.max(rect.y, Math.min(cursorY, rect.y + rect.height));
    
    let dx = cursorX - closestX;
    let dy = cursorY - closestY;
    let distanceSquared = dx * dx + dy * dy;

    return distanceSquared <= radius * radius;
}

function switchToSpecificApp(appClassName,screen) {
    const windowList = workspace.stackingOrder;
    for (var i=windowList.length-1;i>=0;i--) {
        const win_reverse=windowList[i]
        if(win_reverse.resourceClass.includes(appClassName) && !win_reverse.minimized && win_reverse.output==screen){
            if(workspace.activeWindow != win_reverse){
                workspace.activeWindow = win_reverse
                return
            }
            else
            {
                for (const win_forward of windowList){
                    if(win_forward.resourceClass.includes(appClassName) && !win_forward.minimized && win_forward.output==screen){
                        if(win_forward != win_reverse){
                            workspace.activeWindow = win_forward
                            return
                        }

                    }

                }
            }
            
        }
    }
    //console.error("Specific app not found or minimized:", appClassName);
}
function handleEdgeSwitch() {
    const cursorPos = workspace.cursorPos;
    const screen = workspace.screenAt(cursorPos);

    const edgeAppMap = {
        "top-left": "Code",       
        "top-right": "chrome",      
        "bottom-left": "konsole",    
        "bottom-right": "dolphin",   
        "right-up": "chrome",       
        "right-down": "konsole",     
        "left-up": "chrome",        
        "left-down": "Code"       
    };

    const { top, left, right, bottom } = screen.geometry;

    const leftMargin=370
    const rightMargin=20
    const topMargin=20
    const bottomMargin=20

    const isLeftUp = cursorPos.x <= left + leftMargin && cursorPos.y  <  (top+(bottom-top)/2);
    const isLeftDown = cursorPos.x <= left + leftMargin && cursorPos.y  >  (top+(bottom-top)/2);
    const isRightUp = cursorPos.x >= right - rightMargin && cursorPos.y  <  (top+(bottom-top)/2);
    const isRightDown = cursorPos.x >= right - rightMargin && cursorPos.y  >  (top+(bottom-top)/2);

    const isTopLeft = cursorPos.y <= top + topMargin && cursorPos.x  <  (left+(right-left)/2);
    const isTopRight = cursorPos.y <= top + topMargin && cursorPos.x > (left+(right-left)/2);
    const isBottomLeft = cursorPos.y >= bottom - bottomMargin && cursorPos.x  <  (left+(right-left)/2);
    const isBottomRight = cursorPos.y >= bottom - bottomMargin && cursorPos.x  >  (left+(right-left)/2);

    if (isTopLeft) {
        switchToSpecificApp(edgeAppMap["top-left"], screen);
        return true;
    }
    if (isTopRight) {
        switchToSpecificApp(edgeAppMap["top-right"], screen);
        return true;
    }
    if (isBottomLeft) {
        switchToSpecificApp(edgeAppMap["bottom-left"], screen);
        return true;
    }
    if (isBottomRight) {
        switchToSpecificApp(edgeAppMap["bottom-right"], screen);
        return true;
    }
    if (isLeftUp) {
        switchToSpecificApp(edgeAppMap["left-up"], screen);
        return true;
    }
    if (isLeftDown) {
        switchToSpecificApp(edgeAppMap["left-down"], screen);
        return true;
    }
    if (isRightUp) {
        switchToSpecificApp(edgeAppMap["right-up"], screen);
        return true;
    }
    if (isRightDown) {
        switchToSpecificApp(edgeAppMap["right-down"], screen);
        return true;
    }
   
    return false; // No match found
}

function selectNextWindow() {
    const cursorPos = workspace.cursorPos;
    const windowList = workspace.stackingOrder; // BackWindow:0 FrontWindow=length-1

    let normalWindows = [];
    let maximizedWindows = [];
   
    for (const win of windowList) {
        if (win.desktopWindow || win.minimized) {
            continue; // Ignore desktop and minimized windows
        }

        let area = workspace.clientArea(KWin.MaximizeArea, win);
        let isMaximized = win.width > area.width - 10 && win.height > area.height - 10;
        
        if (intersect(cursorPos.x, cursorPos.y, 10, win.clientGeometry)) {
            if (!isMaximized) {
                normalWindows.push(win);
            }
        }

        if (isMaximized) {
            maximizedWindows.push(win);
        }
    }

    if (normalWindows.length > 0) {
        let frontWindow = normalWindows[normalWindows.length - 1];
        if (frontWindow.active) {
            if (normalWindows.length > 1) {
                workspace.activeWindow = normalWindows[0];
            }
        } 
        else {
            workspace.activeWindow = frontWindow;
        }
    }
    else if (maximizedWindows.length > 0) {
        let frontWindow = maximizedWindows[maximizedWindows.length - 1];
        if (frontWindow.active) {
            if (maximizedWindows.length > 1) {
                workspace.activeWindow = maximizedWindows[0];
            }
        } 
        else {
            workspace.activeWindow = frontWindow;
        }
    }
}

registerShortcut(
    "nextWindow",
    "Select next window under mouse",
    "Meta+I",
    function () {
        if(!handleEdgeSwitch()){
            selectNextWindow();
        }
    }
);
