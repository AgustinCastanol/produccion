<template>
  <div class="form grid">
    <div class="col flex justify-content-center">
      <div class="px-2 py-1">
        <form @submit.prevent="handleSubmit" class="p-fluid grid">
          <div class="col">
            <div class="field">
              <label for="name">Nombre*</label>
              <InputText id="name" v-model="product.nombre" />
            </div>
            <div class="field">
              <label for="description">Descripcion*</label>
              <Textarea v-model="product.description_product" autoResize rows="5" cols="30" />
            </div>
            <div class="field">
              <label for="reference">Referencia*</label>
              <InputText id="reference" v-model="product.referencia" />
            </div>
            <div class="field">
              <label for="sku">Sku*</label>
              <InputText id="sku" v-model="product.variants[0].sku" />
            </div>
            <div class="field">
              <label for="supplier">Proveedor*</label>
              <Dropdown id="supplier" :placeholder="product.proveedor.name" v-model="product.proveedor.name"
                :options="options['supplier']" optionLabel="name_supplier" />
            </div>
            <div class="field">
              <label for="canal">Canal</label>
              <InputText id="canal" v-model="product.channel" />
            </div>
            <div class="field">
              <label for="peso">Peso*</label>
              <InputText id="peso" v-model="product.peso" />
            </div>
            <div class="field">
              <label for="weight_override">Peso Variante*</label>
              <InputText id="weight_override" v-model="product.variants[0].weight_override" />
            </div>
            <div class="field">
              <label for="price_override">Precio Variante*</label>
              <InputText id="price_override" v-model="product.variants[0].price_override" />
            </div>
            <div class="field">
              <label for="stock">Stock*</label>
              <div class="flex flex-wrap w-full">
                <InputText class="w-4" id="stock" v-model="product.variants[0].stock[0]['quantity']"
                  placeholder="Cantidad de stock" />
                <Dropdown :placeholder="product.variants[0].stock[0]['location']" class="w-6" id="stockLocation"
                  v-model="product.variants[0].stock[0]['location']" placeholder="Ubicacion"
                  :options="options['stockLocation']" optionLabel="name" />
              </div>
            </div>
          </div>
          <div class="col">
            <div class="field flex ">
              <div class="w-4">
                <label for="precio">Precio*</label>
                <InputText id="precio" v-model="product.price" />
              </div>
              <div class="w-full">
                <label for="Moneda">Moneda*</label>
                <Dropdown id="moneda" :placeholder="product.currency" v-model="product.currency"
                  :options="options['currency']" optionLabel="currency" />
              </div>
            </div>
            <div class="field">
              <label for="Categorias">Categorias*</label>
              <Dropdown id="categoria" :placeholder="product.category_id.name" v-model="product.category_id"
                :options="options['category']" optionLabel="name_category" optionValue="id_categorias"
                @change="loadSubcategories" />
            </div>
            <div class="field" v-if="categorySelected != null">
              <label for="Categorias">Sub Categorias*</label>
              <Dropdown id="categoria" v-model="product.subCategory" :options="categorySelected.subCategory"
                optionLabel="name_category" optionValue="id_categorias" @change="loadsubCatObj" />
            </div>
            <div class="field">
              <label for="Colleciones">Colleciones*</label>
              <Dropdown id="currency" :placeholder="product.collection_id.name" v-model="product.collection_id"
                :options="options['collecion']" optionLabel="name_collection" optionValue="slug_collection" />
            </div>
            <div class="field">
              <label for="Publicar?">Publicar?</label>
              <Dropdown id="publicar" :placeholder="product.is_published" v-model="product.is_published"
                :options="options['is_published']" optionLabel="is_published" />
            </div>
            <div class="field">
              <div class="p-label">
                <label for="">Raiting</label>
                <Rating v-model="product.raiting" :stars="5" :cancel="false" />
              </div>
            </div>
            <div class="field">
              <div class="p-label">
                <label for="color">Color</label>
                <InputText id="color" v-model="product.variants[0].metadata_variants.color" />
              </div>
            </div>
            <div class="field">
              <div class="p-label">
                <label for="talla">Talla</label>
                <InputText id="talla" v-model="product.variants[0].metadata_variants.talla" />
              </div>
            </div>
            <div class="field">
              <div class="p-label">
                <label for="material">Materiales</label>
                <InputText id="material" v-model="product.variants[0].metadata_variants.material" />
              </div>
            </div>
            <div class="field">
              <div class="p-label">
                <label for="medidas">Medidas</label>
                <InputText id="medidas" v-model="product.variants[0].metadata_variants.medidas" />
              </div>
            </div>
            <div class="field">
              <div class="p-label">
                <label for="image">Subir una imagen del producto*</label>
                <!-- <InputText id="image" v-model="form.image" placeholder="https://example.com"/> -->
                <Chip v-if="product.image != null" :label="product.image" removable @remove="removeImages('product')"
                  @click.ctrl="openLink(product.image)" />
                <FileUpload name="image" mode="basic" accept="image/*"
                  url="http://46.101.159.194:48700/create_image_product" :maxFileSize="1000000" :auto="true"
                  chooseLabel="Buscar" @before-upload="setProductImage" :disabled="disabled_image" />
              </div>
            </div>
            <div class="field">
              <div class="p-label">
                <label for="disponible">Subir una imagen de la variante*</label>
                <!-- <InputText id="disponible" v-model="variantsForm[indexVariant].image" /> -->
                <Chip v-if="product.variants[0].image" :label="product.variants[0].image" removable
                  @remove="removeImages('')" @click.ctrl="openLink(product.variants[0].image)" />
                <FileUpload name="image" mode="basic" accept="image/*"
                  url="http://46.101.159.194:48700/create_image_variant_product" :maxFileSize="1000000" :auto="true"
                  chooseLabel="Buscar" @before-upload="setVariantImage" :disabled="disabled_image_variant" />
              </div>
            </div>
          </div>
          <Button type="submit" label="Submit" class="mt-2" />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as API from '../helpers/api.js'
