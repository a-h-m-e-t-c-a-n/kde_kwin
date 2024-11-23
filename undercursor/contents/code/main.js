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
    for (const win of windowList) {
        if(win.resourceClass === appClassName && !win.minimized && win.output==screen && workspace.activeWindow!=win){
            workspace.activeWindow = win;
            return;
        }
    }
    //console.error("Specific app not found or minimized:", appClassName);
}

function selectNextWindow(direction) {
    const windowList = workspace.stackingOrder; // Index 0 is the top-most window
    let normalWindows = [];
    let maximizedWindows = [];

    const cursorPos = workspace.cursorPos;

    const screen = workspace.screenAt(cursorPos);
    
    const cornerThreshold = 50;
    const isTop = cursorPos.y <= (screen.geometry.top+cornerThreshold)
    const isLeft = cursorPos.x <= (screen.geometry.left+cornerThreshold)
    const isBottom = cursorPos.y >= (screen.geometry.bottom-cornerThreshold)
    const isRight = cursorPos.x >= (screen.geometry.right-cornerThreshold)
    
    if (isTop) {
        switchToSpecificApp("google-chrome-unstable",screen);
        return;
    }
    if (isLeft) {
        switchToSpecificApp("Code",screen);
        return;
    }
    if (isRight) {
        switchToSpecificApp("Code",screen);
        return;
    }
    if (isBottom) {
        switchToSpecificApp("org.kde.konsole",screen);
        return;
    }

    for (const win of windowList) {
        if (win.desktopWindow || win.minimized) {
            continue; // Ignore desktop and minimized windows
        }

        let area = workspace.clientArea(KWin.MaximizeArea, win);
        let isMaximized = win.width > area.width - 10 && win.height > area.height - 10;
        
        if (intersect(cursorPos.x, cursorPos.y, 150, win.clientGeometry)) {
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
        if (frontWindow.active) {
            if (normalWindows.length > 1) {
                workspace.activeWindow = normalWindows[normalWindows.length - 1];
            }
            return;
        } else {
            workspace.activeWindow = frontWindow;
            return;
        }
    }

    if (maximizedWindows.length > 0) {
        let frontWindow = maximizedWindows[0];
        if (frontWindow.active) {
            if (maximizedWindows.length > 1) {
                workspace.activeWindow = maximizedWindows[maximizedWindows.length - 1];
            }
            return;
        } else {
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
