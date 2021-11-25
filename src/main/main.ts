import { app, session, BrowserWindow, ipcMain } from 'electron'
import { createApiInstance } from './api-instance';
import { isOSX, isDevelopment, getRouteUrl } from './helpers';
import { interceptSamlLogin } from './intercept-saml-login';

const isDev = isDevelopment();
const defaultWidth = 600;
const defaultHeight = 500;

const createWindow = (width: number, height: number) => {
  const mainWindow = new BrowserWindow({
    width,
    height,
    frame: true,
    autoHideMenuBar: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  const { webContents } = mainWindow;

  if (isDev) {
    webContents.openDevTools();
  } 
  
  ipcMain.on('request-api', async (event) => {
    createApiInstance(event.ports[0]);
  })

  webContents.setWindowOpenHandler((details) => {
    mainWindow.loadURL(details.url);
    return { action: 'deny' };
  });

  mainWindow.loadURL(getRouteUrl('/'));
  interceptSamlLogin(mainWindow, session.defaultSession);
}

app.whenReady().then(() => {
  createWindow(defaultWidth, defaultHeight);

  app.on('activate', () => {
    if (isOSX() && BrowserWindow.getAllWindows().length === 0) {
      createWindow(defaultWidth, defaultHeight);
    }
  })
});

app.on('window-all-closed', () => {
  if (!isOSX()) {
    app.quit();
  }
})
