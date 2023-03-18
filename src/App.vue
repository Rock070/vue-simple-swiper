<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Icon } from '@iconify/vue'

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
  height: 300,
  width: 800,
  direction: 'y',
  isPagination: true,
  isArrow: true,
})
const swiperRootRef = ref<InstanceType<typeof Swiper>>()
</script>

<template>
  <div class="demo">
    <a type="button" href="https://github.com/Rock070/vue-simple-swiper" target="_blank" rel="noreferrer noopener">
      <Icon icon="mdi:github" class="absolute right-4 top-4 h-6 w-6" />
    </a>
    <h1 class="font-bold text-5xl mb-14">
      Simple Swiper Demo
    </h1>
    <div class="mb-12 ">
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
