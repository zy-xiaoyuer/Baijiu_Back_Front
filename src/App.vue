<template>
  
    <router-view />
      
</template> 

<script setup lang="ts">
//确保组件在初次渲染和窗口变化时的高效响应
const debounce = (fn: any, delay: any) => {
    let timer: any;
    return (...args: any) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};
const resizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends resizeObserver {
    constructor(callback:any) {
        callback = debounce(callback, 200);
        super(callback);
    }
};
</script> 

<style scoped></style>