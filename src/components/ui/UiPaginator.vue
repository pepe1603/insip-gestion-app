<template>
    <div class="flex items-center justify-center py-4">
      <div class="flex items-center justify-between bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700" :class="wrapperClasses">
        <button
          v-if="currentPage > 1"
          @click="$emit('update:page', currentPage - 1)"
          class="flex items-center text-gray-600 hover:text-indigo-700 dark:text-gray-300 dark:hover:text-indigo-500 cursor-pointer"
        >
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-gray-600 dark:stroke-gray-300">
            <path d="M1.1665 4H12.8332" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1.1665 4L4.49984 7.33333" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1.1665 4.00002L4.49984 0.666687" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text-sm ml-2 font-medium leading-none">Anterior</span>
        </button>
        <div v-else class="flex items-center text-gray-300 dark:text-gray-600 cursor-not-allowed">
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-gray-300 dark:stroke-gray-600">
            <path d="M1.1665 4H12.8332" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1.1665 4L4.49984 7.33333" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1.1665 4.00002L4.49984 0.666687" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text-sm ml-2 font-medium leading-none">Anterior</span>
        </div>
  
        <div class="sm:flex hidden">
          <button
            v-for="page in pagesToShow"
            :key="page"
            @click="$emit('update:page', page)"
            :class="[
              'text-sm font-medium leading-none cursor-pointer pt-2 px-2',
              props.currentPage === page // <----- USA props.currentPage AQUÍ
                ? 'text-indigo-700 dark:text-indigo-500 border-t-2 border-indigo-400 dark:border-indigo-500'
                : 'text-gray-600 hover:text-indigo-700 dark:text-gray-300 dark:hover:text-indigo-500 border-t-2 border-transparent hover:border-indigo-400 dark:hover:border-indigo-500',
            ]"
          >
            {{ page }}
          </button>
        </div>
  
        <button
          v-if="currentPage < totalPages"
          @click="$emit('update:page', currentPage + 1)"
          class="flex items-center text-gray-600 hover:text-indigo-700 dark:text-gray-300 dark:hover:text-indigo-500 cursor-pointer"
        >
          <span class="text-sm mr-2 font-medium leading-none">Siguiente</span>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-gray-600 dark:stroke-gray-300">
            <path d="M1.1665 4H12.8332" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.5 7.33333L12.8333 4" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.5 0.666687L12.8333 4.00002" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <div v-else class="flex items-center text-gray-300 dark:text-gray-600 cursor-not-allowed">
          <span class="text-sm mr-2 font-medium leading-none">Siguiente</span>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-gray-300 dark:stroke-gray-600">
            <path d="M1.1665 4H12.8332" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.5 7.33333L12.8333 4" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.5 0.666687L12.8333 4.00002" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    totalItems: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    maxVisiblePages: {
      type: Number,
      default: 5,
    },
    size: {
      type: String,
      default: 'md', // 'sm', 'md', 'lg'
      validator: (value) => ['sm', 'md', 'lg'].includes(value),
    },
  });
  
  const emit = defineEmits(['update:page']);
  
  const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));
  
  const pagesToShow = computed(() => {
    const pages = [];
    const startPage = Math.max(1, props.currentPage - Math.floor(props.maxVisiblePages / 2));
    const endPage = Math.min(totalPages.value, startPage + props.maxVisiblePages - 1);
  
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  });
  
  const wrapperClasses = computed(() => {
    const sizeClasses = {
      sm: 'w-full sm:w-2/5',
      md: 'w-full sm:w-3/5 lg:w-2/5',
      lg: 'w-full lg:w-3/5 xl:w-2/5',
    };
    return sizeClasses[props.size];
  });
  </script>