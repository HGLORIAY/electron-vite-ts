// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// import { contextBridge, ipcRenderer } from 'electron';
const { contextBridge, ipcRenderer } = require('electron')
// 自定义全局对象
const myCustomAPI = {
  doSomething: () => {
    console.log('Doing something in preload script');
  },
  sendToMain: (message: string) => ipcRenderer.send('custom-message', message)
};
// 暴露自定义全局对象
contextBridge.exposeInMainWorld('myCustomAPI', myCustomAPI);

contextBridge.exposeInMainWorld('electronAPI', {
  onStartCapture: (callback: any) => ipcRenderer.on('start-capture', callback),
  onStopCapture: (callback: any) => ipcRenderer.on('stop-capture', callback),
  getActiveWindowSource: () => ipcRenderer.invoke('get-active-window-source')
});