<template>
  <Toast />
  <section>
    <DataTable :value="products" responsiveLayout="scroll" :loading="loading" editMode="cell" :lazy="true"
      :rowEditor="true" :paginator="true" :rows="rows" :totalRecords="totalRows" stripedRows @page="onPageChange($event)">
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText placeholder="Buscar Producto" v-model="key_search" @change="search($event)" />
          </span>
          <Button @click="openModalOptions" aria-haspopup="true" aria-controls="overlay_panel">
            <i class="pi pi-plus px-2"></i>
            <span class="px-3">Agregar producto</span>
          </Button>
        </div>
      </template>
      <Column field="image">
        <template #body="slotProps">
          <img :src="slotProps.data.urlImage" alt="Image" width="100" height="100" />
        </template>
      </Column>
      <Column field="name_product" header="Nombre">
      </Column>
      <Column field="reference" header="Referencia">
      </Column>
      <Column field="price" header="Precio Neto">
        <template #body="slotProps">
          <span>{{ slotProps.data.price + '$' + slotProps.data.currency }}</span>
        </template>
      </Column>
      <Column field="price" header="Precio Sugerido">
        <template #body="slotProps">
          <span>{{ slotProps.data.metadata_price !== undefined && (slotProps.data.metadata_price.precioSugerido
            != undefined || slotProps.data.metadata_price.precioSugerido != null) ?
            `${slotProps.data.metadata_price.precioSugerido}$${slotProps.data.currency}` : 0 }}</span>
        </template>
      </Column>
      <Column field="name_category" header="Categoria">
        <template #body="slotProps">
          <span>{{ slotProps.data.parent == null ? slotProps.data.name_category :
            slotProps.data.name_parent_category }}</span>
        </template>
      </Column>
      <Column field="name_category" header="Subcategorias">
        <template #body="slotProps">
          <span>{{ slotProps.data.parent !== null ? slotProps.data.name_category : '-' }}</span>
        </template>
      </Column>
      <Column field="name_supplier" header="Proveedor" />
      <Column field="is_publushed" header="Publicado">
        <template #body="slotProps">
          <span>{{ slotProps.data.is_published ? 'Yes' : 'No' }}</span>
        </template>
      </Column>
      <Column field="available_on" header="Disponible desde">
        <template #body="slotProps">
          <span>{{ slotProps.data.available_on }}</span>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-rounded p-button bg-purple-600 p-mr-2"
            :disabled="isApiSupplier(slotProps.data.name_supplier !== undefined ? slotProps.data.name_supplier : 'none') == 'API'" />
          <Button icon="pi pi-eye" class="p-button-rounded p-button" @click="openModal(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </section>
  <Dialog class="card" v-model:visible="dialog['visible']" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '80vw' }">
    <section class="flex gap-2 card p-2 justify-content-around align-items-center">
      <img :src="dialog.data.product.urlImage" alt="img" width="100" height="100" class="w-4 h-full">
      <article class="card w-6 py-2">
        <h1>Nombre: {{ dialog.data.product.name_product }}</h1>
        <p>Descripción: {{ dialog.data.product.description_product ? dialog.data.product.description_product : 'no hay descripcción' }}
        </p>
        <p>Proveedor: {{ dialog.data.product.name_supplier }}</p>
        <p>Categoría: {{ dialog.data.product.name_category }}</p>
        <p>Colección: {{ dialog.data.product.name_collection }}</p>
        <p>Publicado: {{ dialog.data.product.is_published ? 'Yes' : 'No' }}</p>
        <p>Disponible: {{ dialog.data.product.available_on }}</p>
        <p>Cargado por: {{ isApiSupplier(dialog.data.product.name_supplier) }}</p>
        <p>{{ dialog.data.product.metadata }}</p>
      </article>
    </section>
    <section>
      <DataTable :value="dialog.data.variants" responsiveLayout="stack">
        <Column field="name_variant" header="Nombre" />
        <Column field="reference" header="Referencia padre">
          <template #body="slotProps">
            <span>{{ dialog.data.product.reference }}</span>
          </template>
        </Column>
        <Column field="sku" header="Sku" />
        <Column field="price" header="Precio por variante">
          <template #body="slotProps">
            <span>{{ slotProps.data.price_override + '$' + dialog.data.product.currency }}</span>
          </template>
        </Column>
        <Column field="stock" header="Stock">
          <template #body="slotProps">
            <span class="flex gap-1" v-for="stock in slotProps.data.stock">{{ `${stock.name} :
                          ${stock.quantity}` }}</span>
          </template>
        </Column>
      </DataTable>
    </section>
  </Dialog>
  <OverlayPanel ref="newProduct" appendTo="body" id="overlay_panel">
    <section class="flex flex-col gap-2">
      <Button label="Agregar producto unitario" class="p-button-rounded p-button-success" @click="openModalNewProduct" />
      <Button label="Carga masiva de productos (CSV)" class="p-button-rounded p-button-success" @click="redirect" />
    </section>
  </OverlayPanel>
  <Dialog v-model:visible="dialogNewProduct['visible']" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '80vw' }">
    <template #header>
      <h1 class="text-2xl">Agregar producto</h1>
    </template>
    <div class="form grid">
      <div class="col flex justify-content-center">
        <div class="px-2 py-1">
          <form @submit.prevent="handleSubmit" class="p-fluid grid">
            <div class="col">
              <div class="field">
                <div class="p-float-label">
                  <InputText id="name" v-model="form.name_product" />
                  <label for="name">Nombre*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <Textarea v-model="form.description" :autoResize="true" rows="5" cols="30" />
                  <label for="description">Descripcion*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <InputText id="reference" v-model="form.reference" />
                  <label for="reference">Referencia*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <Dropdown id="supplier" v-model="form.supplier" :options="dropdownForm['supplier']"
                    optionLabel="name_supplier" />
                  <label for="supplier">Proveedor*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <InputText id="canal" v-model="form.canal" />
                  <label for="canal">Canal</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <InputText id="peso" v-model="form.peso" />
                  <label for="peso">Peso*</label>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="field flex ">
                <div class="p-float-label w-4">
                  <InputText id="precio" v-model="form.price" />
                  <label for="precio">Precio*</label>
                </div>
                <div class="p-float-label w-full">
                  <Dropdown id="moneda" v-model="form.currency" :options="dropdownForm['currency']"
                    optionLabel="currency" />
                  <label for="Moneda">Moneda*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <Dropdown id="categoria" v-model="form.category" :options="dropdownForm['category']"
                    optionLabel="name_category" optionValue="id_categorias" @change="loadSubcategories" />
                  <label for="Categorias">Categorias*</label>
                </div>
              </div>
              <div class="field" v-if="categorySelected != null">
                <div class="p-float-label">
                  <Dropdown id="categoria" v-model="form.subCategory" :options="categorySelected.subCategory"
                    optionLabel="name_category" optionValue="id_categorias" />
                  <label for="Categorias">Sub Categorias*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <Dropdown id="currency" v-model="form.collection" :options="dropdownForm['collecion']"
                    optionLabel="name_collection" />
                  <label for="Colleciones">Colleciones*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <Dropdown id="publicar" v-model="form.is_published" :options="dropdownForm['is_published']"
                    optionLabel="is_published" />
                  <label for="Publicar?">Publicar?</label>
                </div>
              </div>
              <div class="field">
                <div class="p-label">
                  <label for="">Raiting</label>
                  <Rating v-model="form.raiting" :stars="5" :cancel="false" />
                </div>
              </div>
              <div class="field">
                <div class="p-label">
                  <label for="image">Subir una imagen*</label>
                  <!-- <InputText id="image" v-model="form.image" placeholder="https://example.com"/> -->
                  <Chip v-if="form.image!= null" :label="form.image.split('http://46.101.159.194/img/products/')[1]" removable @remove="removeImages('product')"/>
                  <FileUpload name="image" mode="basic" accept="image/*" url="http://localhost:48700/create_image_product"  
                  :maxFileSize="1000000" :auto="true" chooseLabel="Buscar" @before-upload="setProductImage" :disabled="disabled_image"/>
                </div>
              </div>
            </div>
            <Button type="submit" label="Submit" class="mt-2" />
          </form>
        </div>
      </div>
      <div class="col grid justify-content-center ">
        <DataTable :value="variantsForm" class="col-12 w-full h-auto" @row-dblclick="rowDblclick">
          <template #header>
            <div class="flex justify-content-between">
              <h3>Variantes</h3>
              <Button label="Agregar Variante" class=" p-button-rounded p-button-success" @click="addVariant" />
            </div>
          </template>
          <Column field="name_variant" header="Nombre">
            <template #body="slotProps">
              <div :class="bounce == slotProps.index ? 'selectedRow' : ''">
                {{ slotProps.data.name_variant }}
              </div>
            </template>
          </Column>
          <Column field="sku" header="Sku">
            <template #body="slotProps">
              <div :class="bounce == slotProps.index ? 'selectedRow' : ''">
                {{ slotProps.data.sku }}
              </div>
            </template>
          </Column>
          <Column field="price" header="Precio">
            <template #body="slotProps">
              <div :class="bounce == slotProps.index ? 'selectedRow' : ''">
                {{ slotProps.data.price }}
              </div>
            </template>
          </Column>
          <Column field="stock" header="Stock">
            <template #body="slotProps">
              <div v-if="slotProps.data.stock.leng > 1"
                :class="bounce == slotProps.index ? 'selectedRow flex gap-1' : 'flex gap-1'"
                v-for="stock in slotProps.data.stock">{{ `${stock.name} :
                                ${stock.quantity}` }}</div>
              <div :class="bounce == slotProps.index ? 'selectedRow' : ''" v-else>-</div>
            </template>
          </Column>
          <Column field="image">
            <template #body="slotProps">
              <Button class="pi pi-trash p-button-danger" @click="deleteVariant(slotProps.index)" />
            </template>
          </Column>
        </DataTable>
        <Divider />
        <div v-if="variantsForm.length > 0 && !hideVariantsFrom" class="form variants">
          <form @submit.prevent="handleSubmit" class="p-fluid grid">
            <div class="col">
              <div class="field">
                <div class="p-float-label">
                  <InputText id="name_variant" v-model="variantsForm[indexVariant].name_variant" />
                  <label for="name_variant">Nombre Variante*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <InputText id="price" v-model="variantsForm[indexVariant].price" />
                  <label for="price">Precio diferido*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <Textarea v-model="variantsForm[indexVariant].description" :autoResize="true" rows="5" cols="30" />
                  <label for="description">Descripcion Variante*</label>
                </div>
              </div>

            </div>
            <div class="col">
              <div class="field">
                <div class="flex flex-column align-items-center justify-content-center">
                  <div v-for="(stock, index) in variantsForm[indexVariant].stock" class="flex flex-wrap">
                    <InputText class="w-4" id="stock" v-model="variantsForm[indexVariant].stock[index]['quantity']" placeholder="Cantidad de stock" />
                    <Dropdown class="w-6" id="stockLocation" v-model="variantsForm[indexVariant].stock[index]['name']" placeholder="Ubicacion"
                      :options="dropdownForm['stockLocation']" optionLabel="name" />
                    <Button class="pi pi-trash w-2 p-button-danger align-self-start" @click="deleteStock(index)" />
                  </div>
                  <Button class="w-2 h-2rem" @click="addStock">+</Button>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <InputText id="sku" v-model="variantsForm[indexVariant].sku" />
                  <label for="sku">Sku*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <InputText id="peso-variante" v-model="variantsForm[indexVariant].weight" />
                  <label for="peso-variante">Peso diferido por variante*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <InputText id="brand-variante" v-model="variantsForm[indexVariant].marca" />
                  <label for="brand-variante">Marca*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-label">
                  <label for="disponible">Subir una imagen de la variante*</label>
                  <!-- <InputText id="disponible" v-model="variantsForm[indexVariant].image" /> -->
                  <Chip v-if="variantsForm[indexVariant].image" :label="variantsForm[indexVariant].image.split('http://46.101.159.194/img/variants')[1]" removable @remove="removeImages('')" />
                  <FileUpload name="image" mode="basic" accept="image/*" url="http://localhost:48700/create_image_variant_product"  
                  :maxFileSize="1000000" :auto="true" chooseLabel="Buscar" @before-upload="setVariantImage" :disabled="disabled_image_variant[indexVariant]['disabled']"/>
                </div>
              </div>
            </div>
            <Button label="Agregar" class="p-button-rounded p-button-success" @click="setVariant" />
          </form>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Divider from 'primevue/divider';
