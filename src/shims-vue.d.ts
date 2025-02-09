interface Window {
    myCustomAPI: {
        doSomething: () => void;
        sendToMain: (message: string) => void;
    };
}