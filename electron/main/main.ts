import { join } from 'path';
import {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    desktopCapturer, globalShortcut,
    systemPreferences
} from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// 获取当前文件的绝对路径
const __filename = fileURLToPath(import.meta.url);
// 获取当前文件所在的目录
const __dirname = dirname(__filename);
// const isDev = process.env.npm_lifecycle_event === "app:dev" ? true : false;
const isDev = app.isPackaged ? false : true;
// const isDev = false;

let mainWindow: BrowserWindow;
let isCapturing = false;
let captureStream: MediaStream | null;
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true, // 启用上下文隔离
            nodeIntegration: false, // 禁用 Node.js 集成
            preload: join(__dirname, '../preload/preload.js')
        }
    });
    // and load the index.html of the app.
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');// Open the DevTools.
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(join(__dirname, '../../index.html'));
    }

    registerShortcut();

    ipcMain.handle('get-active-window-source', async () => {
        const sources = await desktopCapturer.getSources({ types: ['window'] });
        for (const source of sources) {
            if (source.id.includes('screen')) continue;
            return source.id;
        }
        return null;
    });
}
function registerShortcut() {
    globalShortcut.register('Ctrl+ALT+S', () => {
        console.log('Ctrl+ALT+S is pressed');
        
        if (isCapturing) {
            console.log('停止捕获');
            
            mainWindow.webContents.send('stop-capture');
        } else {
            console.log('开始捕获');
            
            mainWindow.webContents.send('start-capture');
        }
        isCapturing = !isCapturing;
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});