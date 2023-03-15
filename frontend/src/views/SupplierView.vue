<template>
  <Toast></Toast>
  <DataTable responsiveLayout="scroll" :value="suppliers" stipedRows editMode="cell" :rowEditor="true" :paginator="true"
    :rows="rows" :totalRecords="totalRows">
    <template #header>
      <div class="flex justify-content-end">
        <Button @click="openModalCreate">
          <i class="pi pi-plus px-2"></i>
          <span class="px-3">Agregar proveedor</span>
        </Button>
      </div>
    </template>
    <Column field="name_supplier" header="Nombre">
    </Column>
    <Column field="description_supplier" header="Descripcion">
    </Column>
    <Column field="count" header="Cantidad de productos" />
    <Column header="Obtencion de los datos">
      <template #body="slotProps">
        {{ isApiSupplier(slotProps.data.name_supplier) }}
      </template>
    </Column>
    <Column field="action" header="Actions">
      <template #body="slotProps">
        <Button icon="pi pi-pencil" class="p-button-rounded p-button bg-purple-600 p-mr-2"
          @click="openModal(slotProps.data)" />
        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" :disabled="true"
          @click="deleteSupplier(slotProps.data)" />
          <Button icon="pi pi-eye" class="p-button-rounded p-button" @click="openModalDetails(slotProps.data)" />

      </template>
    </Column>
  </DataTable>
  <Dialog v-model:visible="dialog['display']" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '80vw' }">
    <template #header>
      <h5 class="text-lg font-semibold">Edit Supplier</h5>
    </template>
    <section>
      <DataTable :value="dialog.data" :rowEditor="true" :loading="loading" editMode="cell" :lazy="true"
        @cell-edit-complete="onCellEditComplete">
        <Column field="id" header="ID" />
        <Column field="name_supplier" header="Nombre">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus :placeholder="data[field]" />
          </template>
        </Column>
        <Column field="metadata_supplier" header="Data Extra">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column field="description_supplier" header="Descripcion">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
          </template>
        </Column>
        <template #footer>
          <div class="flex justify-content-end">
            <Button class="p-button-outlined" @click="save(dialog.data)">Guardar</Button>
          </div>
        </template>
      </DataTable>
    </section>
  </Dialog>
  <Dialog v-model:visible="dialogCreacion['display']" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '80vw' }">
    <template #header>
      <h5 class="text-lg font-semibold">Create Supplier</h5>
    </template>
    <div class="form flex justify-content-center align-content-center pt-3">
        <form class="p-fluid grid gap-3">
        <div class="field pl-1">
        <div class="p-float-label">
          <InputText v-model="dialogCreacion.data.name_supplier" placeholder="Nombre del proveedor" />
          <label for="name">Nombre del proveedor*</label>
        </div>
      </div>
      <div class="field pl-1">
        <div class="p-float-label">
          <InputText v-model="dialogCreacion.data.description_supplier" placeholder="Descripcion corta del proveedor" />

          <label for="name">Descripcion del proveedor*</label>
        </div>
      </div>
    </form>
    </div>
    <template #footer>
      <div class="flex justify-content-end">
        <Button class="p-button-outlined" @click="setSupplier(dialogCreacion.data)">Guardar</Button>
      </div>
    </template>
  </Dialog>
  <Dialog v-model:visible="dialogDetails['display']" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '80vw' }">
    <template #header>
      <h5 class="text-lg font-semibold">Data Supplier</h5>
    </template>
    <section class="detalles_dialog">
      <!-- datos a mostrar en un grid: logo, nombre/razon social, tipo de identificacion, numero de identificacion, contacto comercial, correo electronico, direccion, ciudad ,telefono -->
      <div class="images_details">
        <img :src="dialogDetails.data.logo" alt="logo" width="100"  class="">
      </div>
      <div>
        <p class="text-lg font-semibold">Nombre</p>
        <p>{{ dialogDetails.data.name_supplier+''+dialogDetails.data.razonSocial}}</p>
      </div>
      <div v-if="dialogDetails.data.type_identification!= undefined">
        <p class="text-lg font-semibold">Tipo de identificacion</p>
        <p>CC:{{ dialogDetails.data.type_identification.cc?dialogDetails.data.type_identification.cc:' NULL'  }}</p>
        <p>NIT:{{ dialogDetails.data.type_identification.nit?dialogDetails.data.type_identification.nit:' NULL' }}</p>
      </div>
      <div>
        <p class="text-lg font-semibold">Numero de identificacion</p>
        <p>{{ dialogDetails.data.number_identification }}</p>
      </div>
      <div>
        <p class="text-lg font-semibold">Contacto comercial</p>
        <p>{{ dialogDetails.data.contact_commercial }}</p>
      </div>
      <div>
        <p class="text-lg font-semibold">Correo electronico</p>
        <p>{{ dialogDetails.data.email }}</p>
      </div>
      <div>
        <p class="text-lg font-semibold">Direccion</p>
        <p>{{ dialogDetails.data.address }}</p>
      </div>
      <div>
        <p class="text-lg font-semibold">Ciudad</p>
        <p>{{ dialogDetails.data.city }}</p>
      </div>
      <div>
        <p class="text-lg font-semibold">Telefono</p>
        <p>{{ dialogDetails.data.phone }}</p>
      </div>
      <div class="categories">
        <p class=" descripcion text-lg font-semibold">Categorias</p>
        <p class="item_categories" v-for="e in dialogDetails.data.categories">
        {{ e.name_category }}</p>
      </div>
    </section>
  </Dialog>
  <ConfirmDialog>
  </ConfirmDialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import * as API from '../helpers/api.js'
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import InputText from 'primevue/inputtext';
import { useConfirm } from "primevue/useconfirm";
const suppliers = ref([])
const loading = ref(false)
const totalRows = ref(0)
const alert = useToast()
const rows = ref(20)
const confirm = useConfirm()
const dialogCreacion = ref({
  display: false,
  data: {}
})
const dialog = ref({
  display: false,
  data: {}
})
const dialogDetails = ref({
  display: false,
  data: {}
})
const api_suppliers = ['promos', 'cdo', 'marpico','promoopcion']

