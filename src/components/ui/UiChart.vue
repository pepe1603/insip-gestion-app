<template>
  <div class="h-full w-full">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js (líneas, barras, etc.)
Chart.register(...registerables);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    // Ejemplo de shape para chartData:
    // {
    //   labels: ['Enero', 'Febrero', 'Marzo'],
    //   datasets: [
    //     {
    //       label: 'Ventas',
    //       backgroundColor: '#f87979',
    //       data: [40, 20, 12]
    //     }
    //   ]
    // }
  },
  chartOptions: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false, // Importante para que el gráfico ocupe el tamaño del contenedor
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      }
    }),
  },
  chartType: {
    type: String,
    default: 'bar', // 'bar', 'line', 'pie', 'doughnut', etc.
    validator: (value) => ['bar', 'line', 'pie', 'doughnut', 'polarArea', 'radar', 'bubble', 'scatter'].includes(value)
  }
});

const chartCanvas = ref(null);
let chartInstance = null;

const createChart = () => {
  if (chartCanvas.value && props.chartData) {
    // Destruye la instancia existente antes de crear una nueva
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(chartCanvas.value, {
      type: props.chartType,
      data: props.chartData,
      options: props.chartOptions
    });
  }
};

// Observar cambios en chartData o chartType para recrear el gráfico
watch([() => props.chartData, () => props.chartType], () => {
  createChart();
}, { deep: true }); // deep: true para observar cambios dentro de chartData

onMounted(() => {
  createChart();
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
/* Asegura que el canvas se ajuste al contenedor */
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>