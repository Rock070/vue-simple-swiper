<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useToggle } from '@vueuse/core'

const [isFocus, setFocus] = useToggle(false)
const focusEvent = () => setFocus(true)
const blurEvent = () => setFocus(false)

const onFocusSwiper = () => {
  const target = document.querySelector('.swiper-container') as HTMLElement
  target?.focus()
}

onMounted(() => {
  const target = document.querySelector('.swiper-container') as HTMLElement

  target.addEventListener('focus', focusEvent)
  target.addEventListener('blur', blurEvent)
})

onUnmounted(() => {
  const target = document.querySelector('.swiper-container') as HTMLElement

  target.removeEventListener('focus', focusEvent)
  target.removeEventListener('blur', blurEvent)
})
</script>

<template>
  <div class="space-y-4">
    <button type="button" class="border-light-400 border border-solid p-4" @click="onFocusSwiper">
      Click me to use keyboard  ← & →  control slider
    </button>
    <div v-if="isFocus">
      Now use ← & → to change slider
    </div>
  </div>
</template>