const openModalCreate = () => {
  dialogCreacion.value['display'] = true
  console.log(dialogCreacion.value, 'dialogCreacion')

}
 const openModalDetails = async (data) => {
  dialogDetails.value['display'] = true
  const categories = await API.getProveedor({id_supplier:data.id})
  if(data.name_supplier == 'Promos'){
    console.log('es promos')
    const res = await API.getCategories()
    console.log(res,'res')
    let categorias_auxiliares = res.data.map((item)=>item.parent==null?item:null)
    categorias_auxiliares = categorias_auxiliares.filter((item)=>item!=null)
    dialogDetails.value['data'] = {...data.metadata_supplier,name_supplier:data.name_supplier,categories:categorias_auxiliares}
    return ;
  }
  dialogDetails.value['data'] = {...data.metadata_supplier,name_supplier:data.name_supplier,categories}
  console.log("data",data)
  console.log(dialogDetails.value['data'], 'dialogDetails')

}
function isApiSupplier(name_supplier) {
  return api_suppliers.includes(name_supplier.toLowerCase()) ? 'API' : 'Manual'
}

function deleteSupplier(data) {
  confirm.require({
    target: data,
    message: 'Are you sure you want to delete this supplier?\nThis action eliminate all the data related to this supplier and products',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      console.log(data)
    },
    reject: () => {
      console.log('reject')
    }
  })
}
function openModal(data) {
  dialog.value['display'] = true
  dialog.value['data'] = [data]
  console.log(data)
}
async function setSupplier(data){
  try{
    console.log(data)
    const res = await API.setSupplier({
      name: data.name_supplier, 
      description_supplier: data.description_supplier, 
      metadata_supplier: null
  })
    console.log(res)
    if (res === undefined) {
      alert.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al crear el proveedor', life: 3000 });
      return
    }
    dialogCreacion.value['display'] = false
    alert.add({ severity: 'success', summary: 'Success', detail: 'Proveedor creado', life: 3000 });
  }catch(err){
    console.log(err)
    alert.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al crear el proveedor', life: 3000 });
  }
}
async function save(data) {
  try {
    console.log(data[0])
    let res = await API.updateSupplier({ id: data[0].id, name_supplier: data[0].name_supplier, description_supplier: data[0].description_supplier, metadata_supplier: data[0].metadata_supplier })
    console.log(res)
    if (res.data === undefined) {
      alert.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al actualizar el proveedor', life: 3000 });
      return
    }
    dialog.value['display'] = false
    alert.add({ severity: 'success', summary: 'Success', detail: 'Proveedor actualizado', life: 3000 });
  } catch (e) {
    alert.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al actualizar el proveedor', life: 3000 });
    console.log(e)
  }

}
async function onCellEditComplete(event) {
  try {
    dialog.value.data[0][event.field] = event.newValue
  } catch (e) {
    console.log(e)
  }
}
onMounted(async () => {
  try {
    const res = await API.getProveedores()
    console.log(res)
    if (res.res.data !== undefined) {
      console.log(res.data)
      suppliers.value = res.res.data
      suppliers.value.map(e => {
        const index = res.count.findIndex(el => el.name_supplier === e.name_supplier)
        if (index !== -1) {
          e.count = res.count[index].count
        }
        console.log(e.metadata_supplier)
        e.metadata_supplier = JSON.parse(e.metadata_supplier)
      })
      totalRows.value = res.totalRows
      console.log(suppliers.value)
    } else {
      console.log(res)
      alert.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al obtener los campos', life: 3000 });
    }
  } catch (e) {
    console.log(e)
    alert.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al obtener los campos', life: 3000 });
  }
})
</script>
<style scoped lang="scss">
.template .p-button.edit i {
  background-color: var(--purple-700);
}
.detalles_dialog{
  display: grid;
  grid-template-columns: 1fr 1fr;
  .images_details{
    grid-column: -1;
    grid-column-start: 1;
    grid-column-end: 3;
  }
  .categories{
    padding-top:3rem ;
    grid-column: -1;
    grid-column-start: 1;
    grid-column-end: 3;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    .descripcion{
      grid-column: 1/5;
      grid-column-start: 1;
    }
    .item_categories{
     padding: 1rem;
    //  borde delgado color gris
     border: 1px solid #e0e0e0;
     border-radius: 5px;
     margin: 1rem;
     display: flex;
     flex-direction: column;
     justify-content: space-between;
     .title{
       font-weight: 600;
       font-size: 1.2rem;
     }
     .description{
       font-size: 1rem;
       color: #757575;
     }
    }
  }
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