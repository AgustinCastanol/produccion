<template>
  <Toast></Toast>
  <DataTable :value="crons" stripedRows :rows="rows" :totalRecords="totalRows" :paginator="true"
    :rowsPerPageOptions="[10, 20, 50]" :loading="loading" :lazy="true" @onLazyLoad="loadCronsLazy($event)">
    <template #header>
      <div class="flex justify-content-end">
        <Button @click="openModal">
          <i class="pi pi-plus px-2"></i>
          <span class="px-3">Ejecutar un Cron</span>
        </Button>
      </div>
    </template>
    <Column field="id" header="ID" />
    <Column field="name" header="Name" />
    <Column field="status" header="Status">
      <template #body="slotProps">
        <span>{{ slotProps.data.status }}</span>
      </template>
    </Column>
    <Column field="errors" header="Errors">
      <template #body="slotProps">
        <span>{{ slotProps.data.errors.length > 0 ? slotProps.data.errors[0].error : "Not Error" }}</span>
      </template>
    </Column>
    <Column field="date" header="Fecha"/>
    <Column field="action" header="Actions">
      <template #body="slotProps">
        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" />
      </template>
    </Column>
  </DataTable>
  <Dialog v-model:visible="dialog" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '400px' }">
    <template #header>
      <h5 class="text-lg font-semibold">Ejecutar un Cron</h5>
    </template>
    <section class="card grid gap-2">
      <Dropdown class="col-12" :options="options" v-model="cronExecute" optionLabel="name" optionValue="code"
        placeholder="Seleccione un cron" />
      <Button @click="runCrons" class="py-2 col-12 p-button-outlined">Ejecutar</Button>
    </section>
  </Dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Toast from 'primevue/toast'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import * as API from '../helpers/api.js'
import { useToast } from "primevue/usetoast";
const crons = ref([])
const loading = ref(false)
const totalRows = ref(0)
const rows = ref(10)
const alert = useToast();
const dialog = ref(false)
const cronExecute = ref('')
const options = [
  { name: 'Api Promos', code: 'cronsPromos' },
  { name: 'Api CDO', code: 'opt2' },
]

const openModal = () => {
  dialog.value = true
}
async function runCrons() {
  try {
    if(cronExecute.value === ''){
      alert.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un cron', life: 3000 });
      return
    }
     API.runCrons(
      { code: cronExecute.value }
    )
      alert.add({ severity: 'success', summary: 'Success', detail: 'Cron ejecutado correctamente', life: 3000 });
      dialog.value = false
  } catch (error) {
    alert.add({ severity: 'error', summary: 'Error', detail: 'Error al ejecutar el cron', life: 3000 });
    console.log(error)

  }
}

onMounted(async () => {
  try {
    const res = await API.getCrons()
    if (res.data !== undefined) {
      console.log(res.data)
      crons.value = res.data
      totalRows.value = res.data.length
    } else {
      console.log(res)
    }
  } catch (error) {
    console.log(error)
  }
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
  box-shadow: 0px 3px 5px rgba(0, 0, 0, .02), 0px 0px 2px rgba(0, 0, 0, .05), 0px 1px 4px rgba(0, 0, 0, .08) !important;

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