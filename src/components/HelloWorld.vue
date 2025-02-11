<template>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">Vue Docs Scaling up Guide</a>.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'

const count = ref(0)

document.addEventListener('DOMContentLoaded', () => {
  if (window.myCustomAPI) {
    window.myCustomAPI.doSomething();
  } else {
    console.error('myCustomAPI is not available');
  }

  const video = document.createElement('video');
  video.style.width = '300px';
  video.style.height = '300px';
  video.style.display = 'none';
  document.body.appendChild(video);
  let captureStream;
  window.electronAPI.onStartCapture(async () => {
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
        video.onloadedmetadata = (e) => video.play()
        video.style.display = 'block';
      } catch (error) {
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
});

</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
