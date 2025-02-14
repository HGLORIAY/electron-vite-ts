import { join } from 'path';
import {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    desktopCapturer,
    globalShortcut,
    systemPreferences,
    screen
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
const winURL = isDev ? 'http://localhost:5173' : `file://${__dirname}/../../index.html`;
let mainWindow: BrowserWindow;
let captureWindow: BrowserWindow;
let isCapturing = false;
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
    // if (isDev) {
    mainWindow.loadURL(winURL);
    mainWindow.webContents.openDevTools();// Open the DevTools.
    // } else {
    //     mainWindow.loadFile(join(__dirname, '../../index.html'));
    // }
    createCaptureWindow()
    registerShortcut();

}
function createCaptureWindow() {
    // 创建新的全屏窗口
    captureWindow = new BrowserWindow({
        backgroundColor: '#000',
        fullscreen: true,
        show: false,
        focusable: false,   // 禁止获取焦点 
        alwaysOnTop: true,  // 置顶显示 
        webPreferences: {
            contextIsolation: true, // 启用上下文隔离
            nodeIntegration: false, // 禁用 Node.js 集成
            preload: join(__dirname, '../preload/preload.js')
        }
    });
    captureWindow.loadURL(winURL + '/capture');
    // captureWindow.webContents.openDevTools();// Open the DevTools.
    captureWindow.setIgnoreMouseEvents(true, { forward: true });

    ipcMain.handle('get-active-window-source', async () => {
        const sources = await desktopCapturer.getSources({ types: ['screen', 'window'], thumbnailSize: { width: 0, height: 0 } });
        for (const source of sources) {
            if (source.id.includes('screen') || source.name == 'WeMail') continue;
            console.log(source);
            return source.id;
        }
        return null;
    });
}
function closeCaptureWindow() {
    if (captureWindow) {
        captureWindow.close();
    }
}
function showCaptureWindow() {
    const point = screen.getCursorScreenPoint()

    console.log(point);

    if (captureWindow) {
        captureWindow.setPosition(point.x, point.y);
        captureWindow.showInactive();
    } else {
        createCaptureWindow();
    }
}
function registerShortcut() {
    globalShortcut.register('Ctrl+ALT+S', () => {
        console.log('Ctrl+ALT+S is pressed');

        if (isCapturing) {
            console.log('停止捕获');
            captureWindow.webContents.send('stop-capture');
            captureWindow.hide();
        } else {
            console.log('开始捕获');
            showCaptureWindow();
            captureWindow.webContents.send('start-capture');
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