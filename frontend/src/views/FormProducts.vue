<template>
  <div>
    <DataTable :value="products" :lazy="true" responsiveLayout="scroll" :loading="loading" >
      <template #header>
        <div class="flex justify-content-between">
          <h3>Productos</h3>
          <div class="flex gap-1">
            <Button icon="pi pi-upload" class="p-button-rounded p-button h-1" label="Cargar CSV" @click="openModal" />
            <Button icon="pi pi-plus" class="p-button-rounded p-button h-1" label="Agregar Producto" @click="addProduct" />
          </div>
        </div>
      </template>
      <Column field="image" header="Imagen">
        <template #body="slotProps">
          <div class="flex gap-1 align-items-center justify-content-center flex-column">
            <img :src="slotProps.data.image" alt="Imagen" width="100" height="100" />
          </div>
        </template>
      </Column>
      <Column field="nombre" header="Nombre">
      </Column>
      <Column field="price" header="Precio">
        <template #body="slotProps">
          <div>{{ slotProps.data.price == null?0:slotProps.data.price }}</div>
        </template>
      </Column>
      <Column field="category_id" header="Categoria">
        <template #body="slotProps">
          <div>{{ slotProps.data.category_id.name}}</div>
        </template>
      </Column>
      <Column field="referencia" header="Referencia">
      </Column>
      <Column field="sku" header="Sku">
        <template #body="slotProps">
          <div>{{ slotProps.data.variants[0].sku == null?' - ':slotProps.data.variants[0].sku }}</div>
        </template>
      </Column>
      <Column field="collection_id" header="Colección">
        <template #body="slotProps">
          <div>{{ slotProps.data.collection_id.name}}</div>
        </template>
      </Column>
      <Column field="proveedor" header="Proveedor">
        <template #body="slotProps">
          <div>{{ slotProps.data.proveedor.name}}</div>
        </template>
      </Column>
      <Column field="description_product" header="Descripción"></Column>
      <Column field="is_published" header="Publicado"></Column>

      <Column field="actions" header="Acciones">
        <template #body="slotProps">
        <div class="flex gap-1 align-items-center justify-content-center flex-column">
          <Button icon="pi pi-pencil" class="p-button-rounded p-button h-1 w-full bg-purple-600 border-purple-600" label="Editar" @click="loadData(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-danger h-1 w-full " label="Eliminar Producto" @click="deleteProduct(slotProps.index)" />
        </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <Dialog class="card" v-model:visible="dialog" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '80vw' }">
    <template #header>
      <div class="flex gap-2 justify-content-between">
        <h3>Cargar CSV</h3>
        <Button label="Descargar csv de referencia" icon="pi pi-file" class="p-button-rounded p-button-info h-1" @click="download" />
      </div>
    </template>
    <FileUpload name="csv" accept=".csv" url="http://localhost:48700/csv" 
    :chooseLabel="Choose" :uploadLabel="Upload" @before-upload="procesCSV"
      >
    </FileUpload>
  </Dialog>
  <Dialog class="card" v-model:visible="editProduct['visible']" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '80vw' }">
    <template #header>
      <div class="flex gap-2 justify-content-between">
        <h3>Editar Producto</h3>
      </div>
    </template>
    <FormProducts :product="editProduct['product']" ></FormProducts>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable';
import TreeTable from 'primevue/treetable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import FormProducts from '../components/FormProducts.vue'
const products = ref([])
const expandedKeys = ref([])
const editProduct = ref({
  visible: false,
  product: {}
})
const loading = ref(false)
const dialog = ref(false)
const addProduct = () => {
  products.value.push(  {
      nombre: "producto prueba",
      price: 100,
      category_id: {
        name: "categoria prueba"
      },
      reference: "referencia prueba",
      collection_id:{
        name: "colección prueba"
      },
      proveedor: {
        name: "proveedor prueba"
      },
      description: "descripción prueba",
      is_published: true,
      actions: "acciones",
      variants:[{
        sku: "sku prueba"
      }]
  })
}
function openModal() {
  dialog.value = true
} 
function deleteProduct(index) {
  products.value.splice(index, 1)
}
async function loadData(product) {
  editProduct.value.visible = true
  editProduct.value.product = product
  console.log(editProduct.value.product)
}
async function procesCSV(event) {
   event.xhr.onload =function () {
    // console.log(event.xhr.response)
    let json = JSON.parse(event.xhr.response)
    console.log(json.data['products'])
    products.value=json.data['products']
  }
}
async function download(){
  /*sku padre,sku hijo,nombre,descripcion corta,precio neto,precio sugerido,coleccion,categoria,subcategoria,proveedor,publicado,disponible desde,imagen,stock,localizacion del stock
MU-102,MU-102 N,aca iria el nombre,aca iria la descripcion,1555,0,precio neto,antiestres,,nombre del proveedor,si,20/03/2023,url de la imagen,200,total*/
  var csv = 'sku padre,sku hijo,nombre,descripcion corta,precio neto,precio sugerido,peso,marca,material,talla,color,medidas,coleccion,categoria,subcategoria,proveedor,publicado,disponible desde,imagen,stock,localizacion del stock\n';
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'datos.csv';
  hiddenElement.click();
}
</script>
