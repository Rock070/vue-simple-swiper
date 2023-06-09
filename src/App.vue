<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { Icon } from '@iconify/vue'

import Swiper from '@/components/Swiper.vue'
import WorkTable from '@/components/WorkTable.vue'
import FocusButton from '@/components/FocusButton.vue'
import Block from '@/components/Block.vue'

export interface SwiperProps {
  items: any[]
  gap?: number
  width?: number
  height?: number
  direction?: 'x' | 'y'
  perView?: number
  isPagination?: boolean
  isArrow?: boolean
}

const itemList = Array.from({ length: 20 }, (_, index) => index)

const { md } = useBreakpoints({
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536,
})

const options = reactive<SwiperProps>({
  items: [...itemList],
  perView: 3,
  gap: 10,
  height: 300,
  width: 700,
  direction: 'x',
  isPagination: true,
  isArrow: true,
})

onMounted(() => {
  const height = Math.floor(innerHeight * 0.3 * 0.7)
  const width = Math.floor(innerWidth * 0.6)

  options.width = width
  options.height = height
})
const swiperRootRef = ref<InstanceType<typeof Swiper>>()
</script>

<template>
  <div class="demo">
    <a
      type="button"
      href="https://github.com/Rock070/vue-simple-swiper"
      target="_blank" rel="noreferrer noopener"
      class="absolute right-4 top-4"
    >
      <Icon icon="mdi:github" class="h-8 w-8" />
    </a>
    <h1 class="font-bold text-2xl md:text-3xl lg:text-5xl mb-8 lg:mb-14">
      Simple Swiper Demo
    </h1>
    <div :class="options.direction === 'x' ? 'mb-12' : 'mb-6'">
      <!-- 控制台 -->
      <WorkTable :options="options" />

      <!-- focus button -->
      <FocusButton v-if="md" />
    </div>

    <div class="swiper-outer flex-center">
      <Swiper ref="swiperRootRef" v-bind="options">
        <template #default="{ item }">
          <Block class="flex-center h-full text-white">
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
  @apply lg:text-xl md:text-lg text-md
  @apply font-bold
}

.demo input {
  @apply outline-none
  @apply text-black
  @apply px-3
  @apply border-dark-50 border border-solid
}
</style>
