# UnderCursor KDE extension

## Overview

This UnderCursor enhances the window management experience on KDE by enabling cycling through windows based on their position relative to the mouse cursor. It categorizes windows into two groups: those under the cursor and maximized windows. Users can switch between these windows using a keyboard shortcut.

---

## Features

1. **Cycle Through Windows Under the Cursor**:
   - When multiple windows are under the mouse cursor, the script allows cycling through them one at a time.

2. **Switch Between Maximized Windows**:
   - If no non-maximized windows are under the cursor, the script switches between maximized windows instead.

3. **Keyboard Shortcut**:
   - The default shortcut is `Meta+I`. This shortcut triggers the cycling behavior.

4. **Ignores Desktop and Minimized Windows**:
   - Desktop windows and minimized windows are excluded from consideration, ensuring only visible and relevant windows are included.

---

## Script Logic

1. **Categorization of Windows**:
   - Windows are categorized into:
     - **Under-Cursor Windows**: Non-maximized windows located beneath the current mouse position.
     - **Maximized Windows**: Windows that occupy almost the entire screen.

2. **Cycling Logic**:
   - If there are windows under the cursor:
     - Cycle through the windows under the cursor.
   - If there are no windows under the cursor but there are maximized windows:
     - Switch between the maximized windows.
   - If no valid windows are found:
     - Do nothing and log the absence of windows (for debugging).

3. **Keyboard Shortcut Registration**:
   - A shortcut (`Meta+I`) is registered to invoke the `selectNextWindow` function, enabling window selection with ease.

---

## Installation

1. **Add the Script to KWin**:
   - Save the script as a `.js` file (e.g., `selectNextWindow.js`).
   - Copy the file to the appropriate UnderCursor directory:
     ```
     ~/.local/share/kwin/scripts/
     ```

2. **Activate the Script**:
   - Open the **System Settings** application.
   - Navigate to **Window Management > UnderCursors**.
   - Click **Install from File**, and select your script.
   - Enable the script by checking the corresponding checkbox.

3. **Modify Shortcut (Optional)**:
   - Open **System Settings**.
   - Go to **Shortcuts**.
   - Search for `Select next window under mouse` and change the shortcut if desired.

---

## Customization

- **Shortcut**:
  - To change the default shortcut, modify the `registerShortcut` function:
    ```javascript
    registerShortcut(
      "nextWindow",
      "Select next window under mouse",
      "YourPreferredShortcut",
      function () {
        selectNextWindow(1);
      }
    );
    ```
    Replace `"YourPreferredShortcut"` with the desired key combination.

- **Debugging**:
  - Uncomment the `console.error` statements to log debugging messages.

---

## Usage

1. Move the mouse cursor to an area with overlapping or adjacent windows.
2. Press `Meta+I` (or your configured shortcut) to cycle through the windows under the cursor.
3. If there are no windows under the cursor, use the shortcut to switch between maximized windows.

---

## Known Limitations

- **Focus Behavior**:
  - Windows under the cursor must be clearly defined. Overlapping windows may not always cycle as expected depending on their stacking order.

- **No Visual Indicator**:
  - The script does not provide a visual preview of the cycling order.