import DataTable from 'primevue/datatable'
import Toast from 'primevue/toast'
import Dropdown from 'primevue/dropdown'
import OverlayPanel from 'primevue/overlaypanel';
import Chip from 'primevue/chip';
import Column from 'primevue/column'
import * as API from '../helpers/api.js'
import { useToast } from "primevue/usetoast";
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Rating from 'primevue/rating';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import { useRouter, useRoute } from "vue-router";
const products = ref([])
const categorySelected = ref(null)
const key_search = ref('')
const indexVariant = ref(0)
const hideVariantsFrom = ref(true)
const loading = ref(false)
const bounce = ref(0)
const newProduct = ref(false)
const router = useRouter()
const variantsForm = ref([{
  name_variant: '',
  sku: '',
  price: '',
  stock: [{
    quantity: '',
    location: '',
    name: ''
  }]
}])
const dropdownForm = ref({
  category: [],
  collecion: [],
  currency: [
    { currency: 'COP' },
    { currency: 'USD' },
    { currency: 'EUR' },
  ],
  is_published: [
    { is_published: 'Si' },
    { is_published: 'No' },
  ],
  supplier: [],
  stockLocation: []

})
const disabled_image = ref(false)
const disabled_image_variant = ref([{disabled: false}])
const dialogNewProduct = ref({
  visible: false,
  data: {},
})
const totalRows = ref(0)
const rows = ref(10)
const dialog = ref({
  visible: false,
  data: {},
  loading: false
})
const form = ref({
  name_product: '',
  description: '',
  reference: '',
  price: '',
  canal: '',
  supplier: '',
  peso: '',
  currency: '',
  category: '',
  collection: '',
  is_published: '',
  raiting: '',
  subCategory: 'no-subcategory'
})
const toast = useToast()
const api_suppliers = ['promos', 'cdo', 'marpico', 'promoopcion']

