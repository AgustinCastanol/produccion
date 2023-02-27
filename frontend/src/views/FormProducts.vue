<template>
  <div>
    <TreeTable :value="products" :expandedKeys="expandedKeys">
      <template #header>
        <div class="flex justify-content-between">
          <h3>Productos</h3>
          <div class="flex">
            <Button icon="pi pi-upload" class="p-button-rounded p-button h-1" label="Cargar CSV" @click="openModal" />
            <Button icon="pi pi-plus" class="p-button-rounded p-button h-1" label="Agregar Producto" @click="addProduct" />
          </div>
        </div>
      </template>

      <Column field="name" header="Nombre" expander></Column>
      <Column field="price" header="Precio"></Column>
      <Column field="category" header="Categoria"></Column>
      <Column field="reference" header="Referencia"></Column>
      <Column field="collection" header="Colección"></Column>
      <Column field="suplier" header="Proveedor"></Column>
      <Column field="description" header="Descripción"></Column>
      <Column field="is_published" header="Publicado"></Column>

      <Column field="actions" header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-plus" class="p-button-rounded p-button h-1" label="Agregar variante productos" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-danger h-1" label="Eliminar Producto" />
        </template>
      </Column>
    </TreeTable>
  </div>
  <Dialog class="card" v-model:visible="dialog" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '80vw' }">
    <template #header>
      <div class="flex gap-2 justify-content-between">
        <h3>Cargar CSV</h3>
        <Button label="Descargar csv de referencia" icon="pi pi-file" class="p-button-rounded p-button-info h-1" @click="download" />
      </div>
    </template>
    <FileUpload name="demo[]" url="https://primefaces.org/primevue/showcase/upload.php" accept="image/*"
      :maxFileSize="1000000" :auto="true" :chooseLabel="Choose" :uploadLabel="Upload" :cancelLabel="Cancel"
      :customUpload="true" :showUploadButton="false" :showCancelButton="false" :showClearButton="false"
      :showProgressBar="true" :showPreview="true" :previewWidth="80"
></FileUpload>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TreeTable from 'primevue/treetable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog';

import FileUpload from 'primevue/fileupload';
const products = ref([])
const expandedKeys = ref([])
const dialog = ref(false)
const addProduct = () => {
  products.value.push(  {
    key: "0",
    data: {
      name: "producto prueba",
      price: 100,
      category: "categoria prueba",
      reference: "referencia prueba",
      collection: "colección prueba",
      suplier: "proveedor prueba",
      description: "descripción prueba",
      is_published: true,
      actions: "acciones"
    }
  })
}
function openModal() {
  dialog.value = true
} 
function download(){
  var csv = "Nombre,Edad,Ciudad\nJuan,25,Madrid\nPedro,32,Barcelona\nMaría,29,Valencia";
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'datos.csv';
  hiddenElement.click();
}
</script>
