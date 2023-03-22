<template>
      <div class="col flex justify-content-center">
        <div class="px-2 py-1">
          <form @submit.prevent="handleSubmit" class="p-fluid grid">
            <div class="col">
              <div class="field">
                <div class="p-float-label">
                  <InputText id="name" v-model="product.nombre" />
                  <label for="name">Nombre*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <Textarea v-model="product.description_product" :autoResize="true" rows="5" cols="30" />
                  <label for="description">Descripcion*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <InputText id="reference" v-model="product.reference" />
                  <label for="reference">Referencia*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <Dropdown id="supplier" v-model="product.supplier" :options="options['supplier']"
                    optionLabel="name_supplier" />
                  <label for="supplier">Proveedor*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <InputText id="canal" v-model="product.channel" />
                  <label for="canal">Canal</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <InputText id="peso" v-model="product.peso" />
                  <label for="peso">Peso*</label>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="field flex ">
                <div class="p-float-label w-4">
                  <InputText id="precio" v-model="product.price" />
                  <label for="precio">Precio*</label>
                </div>
                <div class="p-float-label w-full">
                  <Dropdown id="moneda" v-model="product.currency" :options="options['currency']"
                    optionLabel="currency" />
                  <label for="Moneda">Moneda*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <Dropdown id="categoria" v-model="product.category_id" :options="options['category']"
                    optionLabel="name_category" optionValue="id_categorias" @change="loadSubcategories" />
                  <label for="Categorias">Categorias*</label>
                </div>
              </div>
              <!-- <div class="field" v-if="categorySelected != null">
                <div class="p-float-label">
                  <Dropdown id="categoria" v-model="product.subCategory" :options="categorySelected.subCategory"
                    optionLabel="name_category" optionValue="id_categorias" />
                  <label for="Categorias">Sub Categorias*</label>
                </div>
              </div> -->
              <div class="field">
                <div class="p-float-label">
                  <Dropdown id="currency" v-model="product.collection_id" :options="options['collecion']"
                    optionLabel="name_collection" />
                  <label for="Colleciones">Colleciones*</label>
                </div>
              </div>
              <div class="field">
                <div class="p-float-label">
                  <Dropdown id="publicar" v-model="product.is_published" :options="options['is_published']"
                    optionLabel="is_published" />
                  <label for="Publicar?">Publicar?</label>
                </div>
              </div>
              <div class="field">
                <div class="p-label">
                  <label for="">Raiting</label>
                  <Rating v-model="product.raiting" :stars="5" :cancel="false" />
                </div>
              </div>
              <div class="field">
                <div class="p-label">
                  <label for="image">Subir una imagen*</label>
                  <!-- <InputText id="image" v-model="form.image" placeholder="https://example.com"/> -->
                  <Chip v-if="product.image!= null" :label="product.image" removable @remove="removeImages('product')" @click.ctrl="openLink(product.image)"/>
                  <FileUpload name="image" mode="basic" accept="image/*" url="http://46.101.159.194:48700/create_image_product"  
                  :maxFileSize="1000000" :auto="true" chooseLabel="Buscar" @before-upload="setProductImage" :disabled="disabled_image"/>
                </div>
              </div>
            </div>
            <Button type="submit" label="Submit" class="mt-2" />
          </form>
        </div>
      </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Chip from 'primevue/chip';
import DataTable from 'primevue/datatable';
import FileUpload from 'primevue/fileupload';
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})
const options = {
  is_published: [
    { name: 'Si', value: true },
    { name: 'No', value: false }
  ]
}
const product = ref([{
  nombre: "prueba",
  referencia: "MU",
  description_product: "kdansdonasdon",
  metadata: {
    medidas: "0",
    material: "0",
    talla: "0",
    color: "0"
  },
  channel: "ProveedorAdministrador(back)",
  is_published: true,
  peso: "0",
  category_id: {
    id: "77b7817a-3dcf-40cd-a891-84298f43ee7c",
    name: "Antiestrés",
    slug: "antiestrs"
  },
  product_class_id: null,
  collection_id: {
    name: "precio sugerido",
    id: "47ac63e1-42ef-4e49-9ba1-33f1d0050e4d",
    slug: "precio-sugerido"
  },
  proveedor: {
    id: "20c2cfda-b7f4-4dea-a15f-8d48cd379db8",
    name: "ProveedorAdministrador(back)"
  },
  price: "0",
  image: "http://46.101.159.194/img/01.png",
  variants: [
    {
      name_variants: "prueba",
      sku: "MU-100",
      price_override: "0",
      metadata_variants: {
        color: "0",
        talla: "0",
        material: "0",
        medidas: "0"
      },
      weight_override: "0",
      brand: "no brand",
      image: "http://46.101.159.194/img/01.png",
      stock: [
        {
          location: "total",
          quantity: "123"
        }
      ]
    }
  ]
}
])
onMounted(() => {
  product.value = props.product
  console.log(product.value,"product")
  console.log(typeof product.value,"typeof product")
})
</script>