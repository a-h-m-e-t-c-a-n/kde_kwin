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
//   let keys = Object.keys(obj);
//   let str = "";
//   for (let i = 0; i < keys.length; i++) {
//       str += keys[i] + " : " + obj[keys[i]] + "\n";
//   }
//   console.error(str);
// }
// workspace.windowActivated.connect(updateActivated);
// function updateActivated(win) {
//     dump(win);
// }
// console.error("ac:init");

function intersect(cursorX, cursorY, radius, rect) {
   // Find the closest point on the rectangle to the circle's center
   let closestX = Math.max(rect.x, Math.min(cursorX, rect.x + rect.width));
   let closestY = Math.max(rect.y, Math.min(cursorY, rect.y + rect.height));
   
   // Calculate the distance from the circle's center to this closest point
   let dx = cursorX - closestX;
   let dy = cursorY - closestY;
   let distanceSquared = dx * dx + dy * dy;

   // Check if the distance is less than or equal to the circle's radius
   return distanceSquared <= radius * radius;
}

function selectNextWindow(direction) {
   // console.error("ac:selectNextWindow");
   const windowList = workspace.stackingOrder; // Index 0 is the top-most window

   let normalWindows = [];
   let maximizedWindows = [];
   const cursorPos = workspace.cursorPos;
   const delta = 150;

   for (const win of windowList) {
       if (win.desktopWindow || win.minimized) {
           continue; // Ignore desktop and minimized windows
       }

       let area = workspace.clientArea(KWin.MaximizeArea, win);
       let isMaximized = win.width > area.width - 10 && win.height > area.height - 10;
       
      if (intersect(cursorPos.x, cursorPos.y, delta, win.clientGeometry)) {
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