async function loadSubcategories(event) {
  const id = event.value
  /*buscar el id padre en dropdown['category'] */
  const aux = dropdownForm.value['category'].filter((item) => (item.id_categorias == id && item.subCategory.length > 0))
  if (aux.length > 0) {
    categorySelected.value = aux[0]
    console.log(categorySelected.value)
    console.log(aux)

  }
}

async function setProductImage(event){
  event.xhr.onload = function () {
    console.log(event.xhr.response)
    const res = JSON.parse(event.xhr.response)
    console.log(res.data.path)
    form.value.image = res.data.path
    disabled_image.value = true
  }
}
async function setVariantImage(event){
  event.xhr.onload = function () {
    console.log(event.xhr.response)
    const res = JSON.parse(event.xhr.response)
    console.log(res.data.path)
    variantsForm.value[indexVariant.value].image = res.data.path
    disabled_image_variant.value[indexVariant.value]['disabled'] = true
  }
}
async function removeImages(type){
  if(type == 'product'){
    await API.deleteImage({path:form.value.image.split('http://46.101.159.194/img/products/')[1]})
    form.value.image = ''
    disabled_image.value = false
  }else{
    await API.deleteVariantsImage({path:variantsForm.value[indexVariant.value].image.split('http://46.101.159.194/img/variants')[1]})
    variantsForm.value[indexVariant.value].image = ''
    disabled_image_variant.value[indexVariant.value]['disabled'] = false
    
  }
}

