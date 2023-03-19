<script setup lang="ts">
import { computed, toRefs } from 'vue'

export interface Options {
  items: any[]
  gap?: number
  width?: number
  height?: number
  direction?: 'x' | 'y'
  perView?: number
  isPagination?: boolean
  isArrow?: boolean
}

export interface WorkTableProps {
  options: Options
}

const props = defineProps<WorkTableProps>()

const values = toRefs(props)

const itemLength = computed({
  get() {
    return values.options.value.items.length
  },
  set(val) {
    values.options.value.items = Array.from({ length: val }, (_, index) => index)
  },
})
</script>

<template>
  <div class="mb-10 grid gap-y-6 grid-cols-2 lg:grid-cols-3">
    <div class="flex-center">
      <label for="items">Items Length：</label>
      <input id="items" v-model="itemLength" type="number">
    </div>
    <div class="flex-center">
      <label for="perView">per view：</label>
      <input id="perView" v-model="values.options.value.perView" type="number">
    </div>
    <div class="flex-center">
      <label for="gap">gap：</label>
      <input id="gap" v-model="values.options.value.gap" type="number">
    </div>
    <div class="flex-center">
      <label for="height">height：</label>
      <input id="height" v-model="values.options.value.height" type="number">
    </div>
    <div class="flex-center space-x-4">
      <h3>direction：</h3>
      <div class="flex-center space-x-2">
        <label for="x">x</label>
        <input id="x" v-model="values.options.value.direction" value="x" type="radio">
      </div>
      <div class="flex-center space-x-2">
        <label for="y">y</label>
        <input id="y" v-model="values.options.value.direction" value="y" type="radio">
      </div>
    </div>
    <div class="flex-center">
      <label for="width">width：</label>
      <input id="width" v-model="values.options.value.width" type="number">
    </div>
    <div class="flex-center space-x-4">
      <h3>isPagination：</h3>
      <div class="flex-center space-x-2">
        <label for="is-pagination-true">true</label>
        <input id="is-pagination-true" v-model="values.options.value.isPagination" :value="true" type="radio">
      </div>
      <div class="flex-center space-x-2">
        <label for="is-pagination-false">false</label>
        <input id="is-pagination-false" v-model="values.options.value.isPagination" :value="false" type="radio">
      </div>
    </div>
    <div class="flex-center space-x-4">
      <h3>isArrow：</h3>
      <div class="flex-center space-x-2">
        <label for="is-arrow-true">true</label>
        <input id="is-arrow-true" v-model="values.options.value.isArrow" :value="true" type="radio">
      </div>
      <div class="flex-center space-x-2">
        <label for="is-arrow-false">false</label>
        <input id="is-arrow-false" v-model="values.options.value.isArrow" :value="false" type="radio">
      </div>
    </div>
  </div>
</template>
