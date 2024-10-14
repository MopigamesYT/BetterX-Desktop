import { Tray, Menu, app } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { showAboutDialog } from '../windows/aboutWindow.js';
import { resetBetterX } from '../services/settingsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tray = null;

export function initTray(win) {
  const onTrayClick = () => {
    if (win.isVisible()) win.hide();
    else win.show();
  };
  
  const trayMenu = Menu.buildFromTemplate([
    {
      label: "Open",
      click() {
        win.show();
      }
    },
    {
      label: "About",
      click: showAboutDialog
    },
    {
      label: "Reset BetterX",
      click: async () => {
        try {
          await resetBetterX(win);
        } catch (error) {
          console.error('Failed to reset BetterX:', error);
          // Optionally, show an error message to the user
        }
      }
    },
    {
      label: "BetterX Desktop Settings",
      click: openBetterXDesktopSettings
    },
    {
      type: "separator"
    },
    {
      label: "Restart",
      click() {
        app.relaunch();
        app.quit();
      }
    },
    {
      label: "Quit",
      click() {
        app.quit();
      }
    }
  ]);

  const iconPath = path.join(__dirname, "..", "resources", "betterX.png");
  if (!fs.existsSync(iconPath)) {
    console.warn(`Tray icon not found at ${iconPath}. Using default icon.`);
  }

  tray = new Tray(iconPath);
  tray.setToolTip("BetterX");
  tray.setContextMenu(trayMenu);
  tray.on("click", onTrayClick);
}

function openBetterXDesktopSettings() {
  // Implement opening BetterX Desktop settings here
  console.log('BetterX Desktop Settings clicked');
}