<template>
    <div class="masonry-container" ref="galleryContainer">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="gallery-item"
        :style="{ backgroundColor: isLoading[index] ? '#f2f2f2' : 'transparent' }"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          class="h-auto max-w-full rounded-lg shadow-lg transition-opacity duration-300 "
          :class="{ 'opacity-0': isLoading[index] }"
          @load="onImageLoad(index)"
        />
        <slot :image="image"></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import Masonry from 'masonry-layout';
  
  const props = defineProps({
    images: {
      type: Array,
      required: true,
      default: () => []
    }
  });
  
  const galleryContainer = ref(null);
  const masonryInstance = ref(null);
  const isLoading = ref(props.images.map(() => true));
  
  onMounted(() => {
    if (galleryContainer.value) {
      initializeMasonry();
    }
  });
  
  onUnmounted(() => {
    destroyMasonry();
  });
  
  const initializeMasonry = () => {
    masonryInstance.value = new Masonry(galleryContainer.value, {
      itemSelector: '.gallery-item',
      columnWidth: '.gallery-item',
      percentPosition: true,
      gutter: 16
    });
  };
  
  const destroyMasonry = () => {
    if (masonryInstance.value && masonryInstance.value.destroy) {
      masonryInstance.value.destroy();
      masonryInstance.value = null;
    }
  };
  
  const onImageLoad = (index) => {
    isLoading.value[index] = false;
    if (masonryInstance.value && masonryInstance.value.layout) {
      masonryInstance.value.layout();
    }
  };
  </script>
  
  <style scoped>
  .masonry-container {
  display: block;
  line-height: 0;
}

.gallery-item {
  display: inline-block;
  width: 100%;
  margin-bottom: 16px;
  padding-right: 16px;
  vertical-align: top;
  box-sizing: border-box;
}

@media (min-width: 600px) {
  .gallery-item {
    width: calc(50% - 8px);
  }
}

@media (min-width: 900px) {
  .gallery-item {
    width: calc(33.33% - 11px);
  }
}

.gallery-item img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; /* Añadimos la transición para la transformación */
}

.gallery-item:hover img {
  transform: scale(1.05); /* Escala la imagen al 105% al hacer hover */
}

.opacity-0 {
  opacity: 0;
}
  </style>