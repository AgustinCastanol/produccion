<template>
  <div>
    <DataTable :value="products" :lazy="true" responsiveLayout="scroll" :loading="loading">
      <template #header>
        <div class="flex justify-content-between">
          <h3>Productos</h3>
          <div class="flex gap-1">
            <Button icon="pi pi-upload" class="p-button-rounded p-button h-1" label="Cargar CSV" @click="openModal" />
            <Button icon="pi pi-plus" class="p-button-rounded p-button h-1 bg-green-500 border-green-500" label="Subir productos"
              @click="uploadProducts" />
          </div>
        </div>
      </template>
      <Column field="image" header="Imagen">
        <template #body="slotProps">
          <div class="flex gap-1 align-items-center justify-content-center flex-column">
            <img :src="slotProps.data.variants[0].image" alt="Imagen" width="100" height="100" />
          </div>
        </template>
      </Column>
      <Column field="nombre" header="Nombre">
      </Column>
      <Column field="price" header="Precio">
        <template #body="slotProps">
          <div>{{ slotProps.data.price == null ? 0 : slotProps.data.price }}</div>
        </template>
      </Column>
      <Column field="category_id" header="Categoria">
        <template #body="slotProps">
          <div>{{ slotProps.data.category_id== undefined ? '':slotProps.data.category_id.name }}</div>
        </template>
      </Column>
      <Column field="referencia" header="Referencia">
      </Column>
      <Column field="sku" header="Sku">
        <template #body="slotProps">
          <div>{{ slotProps.data.variants[0].sku == null ? ' - ' : slotProps.data.variants[0].sku }}</div>
        </template>
      </Column>
      <Column field="collection_id" header="Colección">
        <template #body="slotProps">
          <div>{{ slotProps.data.collection_id.name }}</div>
        </template>
      </Column>
      <Column field="proveedor" header="Proveedor">
        <template #body="slotProps">
          <div>{{ slotProps.data.proveedor.name }}</div>
        </template>
      </Column>
      <Column field="description_product" header="Descripción"></Column>
      <Column field="is_published" header="Publicado"></Column>

      <Column field="actions" header="Acciones">
        <template #body="slotProps">
          <div class="flex gap-1 align-items-center justify-content-center flex-column">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button h-1 w-full bg-purple-600 border-purple-600"
              label="Editar" @click="loadData(slotProps.data)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger h-1 w-full " label="Eliminar Producto"
              @click="deleteProduct(slotProps.index)" />
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
        <Button label="Descargar csv de referencia" icon="pi pi-file" class="p-button-rounded p-button-info h-1"
          @click="download" />
      </div>
    </template>
    <div class="contenedor">
      <div :class="disabled==true?'csv activo':'csv'">
        <FileUpload name="csv" accept=".csv" url="https://back.soyave.com/img_api/csv" :chooseLabel="Choose"
          :uploadLabel="Upload" @before-upload="procesCSV">
        </FileUpload>
      </div>
      <div v-if="disabled"  :class="disabled==true?'image_csv activo':'image_csv'" >
        <FileUpload :multiple="true" name="image" accept=".png"
          url='https://back.soyave.com/img_api/imagesArray' @before-upload="loadImages">
          <template #empty>
            <p>Arrastre y suelte las imagenes que desea enlazar</p>
          </template>
        </FileUpload>
      </div>
    </div>
  </Dialog>
  <Dialog class="card" v-model:visible="editProduct['visible']" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '80vw' }">
    <template #header>
      <div class="flex gap-2 justify-content-between">
        <h3>Editar Producto</h3>
      </div>
    </template>
    <FormProducts :product="editProduct['product']" @submit="changeProduct"></FormProducts>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable';
import TreeTable from 'primevue/treetable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import * as API from '../helpers/api.js'
import FormProducts from '../components/FormProducts.vue'
const products = ref([])
const disabled = ref(false)
const editProduct = ref({
  visible: false,
  product: {}
})
const loading = ref(false)
const dialog = ref(false)
const addProduct = () => {
  products.value.push({
    nombre: "producto prueba",
    price: 100,
    category_id: {
      name: "categoria prueba"
    },
    reference: "referencia prueba",
    collection_id: {
      name: "colección prueba"
    },
    proveedor: {
      name: "proveedor prueba"
    },
    description: "descripción prueba",
    is_published: true,
    actions: "acciones",
    variants: [{
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
async function loadImages(event) {
  event.xhr.onload = function () {
    console.log(event.xhr.response)
    let json = JSON.parse(event.xhr.response)
    const images = json.data['images']
    poblateImages(images)
  }
}
async function poblateImages(data){
  console.log(data)
  products.value.map((product)=>{
    data.map((image)=>{
      if(product.variants[0].sku==image.name){
        product.variants[0].image=image.path
      }
    })
  })
  }
async function uploadProducts(){
  if(products.value.length==0){    
    return
  }
  const res = await API.procesCsvProducts(products.value)
  console.log(res)
  products.value=[]
}

async function procesCSV(event) {
  event.xhr.onload = function () {
    console.log(event.xhr.response)
    let json = JSON.parse(event.xhr.response)
    console.log(json.data['products'])
    products.value = json.data['products']
    disabled.value = true
  }

}
async function download() {
  /*sku padre,sku hijo,nombre,descripcion corta,precio neto,precio sugerido,coleccion,categoria,subcategoria,proveedor,publicado,disponible desde,imagen,stock,localizacion del stock
MU-102,MU-102 N,aca iria el nombre,aca iria la descripcion,1555,0,precio neto,antiestres,,nombre del proveedor,si,20/03/2023,url de la imagen,200,total*/
  var csv = 'sku padre,sku hijo,nombre,descripcion corta,precio neto,precio sugerido,peso,marca,material,talla,color,medidas,coleccion,categoria,subcategoria,proveedor,publicado,disponible desde,imagen,stock,localizacion del stock\n';
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'datos.csv';
  hiddenElement.click();
}
async function changeProduct(event) {
  editProduct.value.visible = false
  }
</script>

<style scoped lang="scss">
.contenedor {
  position: relative;
  height: 500px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  /* ajusta la altura según tus necesidades */
}

.csv {
  position: absolute;
  top: 0;
  left: 15%;
  width:70%;
  background-color: #ccc;
  /* ajusta el color según tus necesidades */
  transition: all 0.5s ease;
  /* transición suave para cambiar el tamaño */
}

.image_csv {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  // background-color: #f00;
  /* ajusta el color según tus necesidades */
  opacity: 0;
  /* el segundo div se oculta al principio */
}
.activo{
  width: 50%;
}
.csv.activo{
  animation: achicar 0.5s ease forwards;
}
@keyframes achicar {
  from { width: 75%;  left: 15%; }
  to { width: 50%;  left: 0; }
}
.image_csv.activo{
  animation: aparecer 1s ease forwards;
}
@keyframes aparecer {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
