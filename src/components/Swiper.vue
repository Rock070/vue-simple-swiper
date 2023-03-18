<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useIntersectionObserver, useScroll } from '@vueuse/core'
import type { UseScrollReturn } from '@vueuse/core'

export interface SwiperOptions {
  gap: string
  perView: number
}

export interface SwiperProps {
  items: any[]
  options: SwiperOptions
}

export type Direction = keyof UseScrollReturn['directions']

const props = withDefaults(defineProps<SwiperProps>(), {
  items: () => [],
  options: () => ({
    gap: '10px',
    perView: 3,
  }),
})

const swiperRef = ref<HTMLElement>(null)
const swiperSlideRefs = ref<HTMLElement[]>(null)
const totalPages = computed(() => {
  return props.items.length - props.options.perView + 1
})

const direction = ref<Direction | null>(null)
const scrollEndPage = ref<number | null>(null)

const pagination = reactive({
  current: 1,
  total: totalPages,
})
const scrollImpl = (index: number) => {
  nextTick(() => {
    const target = swiperRef.value?.children?.[index] as Element

    if (target && target.scrollIntoView)

      target?.scrollIntoView({ block: 'start', behavior: 'smooth', inline: 'start' })
  })
}

const onChangePagination = (page: number) => {
  pagination.current = page
  scrollImpl(page - 1)
}

const { directions } = useScroll(swiperRef, {
  onScroll() {
    const _direction = Object.entries(directions).find(([_, val]) => val,
    )?.[0] as Direction

    if (!_direction)
      return

    // 紀錄最後 scroll 的方向
    direction.value = _direction
  },
  onStop() {
    if (!direction.value || !scrollEndPage.value)
      return
    if (direction.value === 'left') {
      onChangePagination(scrollEndPage.value)
    }
    else if (direction.value === 'right') {
      const targetPage = Math.abs(scrollEndPage.value - props.options.perView) + 1
      onChangePagination(targetPage)
    }
    scrollEndPage.value = null
    direction.value = null
  },
})

const onClickIcon = (type: 'left' | 'right') => {
  let index = 0
  if (type === 'right') {
    if (pagination.current === totalPages.value)
      index = 1
    else
      index = pagination.current + 1
  }
  else if (type === 'left') {
    if (pagination.current === 1)
      index = totalPages.value
    else
      index = pagination.current - 1
  }

  onChangePagination(index)
}

onMounted(() => {
  if (swiperSlideRefs.value) {
    swiperSlideRefs.value.forEach((el) => {
      const { stop } = useIntersectionObserver(
        el,
        ([{ isIntersecting, target: _target }]) => {
          const target = _target as HTMLElement
          if (isIntersecting) {
            const index = Number(target.dataset.index)
            const page = Math.floor(index + 1)
            scrollEndPage.value = page
          }
        },
        { threshold: 0.75, root: swiperRef.value, rootMargin: '20px' },
      )

      // 確認這樣做的正確性
      onUnmounted(() => {
        stop()
      })
    })
  }
})
</script>

<template>
  <div>
    <!-- go left page -->
    <div class="flex items-center space-x-5">
      <button type="button" @click="onClickIcon('left')">
        <Icon icon="material-symbols:arrow-back-ios-new-rounded" />
      </button>
      <!-- container -->
      <div
        ref="swiperRef"
        class="shrink-0 w-780px overflow-x-auto flex space-x-4 swiper-container"
      >
        <template v-for="(item, index) in items" :key="item">
          <div ref="swiperSlideRefs" :data-index="index">
            <slot :index="index" :item="item" />
          </div>
        </template>
      </div>

      <!-- go right page -->
      <button type="button" @click="onClickIcon('right')">
        <Icon icon="material-symbols:arrow-forward-ios-rounded" />
      </button>
    </div>

    <!-- pagination -->
    <div>
      <button v-for="page in totalPages" :key="page" type="button" @click="onChangePagination(page)">
        <Icon v-if="pagination.current === page" icon="bi:dot" width="40" />
        <Icon v-else icon="ph:dot-outline-light" width="40" />
      </button>
    </div>
  </div>
</template>

<style>
.swiper-container {
  scroll-behavior: smooth;
  scroll-snap-type: x proximity;
}

.swiper-container > * {
  scroll-snap-align: start;
}
</style>
