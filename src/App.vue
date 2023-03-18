<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useToggle } from '@vueuse/core'

import Swiper from '@/components/Swiper.vue'
import Block from '@/components/Block.vue'

export interface SwiperProps {
  gap?: number
  width?: number
  height?: number
  direction?: 'x' | 'y'
  perView?: number
  isPagination?: boolean
  isArrow?: boolean
}

const items = Array.from({ length: 20 }, (_, index) => index)

const options = reactive<SwiperProps>({
  perView: 3,
  gap: 20,
  height: 400,
  width: 1200,
  direction: 'y',
  isPagination: true,
  isArrow: true,
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
      <!-- 控制台 -->
      <div class="mb-10 grid grid-cols-3 gap-y-6">
        <div class="flex-center">
          <label for="gap">gap：</label>
          <input id="gap" v-model="options.gap" type="number">
        </div>
        <div class="flex-center">
          <label for="height">height：</label>
          <input id="height" v-model="options.height" type="number">
        </div>
        <div class="flex-center space-x-4">
          <h3>direction：</h3>
          <div class="flex-center space-x-2">
            <label for="x">x</label>
            <input id="x" v-model="options.direction" value="x" type="radio">
          </div>
          <div class="flex-center space-x-2">
            <label for="y">y</label>
            <input id="y" v-model="options.direction" value="y" type="radio">
          </div>
        </div>
        <div class="flex-center">
          <label for="width">width：</label>
          <input id="width" v-model="options.width" type="number">
        </div>
        <div class="flex-center space-x-4">
          <h3>isPagination：</h3>
          <div class="flex-center space-x-2">
            <label for="is-pagination-true">true</label>
            <input id="is-pagination-true" v-model="options.isPagination" :value="true" type="radio">
          </div>
          <div class="flex-center space-x-2">
            <label for="is-pagination-false">false</label>
            <input id="is-pagination-false" v-model="options.isPagination" :value="false" type="radio">
          </div>
        </div>
        <div class="flex-center space-x-4">
          <h3>isArrow：</h3>
          <div class="flex-center space-x-2">
            <label for="is-arrow-true">true</label>
            <input id="is-arrow-true" v-model="options.isArrow" :value="true" type="radio">
          </div>
          <div class="flex-center space-x-2">
            <label for="is-arrow-false">false</label>
            <input id="is-arrow-false" v-model="options.isArrow" :value="false" type="radio">
          </div>
        </div>
      </div>
      <!-- 控制台 -->

      <!-- focus button -->

      <div class="space-y-4">
        <button type="button" class="border-light-400 border border-solid p-4" @click="onFocusSwiper">
          Click me to use keyboard  ← & →  control slider
        </button>
        <div v-if="isFocus">
          Now use ← & → to change slider
        </div>
      </div>
    </div>
    <!-- focus button -->

    <div class="swiper-outer flex-center">
      <Swiper ref="swiperRootRef" :items="items" v-bind="options">
        <template #default="{ item }">
          <Block class="flex-center h-full">
            {{ item + 1 }}
          </Block>
        </template>
      </Swiper>
    </div>
  </div>
</template>

<style>
.flex-center {
  @apply flex items-center justify-center
}

.swiper-container:focus {
  outline: orange 4px dashed;
}

.demo label, .demo h3 {
  @apply text-xl font-bold
}

.demo input {
  @apply px-3
}
</style>
