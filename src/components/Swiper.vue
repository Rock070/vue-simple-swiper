<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useEventListener, useIntersectionObserver, useScroll, useThrottleFn } from '@vueuse/core'
import type { UseScrollReturn } from '@vueuse/core'

export interface SwiperProps {
  items: any[]
  gap?: number
  width?: number
  perView?: number
}

export type Direction = keyof UseScrollReturn['directions']

const props = withDefaults(defineProps<SwiperProps>(), {
  items: () => [],
  width: 800,
  gap: 10,
  perView: 3,
})

const swiperRef = ref<HTMLElement | null>(null)
const swiperSlideRefs = ref<HTMLElement[] | null>(null)
const totalPages = computed(() => {
  return props.items.length - props.perView + 1
})

const direction = ref<Direction | null>(null)
const scrollEndPage = ref<number | null>(null)

const pagination = reactive({
  current: 1,
  total: totalPages,
})

const scrollImpl = (index: number) => {
  const target = swiperRef.value?.children?.[index] as Element

  if (target && target.scrollIntoView)
    target.scrollIntoView({ inline: 'start' })
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
      const targetPage = Math.abs(scrollEndPage.value - props.perView) + 1
      onChangePagination(targetPage)
    }

    scrollEndPage.value = null
    direction.value = null
  },
})

const goPage = (type: 'previous' | 'next') => {
  let index = 0

  if (type === 'next') {
    if (pagination.current === totalPages.value)
      index = 1
    else
      index = pagination.current + 1
  }
  else if (type === 'previous') {
    if (pagination.current === 1)
      index = totalPages.value
    else
      index = pagination.current - 1
  }

  onChangePagination(index)
}

const onIconClick = useThrottleFn(goPage, 200)

onMounted(() => {
  if (swiperSlideRefs.value) {
    swiperSlideRefs.value.forEach((el) => {
      const { stop } = useIntersectionObserver(
        el,
        // @ts-expect-error 型別待補強
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

const KEY_DOWN_PREVENT_KEY_CODE_LIST = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

useEventListener(swiperRef, 'keydown', useThrottleFn((e: KeyboardEvent) => {
  if (KEY_DOWN_PREVENT_KEY_CODE_LIST.includes(e.code))
    e.preventDefault()

  if (e.code === 'ArrowRight')
    goPage('next')

  else if (e.code === 'ArrowLeft')
    goPage('previous')
}, 100))

const outerStyle = computed(() => {
  const swiperWidth = props.width

  const ICON_WIDTH = 32
  const ICON_GAP = 8

  const width = swiperWidth + ((ICON_WIDTH + ICON_GAP) * 2)

  return {
    width: `${width}px`,
  }
})

const swiperStyle = computed(() => {
  const totalGapWidth = props.gap * (props.perView - 1)
  const slideWidth = (props.width - totalGapWidth) / props.perView

  return {
    'width': `${props.width}px`,
    '--slide-margin': `${props.gap / 2}px`,
    '--slide-width': `${slideWidth}px`,
  }
})

defineExpose({
  swiperRef,
})
</script>

<template>
  <div :style="outerStyle">
    <div class="flex items-center space-x-2">
      <!-- go left page -->
      <button
        type="button"
        class="p-2"
        @click="onIconClick('previous')"
      >
        <Icon icon="material-symbols:arrow-back-ios-new-rounded" />
      </button>
      <!-- container -->
      <div
        ref="swiperRef"
        role="slider"
        class="shrink-0 overflow-x-auto flex swiper-container"
        :style="swiperStyle"
        tabindex="0"
      >
        <template v-for="(item, index) in items" :key="item">
          <div
            ref="swiperSlideRefs"
            :data-index="index"
            class="swiper-slide inline-block shrink-0 overflow-auto"
          >
            <slot :index="index" :item="item" />
          </div>
        </template>
      </div>

      <!-- go right page -->
      <button
        type="button"
        class="p-2"
        @click="onIconClick('next')"
      >
        <Icon icon="material-symbols:arrow-forward-ios-rounded" />
      </button>
    </div>

    <!-- pagination -->
    <div class="mx-auto w-full">
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

.swiper-slide {
  margin: 0 var(--slide-margin);
  width: var(--slide-width);
}

.swiper-slide:first-child {
  margin-left: 0;
}

.swiper-slide:last-child {
  margin-right: 0;
}
</style>
