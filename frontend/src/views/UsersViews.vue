<template>
  <Toast></Toast>
  <DataTable :value="users" stripedRows :paginator="true" :rows="rows" :totalRecords="totalRows">
    <template #header>
        <div class="flex justify-content-between align-items-center">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText placeholder="Buscar Usuario" v-model="key_search" @change="search($event)" />
          </span>
        <Button disabled="true">
                <i class="pi pi-plus px-2"></i>
                <span class="px-3">Nuevo Usuario</span>
            </Button>
      </div>
    </template>
    <Column field="logo_user" header="Image">
      <template #body="slotProps">
        <img :src="slotProps.data.logo_user" :alt="slotProps.data.user" width="100" height="100" />
      </template>
    </Column>
    <Column field="user" header="Nombre" />
    <Column field="email" header="Email" />
    <Column field="role" header="Rol" />
    <Column field="tipoDeUsuario" header="Tipo de usuario">
      <template #body="slotProps">
        <span>Administrador</span>
      </template>
    </Column>
    <Column field="date" header="Fecha de creacion">
      <template #body="slotProps">
        <span>{{ new Date().toISOString().split('T')[0] }}</span>
      </template>
    </Column>
    <Column field="action" header="Actions">
      <template #body="slotProps">
        <Button icon="pi pi-eye" class="p-button-rounded p-button bg-blue-600 p-mr-2"
          @click="openModal(slotProps.data)" />
        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteUser(slotProps.data)" />
      </template>
    </Column>
  </DataTable>
  <Dialog v-model:visible="dialog.display" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '80vw' }">
    <section>
      <DataTable :value="dialog.data" :rowEditor="true" :loading="loading" editMode="cell" :lazy="true" @cell-edit-complete="onCellEditComplete">
        <Column field="user" header="Nombre">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column field="email" header="Email">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column field="role" header="Rol">
          <template #editor="{ data, field }">
            <Dropdown v-model="data[field]" :options="['Administrador', 'Common', 'Cotizador']" />
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="slotProps">
            <span>Pago: {{ slotProps.data.status.pago }}</span>
            <span>tipoDeCuenta: {{ slotProps.data.status.tipoDeCuenta }}</span>
          </template>
        </Column>
        <Column field="tipoDeUsuario" header="Tipo de usuario">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column field="date" header="Fecha">
        </Column>
        <template #footer>
          <div class="flex justify-content-end">
            <Button class="p-button-outlined" @click="save(dialog.data)">Guardar</Button>

          </div>
        </template>
      </DataTable>
    </section>
  </Dialog>
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import * as API from '../helpers/api.js'
import { useToast } from "primevue/usetoast";
import Dropdown from 'primevue/dropdown';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import InputText from 'primevue/inputtext';
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm()
const users = ref([])
const loading = ref(false)
const totalRows = ref(0)
const rows = ref(10)
const key_search = ref('')
const dialog = ref({
  display: false,
  data: {}
})
function deleteUser(data) {
  confirm.require({
    target: data,
    message: 'Are you sure you want to delete this user?\nThis action eliminate all the data related to this user and SubUsers.',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      console.log(data)
    },
    reject: () => {
      console.log('reject')
    }
  })
}
async function onCellEditComplete(event) {
  try {
    dialog.value.data[0][event.field] = event.newValue
  } catch (e) {
    console.log(e)
  }
}
function openModal(data) {
  dialog.value.display = true
  dialog.value.data = [data]
}
async function search (event) {
  if(key_search.value.length > 3){
    const res = await API.getUsers()

    const filter = res.data.filter((user) => {
      return user.user.toLowerCase().includes(key_search.value.toLowerCase())
    })
    users.value = filter
    totalRows.value = filter.length 
  }else{
    const res = await API.getUsers()
    if (res.data !== undefined) {
      console.log(res.data.users.data)
      users.value = res.data
      totalRows.value = res.data.length
    }
  }
}
onMounted(async () => {
  try {
    const res = await API.getUsers()
    if (res.users !== undefined) {
      console.log(res.users.data,"data")
      users.value = res.users.data.admins
      totalRows.value = res.users.data.admins.length
    } else {
      console.log(res,"data")
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