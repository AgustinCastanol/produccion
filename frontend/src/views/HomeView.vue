<template>
  <section class="card">
    <div class="layout-main-container">
      <div class="layout-main" v-for="(supplier, index) in totalsupplier" :key="index">
        <div class="card-w-title">
          <h2>{{ supplier.name_supplier }}</h2>
          <p>Productos: {{ supplier.count }}</p>
          <p>Productos Front: {{ supplier.frontProductsCount }}</p>
          <Button @click="openDialog(supplier)">Faltantes</Button>
        </div>
      </div>
    </div>
    <Chart type="pie" :data="dataPie" :options="options" />
  </section>
  <Dialog v-model:visible="dialog" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '80vw' }">
  <div class="detalles_dialog">
    <li v-for=" e in dataDialog.dif" >
      <div class="card-w-title">
        <p>{{ e }}</p>
      </div>
    </li>
  </div>
    </Dialog>
</template>

<script setup>
import Button from 'primevue/button';
import { ref, onMounted } from 'vue';
import Dialog from 'primevue/dialog';
import Chart from 'primevue/chart';
import * as API from '../helpers/api.js';
const dialog = ref(false);
const dataDialog = ref({});
const totalsupplier = ref([]);
const dataSupplier = {
  labels: ['Promos', 'CDO', 'Marpico', 'Promo Opcion'],
  datasets: [
    {
      label: 'Suppliers Products',
      data: [1700, 136, 691, 481],
      fill: false,
      backgroundColor: ['#77dd77', '#64B5F6', '#fdfd96', '#fdcae1'],
      hoverBackgroundColor: ['#77dd77', '#64B5F6', '#72BB6A', '#fdcae1'],
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#495057',
      },
    },
  },
};

const dataPie = ref({
  labels: ['Promos', 'CDO', 'Marpico', 'Promo Opcion'],
  datasets: [
    {
      label: 'Suppliers Products',
      data: [1700, 136, 691, 481],
      fill: false,
      backgroundColor: ['#77dd77', '#64B5F6', '#fdfd96', '#fdcae1'],
      hoverBackgroundColor: ['#81C784', '#64B5F6', '#72BB6A', '#21BB6A'],
    },
  ],
});
const openDialog = (data)=>{
  dataDialog.value = data;
  dialog.value = true;
}
onMounted(async () => {
  const response = await API.getProveedores();
  dataPie.value.datasets.data = [
    parseInt(response.count[0].count),
    response.count[1].count,
    response.count[2].count,
    response.count[3].count,
  ];
  const aph_products = await API.home({});
  const validateCSV = await API.getvalidateCSV({});
  //quiero saber cuantos valores repetidos tiene el array
// const array = validateCSV.products_per_proveedor['marpico']

// const count = array.reduce((acc, curr) => {
//   acc[curr] = (acc[curr] || 0) + 1;
//   return acc;
// }, {});
// //ahora quiero saber cual es el total de productos repetidos en marpico
// const total = Object.values(count).reduce((acc, curr) => {
//   return acc + curr;
// }, 0);
// console.log(total);
// console.log(count)
console.log("aph_products",aph_products)
console.log("validateCSV",validateCSV)
  totalsupplier.value =
    response.count.map((supplier) => {
      let frontProductsCount = 0;
      let sku_aph = [];
      let sku_front = [];
      let dif = [];
      if (supplier.name_supplier == 'PromoOpcion') {
        frontProductsCount = validateCSV.proveedores['promoopcion'];
        sku_aph = aph_products.res.data.map(supp=>{
          if(supp.name_supplier =='PromoOpcion' ){
            return supp.referencias
          }
          return null;
        })
        //eliminar los null
        sku_aph = sku_aph.filter(x => x !== null)[0];
        
        sku_front = validateCSV.products_per_proveedor['promoopcion']
        // mostrar los productos que no aparecen en el csv pero si en el aph
        // console.log(sku_aph,"sku_aph")
        // console.log(sku_front,"sku_front")
        dif = sku_aph.filter(x => !sku_front.includes(x));
        
      }
      if (supplier.name_supplier == 'Promos') {
        frontProductsCount = validateCSV.proveedores['Promos'];
        sku_aph = aph_products.res.data.map(supp=>{
          if(supp.name_supplier =='Promos' ){
            return supp.referencias
          }
          return null;
        })
        //eliminar los null
        sku_aph = sku_aph.filter(x => x !== null)[0];
        
        sku_front = validateCSV.products_per_proveedor['Promos']
        // mostrar los productos que no aparecen en el csv pero si en el aph
        // console.log(sku_aph,"sku_aph")
        // console.log(sku_front,"sku_front")
        dif = sku_aph.filter(x => !sku_front.includes(x));
      }
      if (supplier.name_supplier == 'CDO') {
        frontProductsCount = validateCSV.proveedores['cdo'];
        sku_aph = aph_products.res.data.map(supp=>{
          if(supp.name_supplier =='CDO' ){
            return supp.referencias
          }
          return null;
        })
        //eliminar los null
        sku_aph = sku_aph.filter(x => x !== null)[0];
        
        sku_front = validateCSV.products_per_proveedor['cdo']
        // mostrar los productos que no aparecen en el csv pero si en el aph
        // console.log("validador",validateCSV.products_per_proveedor)
        // console.log(sku_aph,"sku_aph")
        // console.log(sku_front,"sku_front")
        dif = sku_aph.filter(x => !sku_front.includes(x));

      }
      if (supplier.name_supplier == 'Marpico') {
        frontProductsCount = validateCSV.proveedores['marpico'];
        sku_aph = aph_products.res.data.map(supp=>{
          if(supp.name_supplier =='Marpico' ){
            return supp.referencias
          }
          return null;
        })
        //eliminar los null
        sku_aph = sku_aph.filter(x => x !== null)[0];
        
        sku_front = validateCSV.products_per_proveedor['marpico']
        // mostrar los productos que no aparecen en el csv pero si en el aph
        // console.log("validador",validateCSV.products_per_proveedor)
        // console.log(sku_aph,"sku_aph")
        // console.log(sku_front,"sku_front")
        dif = sku_aph.filter(x => !sku_front.includes(x));
      }

      return { ...supplier, frontProductsCount,sku_aph,sku_front,dif };
    })
    console.log("total supplier",totalsupplier.value)
});


</script>

<style scoped lang="scss">
.card {
  padding: 1.5rem 1.5rem 0 1.5rem;
  color: var(--surface-900);
  margin-bottom: 0rem;
  border-radius: 1px;
  box-shadow: 1px 3px 5px rgba(0, 0, 0, .02), 0px 0px 2px rgba(0, 0, 0, .05), 0px 1px 4px rgba(0, 0, 0, .08) !important;
  background-color: #fafaf6;
  color: rgba(144, 35, 239, 0.737);
}

.card-w-title {
  padding-bottom: 2rem;
}

.layout-main-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
}

.layout-main {
  flex: 0 0 25%;
  border: 1px solid #c8c8c8;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

p {
  font-size: 1rem;
  color: #666;
}
.detalles_dialog{
  display: grid;
  grid-template-columns: 1fr 1fr;
  .images_details{
    grid-column: -1;
    grid-column-start: 1;
    grid-column-end: 3;
  }
  }
</style>
