//console.error("ac:init");

function selectNextWindow(direction) {
  //console.error("ac:selectNextWindow");

  const windowList = workspace.windowList();
  let underCursorWindows = [];
  let maximizedWindows = [];
  const cursorPos = workspace.cursorPos;

  // Categorize windows
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
        underCursorWindows.push(win);
      }
    }

    if (isMaximized) {
      maximizedWindows.push(win);
    }
  }

  if (underCursorWindows.length > 0) {
    // Cycle through non-maximized windows under cursor
    let currentActiveIndex = underCursorWindows.findIndex((win) => win.active);

    let nextIdx =
      currentActiveIndex === -1
        ? 0
        : (currentActiveIndex + direction + underCursorWindows.length) %
          underCursorWindows.length;

    workspace.activeWindow = underCursorWindows[nextIdx];
    return;
  }

  if (maximizedWindows.length > 0) {
    // If no non-maximized windows, switch between maximized windows
    let currentActiveIndex = maximizedWindows.findIndex((win) => win.active);

    let nextIdx =
      currentActiveIndex === -1
        ? 0
        : (currentActiveIndex + direction + maximizedWindows.length) %
          maximizedWindows.length;

    workspace.activeWindow = maximizedWindows[nextIdx];
    return;
  }

  //console.error("No windows to switch to.");
}

registerShortcut(
  "nextWindow",
  "Select next window under mouse",
  "Meta+I",
  function () {
    selectNextWindow(1);
  }
);
