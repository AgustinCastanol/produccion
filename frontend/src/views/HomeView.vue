<template>
  <section class="card">
    <Chart type="line" :data="data" :options="options" />
    <Chart type="bar" :data="dataSupplier" :options="options" />
    <Chart type="pie" :data="dataPie" :options="options" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Toast from 'primevue/toast'
import Column from 'primevue/column'
import * as API from '../helpers/api.js'
import Chart from 'primevue/chart';


const data = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
  datasets: [
    {
      label: 'Productos',
      data: [0, 180, 390, 900, 1500, 1800, 2100],
      fill: false,
      backgroundColor: "#66BB6A",
      borderColor: "#66BB6A",
      tension: 0.1
    }
  ]
};
const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};
const dataSupplier= {
  labels: ['Promos', 'CDO', 'Marpico', 'Promo Opcion'],
  datasets: [
    {
      label: 'Suppliers Products',
      data: [1700,136,691,481],
      fill: false,
      backgroundColor: ["#66BB6A","#42A5F5","#72BB6A","#21BB6A"],
      hoverBackgroundColor: ["#81C784","#64B5F6","#72BB6A","#21BB6A"]
    },
  ],
  lightOptions: {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    }
  }
};
const dataPie= ref({
  labels: ['Promos', 'CDO', 'Marpico', 'Promo Opcion'],
  datasets: [
    {
      label: 'Suppliers Products',
      data: [1700,136,691,481],
      fill: false,
      backgroundColor: ["#66BB6A","#42A5F5","#72BB6A","#21BB6A"],
      hoverBackgroundColor: ["#81C784","#64B5F6","#72BB6A","#21BB6A"]
    },
  ],
  lightOptions: {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    }
  }
});

onMounted(async () => {
  const response = await API.getProveedores()
  console.log(response.count[0].count, 'response')
  dataPie.value.datasets.data = [parseInt(response.count[0].count), response.count[1].count, response.count[2].count, response.count[3].count]
})
</script>
<style scoped lang="scss">
.template .p-button.edit i {
    background-color: var(--purple-700);
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: 1px solid #ddd;
}

a {
  color: #42b983;
}

.card {
  padding: 1.5rem 1.5rem 0 1.5rem;
  color: var(--surface-900);
  margin-bottom: 0rem;
  border-radius: 1px;
  box-shadow: 1px 3px 5px rgba(0, 0, 0, .02), 0px 0px 2px rgba(0, 0, 0, .05), 0px 1px 4px rgba(0, 0, 0, .08) !important;
  background-color: #fafaf6;
  color: rgba(144, 35, 239, 0.737)
}

.card-w-title {
  padding-bottom: 2rem;
}

.layout-main-container {
  display: flex;
  flex-direction: column;
  min-height: 50vh;
  gap: 1rem;
}

.layout-main {
  flex: 1 1 auto;
}

:deep(.p-datatable) {
  border: 1px solid #c8c8c8;
  border-width: 1px 1px 0 1px;
  font-weight: 700;
}

:deep(.p-datatable .p-datatable-header) {
  border: none;
}

:deep(.p-datatable-thead) {
  border-bottom: 1px solid #c8c8c8;
}

:deep(.p-paginator) {
  margin: 0 !important;
  border: 1px solid #c8c8c8;
  border-width: 1px 1px 1px 1px;
  font-weight: 700;
}

</style>