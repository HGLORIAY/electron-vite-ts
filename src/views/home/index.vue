<template>
    <div>
        home
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
import { onMounted, ref } from 'vue'
onMounted(() => {
    console.log('home mounted');
    if (window.myCustomAPI) {
        window.myCustomAPI.doSomething();
    } else {
        console.error('myCustomAPI is not available');
    }
})
function handleClick() {
    router.push('/capture')
}
</script>

<style scoped>
</style>