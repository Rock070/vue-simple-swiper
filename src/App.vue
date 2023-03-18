<script setup lang="ts">
import { reactive, ref } from 'vue'

import Swiper from '@/components/Swiper.vue'
import WorkTable from '@/components/WorkTable.vue'
import FocusButton from '@/components/FocusButton.vue'
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
const swiperRootRef = ref<InstanceType<typeof Swiper>>()
</script>

<template>
  <div class="demo">
    <h1 class="font-bold text-5xl mb-10">
      Simple Swiper Demo
    </h1>
    <div class="mb-10">
      <!-- 控制台 -->
      <WorkTable :options="options" />

      <!-- focus button -->
      <FocusButton />
    </div>

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
