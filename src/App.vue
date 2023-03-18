<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useToggle } from '@vueuse/core'

import Swiper from '@/components/Swiper.vue'
import Block from '@/components/Block.vue'

const items = Array.from({ length: 20 }, (_, index) => index)

const options = {
  perView: 3,
  gap: '10px',
}

const onFocusSwiper = () => {
  const target = document.querySelector('.swiper-container') as HTMLElement
  target?.focus()
}

const [isFocus, setFocus] = useToggle(false)
const swiperRootRef = ref<InstanceType<typeof Swiper>>()

const focusEvent = () => {
  setFocus(true)
}

const blurEvent = () => {
  setFocus(false)
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
  <div>
    <div class="mb-10">
      <h1 class="font-bold text-2xl mb-3">
        Simple Swiper Demo
      </h1>
      <div class="space-y-4">
        <button type="button" class="border-light-400 border border-solid p-4" @click="onFocusSwiper">
          Click me to use keyboard  ← & →  control slider
        </button>
        <div v-if="isFocus">
          Now use ← & → to change slider
        </div>
      </div>
    </div>
    <div class="swiper-outer">
      <Swiper ref="swiperRootRef" :items="items" :options="options">
        <template #default="{ item }">
          <Block>{{ item + 1 }}</Block>
        </template>
      </Swiper>
    </div>
  </div>
</template>

<style>
.swiper-container:focus {
  outline: orange 4px dashed;
}
</style>
