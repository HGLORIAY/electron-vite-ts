interface Window {
    myCustomAPI: {
        doSomething: () => void;
        sendToMain: (message: string) => void;
    };
    electronAPI: any;
}
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}