import { ref, onMounted, defineEmits } from 'vue'
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Chip from 'primevue/chip';
import DataTable from 'primevue/datatable';
import FileUpload from 'primevue/fileupload';
import Textarea from 'primevue/textarea';
import Rating from 'primevue/rating'; 
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})
const categoria = ref(null)
const disabled_image = ref(false)
const disabled_image_variant = ref(false)
const emit = defineEmits(['submit'])
const categorySelected = ref(null)
const options = ref({
  is_published: [
    { name: 'Si', value: true },
    { name: 'No', value: false }
  ],
  currency: [
    { currency: 'COP' },
    { currency: 'USD' }
  ],
  category: [],
  collecion: [],
  supplier: [],
})
const product = ref({
  "nombre": "prueba",
  "referencia": "MU",
  "description_product": "kdansdonasdon",
  "metadata": {
    "medidas": "0",
    "material": "0",
    "talla": "0",
    "color": "0"
  },
  "channel": "ProveedorAdministrador(back)",
  "is_published": true,
  "peso": "0",
  "category_id": {
    "id": "77b7817a-3dcf-40cd-a891-84298f43ee7c",
    "name": "Antiestrés",
    "slug": "antiestrs"
  },
  "product_class_id": null,
  "collection_id": {
    "name": "precio sugerido",
    "id": "47ac63e1-42ef-4e49-9ba1-33f1d0050e4d",
    "slug": "precio-sugerido"
  },
  "proveedor": {
    "id": "20c2cfda-b7f4-4dea-a15f-8d48cd379db8",
    "name": "ProveedorAdministrador(back)"
  },
  "price": "0",
  "currency": "COP",
  "image": "http://46.101.159.194/img/01.png",
  "variants": [
    {
      "name_variants": "prueba",
      "sku": "MU-100",
      "price_override": "0",
      "metadata_variants": {
        "color": "0",
        "talla": "0",
        "material": "0",
        "medidas": "0"
      },
      "weight_override": "0",
      "brand": "no brand",
      "image": "http://46.101.159.194/img/01.png",
      "stock": [
        {
          "location": "total",
          "quantity": "123"
        }
      ]
    }
  ]
})
async function openLink(url) {
  window.open(url, '_blank');
}
async function loadsubCatObj(event) {
  console.log(event)
  const findcategoria = categoria.value['subCategory'].filter((item) => (item.id_categorias == event.value))
  console.log(findcategoria)
  categoria.value = {
    id: findcategoria[0].id_categorias,
    name: findcategoria[0].name_category,
    slug: findcategoria[0].slug_category,
  }
}
async function loadSubcategories(event) {
  const id = event.value
  /*buscar el id padre en dropdown['category'] */
  const findCategory = options.value['category'].filter((item) => (item.id_categorias == id))
  console.log(findCategory)
  categoria.value = {
    id: findCategory[0].id_categorias,
    name: findCategory[0].name_category,
    slug: findCategory[0].slug_category,
    subCategory: findCategory[0].subCategory
  }
  const aux = options.value['category'].filter((item) => (item.id_categorias == id && item.subCategory.length > 0))
  if (aux.length > 0) {
    categorySelected.value = aux[0]
    console.log(categorySelected.value)
    console.log(aux, "aux")
  }
}
async function setProductImage(event) {
  event.xhr.onload = function () {
    console.log(event.xhr.response)
    const res = JSON.parse(event.xhr.response)
    console.log(res.data.path)
    product.value.image = res.data.path
    disabled_image.value = true
  }
}
async function setVariantImage(event) {
  event.xhr.onload = function () {
    console.log(event.xhr.response)
    const res = JSON.parse(event.xhr.response)
    console.log(res.data.path)
    product.value.variants[0].image = res.data.path
    disabled_image_variant.value = true
  }
}
async function removeImages(type) {
  if (type == 'product') {
    await API.deleteImage({ path: product.value.image.split('http://46.101.159.194/img/products/')[1] })
    product.value.image = ''
    disabled_image.value = false
  } else {
    await API.deleteVariantsImage({ path: variantsForm.value[indexVariant.value].image.split('http://46.101.159.194/img/variants')[1] })
    variantsForm.value[indexVariant.value].image = ''
    disabled_image_variant.value[indexVariant.value]['disabled'] = false

  }
}
onMounted(async () => {
  product.value = props.product
  console.log(product.value, "product")
  console.log(typeof product.value, "typeof product")
  const res_category = API.getCategories()
  const res_collection = API.getCollections()
  const res_supplier = API.getProveedores()
  const res_stockLocation = API.getStockLocation()
  Promise.all([res_category, res_collection, res_supplier, res_stockLocation]).then((values) => {
    console.log(values)
    options.value['category'] = values[0].data.map((item) => item.parent == null ? item : null)
    options.value['category'] = options.value['category'].filter((item) => item != null)

    options.value['category'].forEach((item) => {
      item['subCategory'] = values[0].data.map((subItem) => (item.id_categorias == subItem.parent) ? subItem : null)
      item['subCategory'] = item['subCategory'].filter((subItem) => subItem != null)
    })
    options.value['collecion'] = values[1]
    options.value['supplier'] = values[2].res.data
    options.value['stockLocation'] = values[3].data

  })
})
function handleSubmit() {
  console.log(product.value.proveedor)
  if (categoria.value != null) {
    product.value.category_id = {
      id: categoria.value.id_categorias,
      name: categoria.value.name,
      slug: categoria.value.slug
    }
  }
  const aux = options.value['collecion'].filter((item) => (item.slug_collection == product.value.collection_id))
  if (aux.length > 0) {
    product.value.collection_id = {
      id: aux[0].id_collection,
      name: aux[0].name_collection,
      slug: aux[0].slug_collection
    }
  }
  if(product.value.proveedor.name.id !== undefined){
    product.value.proveedor = {
      id: product.value.proveedor.name.id,
      name: product.value.proveedor.name.name_supplier,
    }
    if(product.value.variants[0].stock[0].location.name !== undefined){
      product.value.variants[0].stock[0].location = product.value.variants[0].stock[0].location.name
    }
  }

  emit('submit', product.value)
}
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
}
</style>