async function openModalNewProduct() {
  dialogNewProduct.value.visible = true
  variantsForm.value = []
  const res_category = API.getCategories()
  const res_collection = API.getCollections()
  const res_supplier = API.getProveedores()
  const res_stockLocation = API.getStockLocation()
  Promise.all([res_category, res_collection, res_supplier, res_stockLocation]).then((values) => {
    console.log(values)
    dropdownForm.value['category'] = values[0].data.map((item) => item.parent == null ? item : null)
    dropdownForm.value['category'] = dropdownForm.value['category'].filter((item) => item != null)

    dropdownForm.value['category'].forEach((item) => {
      item['subCategory'] = values[0].data.map((subItem) => (item.id_categorias == subItem.parent) ? subItem : null)
      item['subCategory'] = item['subCategory'].filter((subItem) => subItem != null)

    })

    dropdownForm.value['collecion'] = values[1]
    dropdownForm.value['supplier'] = values[2].res.data
    dropdownForm.value['stockLocation'] = values[3].data

    console.log('dropdownForm', dropdownForm.value['category'])
  })
}
async function addVariant() {
  bounce.value = variantsForm.value.length
  indexVariant.value = variantsForm.value.length
  hideVariantsFrom.value = false
  variantsForm.value.push({
    name_variant: '-',
    sku: '-',
    price: '-',
    stock: [{
      quantity: '-',
      location: '-',
      name: '-'
    }]
  })
  disabled_image_variant.value.push({disabled: false})
}
async function addStock() {
  variantsForm.value[indexVariant.value].stock.push({
    quantity: '-',
    location: '-',
    name: '-'
  })
}
async function deleteStock(index) {
  variantsForm.value[indexVariant.value].stock.splice(index, 1)
}
async function deleteVariant(index) {
  variantsForm.value.splice(index, 1)
}
async function openModal(data) {
  try {
    dialog.value.loading = true
    const variants = await API.getVariants({ idProducts: data.idProducts })
    for (let i = 0; i < variants.length; i++) {
      variants[i].stock = await API.getStock({ id_variant: variants[i].id_variant })
    }
    console.log(data, "data")
    dialog.value['data'] = {
      product: data,
      variants: variants
    }
    console.log(dialog.value.data.variants,"variantes")
    dialog.value.visible = true
    dialog.value.loading = false
  } catch (e) {
    console.log(e)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al obtener los campos de variantes', life: 3000 });
    loading.value = false
  }
}
function isApiSupplier(name_supplier) {
  return api_suppliers.includes(name_supplier.toLowerCase()) ? 'API' : 'Manual'
}
function openModalOptions(event) {
  newProduct.value.toggle(event)
}

