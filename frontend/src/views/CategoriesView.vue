<template>
 <Toast/>
 <DataTable :value="categories" stipedRows editMode="cell" :rowEditor="true" :paginator="true" :rows="rows"
    :totalRecords="totalRows">
    <template #header>
      <div class="flex justify-content-end">
        <Button @click="createNewCategoryModal">
                <i class="pi pi-plus px-2"></i>
                <span class="px-3">Nueva Categoria</span>
            </Button>
      </div>
    </template>
    <Column field="name_category" header="Nombre" />
    <Column field="slug_category" header="slug" />
    <Column field="metadata_category" header="Descripcion">
      <template #body="slotProps">
        <span>{{ slotProps.data.metadata_category ? slotProps.data.metadata_category : "-" }}</span>
      </template>
    </Column>
    <Column field="parent" header="Es una subcategoria?">
      <template #body="slotProps">
        <span>{{ slotProps.data.parent ? 'Si' : 'No' }}</span>
      </template>
    </Column>
    <Column field="action" header="Actions">
      <template #body="slotProps">
        <Button icon="pi pi-pencil" class="p-button-rounded p-button bg-purple-600 p-mr-2"
          @click="openModal(slotProps.data)" />
        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteCategory(slotProps.data)" />
      </template>
    </Column>
  </DataTable>
  <ConfirmDialog />
  <Dialog v-model:visible="dialog['display']" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '80vw' }">
    <section>
      <DataTable :value="dialog.data" :rowEditor="true" :loading="loading" editMode="cell" 
        @cell-edit-complete="onCellEditComplete">
        <Column field="name_category" header="Nombre">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus :placeholder="data[field]" />
          </template>
        </Column>
        <Column field="slug_category" header="Slug">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus :placeholder="data[field]" />
          </template>
        </Column>
        <Column field="metadata_category" header="Descripcion">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
          </template>
        </Column>
      </DataTable>
    </section>
    <template #footer>
      <div class="flex justify-content-end">
        <Button class="p-button-outlined" @click="save(dialog.data)">Guardar</Button>
      </div>
    </template>
  </Dialog>
  <Dialog v-model:visible="dialogNew['display']" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '80vw' }">
    <section>
      <DataTable :value="dialogNew.data" :rowEditor="true" :loading="loading" editMode="cell" 
        @cell-edit-complete="onCellEditCompleteNew">
        <Column field="name_category" header="Nombre">
          <template #editor="{ data, field }">
            <InputText class="border-300" v-model="data[field]" autofocus placeholder="Ingrese un nombre"/>
          </template>
        </Column>
        <Column field="slug_category" header="Slug">
        </Column>
        <Column field="parent" header="Padre">
          <template #body>
            <Dropdown v-model="dropdown" :options="categoriesParent" optionLabel="name_category" option-value="id" />
          </template>
        </Column>
        <Column field="metadata_category" header="Descripcion">
          <template #editor="{ data, field }">
            <Textarea autoResize="true" v-model="data[field]" autofocus placeholder="Ingrese una descripcion breve"/>
          </template>
        </Column>
      </DataTable>
    </section>
    <template #footer>
      <div class="flex justify-content-end">
        <Button class="p-button-outlined" @click="createNewCategory(dialogNew.data[0])">Guardar</Button>
      </div>
    </template>
  </Dialog>
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
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm()
const categories = ref([])
const categoriesParent = ref([])
const alerta = useToast()
const dropdown = ref(null)
const loading = ref(false)
const totalRows = ref(0)
const rows = ref(20)
const dialogNew = ref({
  display: false,
  data: {}
})
const dialog = ref({
  display: false,
  data: {}
})
function deleteCategory(data) {
  confirm.require({
    target: data,
    message: 'Are you sure you want to delete this category?\nThis action eliminate all the data related to this category and products',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      console.log(data)
    },
    reject: () => {
      console.log('reject')
    }
  })
}
async function createNewCategory({name_category, metadata_category, slug_category}) {
  try{
    if(!name_category|| name_category=='-' || !metadata_category || !slug_category){
      alerta.add({severity:'error', summary: 'Error', detail: 'Debe llenar todos los campos', life: 3000});
      return
    }
    const res = await API.createCategory({name_category, metadata_category, slug_category,parent:dropdown.value})
    if(res.data == undefined){
      alerta.add({severity:'error', summary: 'Error', detail: 'Error al crear la categoria', life: 3000});
      return
    }
    alerta.add({severity:'success', summary: 'Success', detail: 'Categoria creada', life: 3000});
    dialogNew.value['display'] = false
    dropdown.value = null
    reload()
    
  }catch(e){
    console.log(e)
    alerta.add({severity:'error', summary: 'Error', detail: 'Error al crear la categoria', life: 3000});
  }
}
function reload() {
  loading.value = true
  API.getCategories().then((response) => {
    categories.value = response.data
    loading.value = false
  })
}
function createNewCategoryModal() {
  dialogNew.value['display'] = true
  categoriesParent.value = [{
    id: 0,
    name_category: 'Sin padre'
  }]
  dialogNew.value['data'] = [{
    name_category: '-',
    slug_category: '-',
    metadata_category: '-',
    parent:'Sin padre'
  }]
  categories.value.map((category) => {
    categoriesParent.value.push({
      id: category.id_categorias,
      name_category: category.name_category
    })
  })

}
function openModal(data) {
  dialog.value['display'] = true
  dialog.value['data'] = [data]
  console.log(data)
}
async function save(data) {
  try{
    const res = await API.updateCategory(data[0])
    if(res.data == undefined){
      alerta.add({severity:'error', summary: 'Error', detail: 'Error al actualizar la categoria', life: 3000});
      return
    }
    alerta.add({severity:'success', summary: 'Success', detail: 'Categoria actualizada', life: 3000});
    dialog.value['display'] = false
    reload()
  }
  catch(e){
    console.log(e)
    alerta.add({severity:'error', summary: 'Error', detail: 'Error al actualizar la categoria', life: 3000});
}
}
async function onCellEditComplete(event) {
  try {
    dialog.value.data[0][event.field] = event.newValue
  } catch (e) {
    console.log(e)
  }
}
async function onCellEditCompleteNew(event) {
  try {
    dialogNew.value.data[0][event.field] = event.newValue
    if(event.field==='parent'){
      console.log(event.newValue)
    }
    if(event.field==='name_category'){
      dialogNew.value.data[0]['slug_category'] = event.newValue.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, '');
    }
  } catch (e) {
    console.log(e)
  }
}
onMounted(async () => {
  try {
    const res = await API.getCategories()
    if (res.data !== undefined) {
      console.log(res.data)
      categories.value = res.data
      totalRows.value = res.totalRows
    } else {
      console.log(res)
      useToast().add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al obtener los campos', life: 3000 });
    }
  } catch (e) {
    console.log(e)
    useToast().add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al obtener los campos', life: 3000 });
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