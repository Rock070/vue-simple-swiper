<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { useEventListener, useIntersectionObserver, useScroll, useThrottleFn } from '@vueuse/core'

import type { UseScrollReturn } from '@vueuse/core'

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

export type Direction = keyof UseScrollReturn['directions']

const props = withDefaults(defineProps<SwiperProps>(), {
  items: () => [],
  perView: 3,

  width: 800,
  height: 800,
  gap: 10,

  direction: 'x',

  isPagination: true,
  isArrow: true,
})

const swiperRef = ref<HTMLElement | null>(null)
const swiperSlideRefs = ref<HTMLElement[] | null>(null)
const totalPages = computed(() => {
  if (props.items.length <= props.perView)
    return 1
  return props.items.length - props.perView + 1
})

const nowScrollDirection = ref<Direction | null>(null)
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
    nowScrollDirection.value = _direction
  },
  onStop() {
    if (!nowScrollDirection.value || !scrollEndPage.value)
      return
    if (['left', 'top'].includes(nowScrollDirection.value)) {
      onChangePagination(scrollEndPage.value)
    }
    else if (['right', 'bottom'].includes(nowScrollDirection.value)) {
      const targetPage = Math.abs(scrollEndPage.value - props.perView) + 1
      onChangePagination(targetPage)
    }

    scrollEndPage.value = null
    nowScrollDirection.value = null
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

const onIconClick = useThrottleFn(goPage, 100)

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

  if (['ArrowDown', 'ArrowRight'].includes(e.code))
    goPage('next')

  else if (['ArrowUp', 'ArrowLeft'].includes(e.code))
    goPage('previous')
}, 100))

const outerStyle = computed(() => {
  const swiperWidth = props.width
  const swiperHeight = props.height

  const ICON_WIDTH = 32
  const ICON_GAP = 8

  const width
  = (() => {
    if (props.isArrow)
      return swiperWidth + ((ICON_WIDTH + ICON_GAP) * 2)
    return swiperWidth
  })()

  const height
  = (() => {
    if (props.isPagination)
      return swiperHeight + ((ICON_WIDTH + ICON_GAP) * 2)

    return swiperHeight
  })()

  return {
    width: `${width}px`,
    height: `${height}px`,
  }
})

const swiperStyle = computed(() => {
  const totalGapPx = props.gap * (props.perView - 1)
  const slideWidth = (() => {
    if (props.direction === 'x')
      return (props.width - totalGapPx) / props.perView
    else if (props.direction === 'y')
      return props.width
  })()

  const slideHeight = (() => {
    if (props.direction === 'y')
      return (props.height - totalGapPx) / props.perView
    else if (props.direction === 'x')
      return props.height
  })()

  return {
    'width': `${props.width}px`,
    'height': `${props.height}px`,

    'flex-direction': props.direction === 'x' ? 'row' : 'column' as CSSProperties['flex-direction'],

    'gap': `${props.gap}px ${props.gap}px`,

    '--slide-height': `${slideHeight}px`,
    '--slide-margin': `${props.gap / 2}px`,
    '--slide-width': `${slideWidth}px`,
  }
})

const iconClass = computed(() => {
  return {
    'rotate-90': props.direction === 'y',
  }
})

watch(props, () => {
  setTimeout(() => {
    onChangePagination(1)
  }, 100)
})

defineExpose({
  swiperRef,
})
</script>

<template>
  <div :style="outerStyle">
    {{ pagination.current }}
    <div
      class="flex items-center gap-2"
      :style="{
        'flex-direction': props.direction === 'x' ? 'row' : 'column',
      }"
    >
      <!-- go left page -->
      <button
        v-if="isArrow"
        type="button"
        class="p-2"
        :class="iconClass"
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
        <template v-for="(item, index) in items" :key="`vue-simple-swiper${String(item)}`">
          <div
            ref="swiperSlideRefs"
            :data-index="index"
            class="swiper-slide inline-block shrink-0 grow-0 overflow-auto text-dark-500"
          >
            <slot :index="index" :item="item" />
          </div>
        </template>
      </div>

      <!-- go right page -->
      <button
        v-if="isArrow"
        type="button"
        class="p-2"
        :class="iconClass"
        @click="onIconClick('next')"
      >
        <Icon icon="material-symbols:arrow-forward-ios-rounded" />
      </button>
    </div>

    <!-- pagination -->
    <div v-if="isPagination" class="mx-auto w-full">
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
  width: var(--slide-width);
  height: var(--slide-height);
}

.swiper-slide:first-child {
  margin-left: 0;
}

.swiper-slide:last-child {
  margin-right: 0;
}
</style>
