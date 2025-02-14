<template>
    <div class="capture-container">
        <video id="captureVideo"></video>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
onMounted(() => {
    console.log('capture mounted');

    let video = document.getElementById('captureVideo') as HTMLVideoElement;
    console.log(video);
    let captureStream: any;
    window.electronAPI.onStartCapture(async () => {
        console.log('capture started');
        const sourceId = await window.electronAPI.getActiveWindowSource();
        if (sourceId) {
            try {
                const constraints = {
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: sourceId
                        }
                    }
                } as any;
                console.log('Trying to capture with source ID:', sourceId);
                captureStream = await navigator.mediaDevices.getUserMedia(constraints);
                video.srcObject = captureStream;
                video.play()
                video.style.display = 'block';
            } catch (error: any) {
                console.error('Error capturing window:', error);
                if (error.name === 'NotReadableError') {
                    console.log('Possible reasons: Permission issues, window is occupied, or hardware problems.');
                }
            }
        }
    });
    window.electronAPI.onStopCapture(() => {
        if (captureStream) {
            const tracks = captureStream.getTracks();
            tracks.forEach(track => track.stop());
            captureStream = null;
            video.pause();
            video.srcObject = null;
            video.style.display = 'none';
        }
    });
})
</script>
<style scoped lang="scss">
.capture-container {
    width: 100%;
    height: 100%;

    #captureVideo {
        width: 100%;
        height: 100%;
        object-fit: fill;
    }
}
</style>