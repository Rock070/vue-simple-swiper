<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useToggle } from '@vueuse/core'

import Swiper from '@/components/Swiper.vue'
import Block from '@/components/Block.vue'

const items = Array.from({ length: 20 }, (_, index) => index)

const options = reactive({
  perView: 3,
  gap: 20,
  width: 1200,
})

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
  <div class="demo">
    <h1 class="font-bold text-5xl mb-10">
      Simple Swiper Demo
    </h1>
    <div class="mb-10">
      <div class="mb-10 space-x-6 flex justify-center items-center">
        <div class="flex">
          <label for="gap">gap：</label>
          <input id="gap" v-model="options.gap" type="number">
        </div>
        <div class="flex">
          <label for="width">width：</label>
          <input id="width" v-model="options.width" type="number">
        </div>
      </div>

      <div class="space-y-4">
        <button type="button" class="border-light-400 border border-solid p-4" @click="onFocusSwiper">
          Click me to use keyboard  ← & →  control slider
        </button>
        <div v-if="isFocus">
          Now use ← & → to change slider
        </div>
      </div>
    </div>
    <div class="swiper-outer flex justify-center">
      <Swiper ref="swiperRootRef" :items="items" v-bind="options">
        <template #default="{ item }">
          <Block>
            {{ item + 1 }}
          </Block>
        </template>
      </Swiper>
    </div>
  </div>
</template>

<style>
.swiper-container:focus {
  outline: orange 4px dashed;
}

.demo label {
  @apply text-xl font-bold
}

.demo input {
  @apply px-3
}
</style>