async function onPageChange(event) {
  try {
    loading.value = true
    const offset = event.first
    const limit = event.rows
    products.value = []
    console.log(offset, limit)
    await loadProducts({ offset, limit })

    loading.value = false
  } catch (e) {
    console.log(e)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al obtener los campos', life: 3000 });
    loading.value = false
  }
}
async function handleSubmit() {
  if (variantsForm.value.length < 1) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Producto sin variantes', life: 3000 });
    return;
  }
  console.log("submit", form.value)
  console.log("submit variants", variantsForm.value)
  for (let key in form.value) {
    if (form.value[key] === '') {
      toast.add({ severity: 'warn', summary: 'Warning', detail: `Complete todos los campos '${key}'`, life: 3000 });
      return;
    }
  }
  const res = await API.setProductForm({product:form.value,variants:variantsForm.value})
  if(res.data !== undefined || res.data !== null){
    toast.add({ severity: 'success', summary: 'Success', detail: 'Producto creado', life: 3000 });
    dialogNewProduct.value.visible = false
    return;
  }

  toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al crear el producto', life: 3000 });

}

async function search(data) {
  if (key_search.value !== '' && key_search.value.length > 3) {
    let res = await API.searchProduct({ search: key_search.value })
    if (res !== undefined) {
      products.value = []
      products.value = res
      products.value.map(async (item) => {
        const aux = JSON.parse(item["urlImage"])
        item.metadata_price = JSON.parse(item.metadata_price)
        if(typeof item.metadata_price == 'string'){
          item.metadata_price = JSON.parse(item.metadata_price)
        }
        item["urlImage"] = aux[0] == undefined ? item["urlImage"] : aux[0]
        if (item.parent !== null) {
          const cparent = await API.getCategory({ id: item.parent })
          item.name_parent_category = cparent.data[0].name_category
        }

      })
      totalRows.value = res.length
    } else {
      console.log(res)
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al obtener los campos', life: 3000 });
    }

  } else {
    await loadProducts({ offset: 0, limit: 10 })
  }
}

async function redirect() {
  router.push({ name: 'loadProducts' })
}
async function setVariant(event) {
  console.log(variantsForm.value)
  indexVariant.value = event.index
  bounce.value = event.index
  hideVariantsFrom.value = true
}
async function rowDblclick(event) {
  indexVariant.value = event.index
  bounce.value = event.index
  hideVariantsFrom.value = false
}
async function loadProducts({ offset, limit }) {
  try {
    const res = await API.getProducts({ offset, limit })
    if (res.data !== undefined) {
      products.value = res.data
      products.value.map(async (item) => {
        const aux = JSON.parse(item["urlImage"])
        item.metadata_price = JSON.parse(item.metadata_price)
        item["urlImage"] = aux[0] == undefined ? item["urlImage"] : aux[0]
        if (item.parent !== null) {
          const cparent = await API.getCategory({ id: item.parent })
          item.name_parent_category = cparent.data[0].name_category
        }

      })
      totalRows.value = res.totalRows
    } else {
      console.log(res)
      alert.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al obtener los campos', life: 3000 });
    }
  } catch (err) {
    console.log(err)

  }
}
onMounted(async () => {
  try {
    await loadProducts({ offset: 0, limit: 10 })
  } catch (e) {
    console.log(e)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al obtener los campos', life: 3000 });
  }
})
</script>
<style scoped lang="scss">
.variants {
  border: 1px solid #ddd;
  animation-duration: 0.5s;
  animation-name: fadeInOpacity;
  animation-fill-mode: forwards;
}

.selectedRow {
  background-color: #f5f5f5;
  animation: 1s infinite alternate;
  animation-name: bounce;
}

@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }

  100% {
    transform: translateY(0);
  }
}

.form {
  .card {
    min-width: 450px;

    form {
      margin-top: 2rem;
    }

    .field {
      margin-bottom: 1.5rem;
    }
  }

  @media screen and (max-width: 960px) {
    .card {
      width: 80%;
    }
  }
}


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
}</style>
