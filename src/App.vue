<script setup lang="ts">
import Swiper from '@/components/Swiper.vue'
import Block from '@/components/Block.vue'

const items = Array.from({ length: 20 }, (_, index) => index)

const options = {
  perView: 3,
  gap: '10px',
}
</script>

<template>
  <div>
    <h1 class="font-bold text-2xl mb-10">
      Simple Swiper Demo
    </h1>
    <Swiper :items="items" :options="options">
      <template #default="{ item }">
        <Block>{{ item + 1 }}</Block>
      </template>
    </Swiper>
  </div>
</template>
