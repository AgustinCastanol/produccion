<template>
  <div class="error404">
    <Card>
      <template #header>
        <img src="https://http.cat/404" alt="" height="500">
      </template>
      <template #title>
        Error Pagina no encontrada
    </template>
    <template #content>
      <p>
      La pagina a la que quieres acceder no esta disponible o no existe.
      </p>
    </template>
    <template #footer>
    <p>
      Seras redireccionado a la pagina principal en breves.
    </p>
    </template>
    </Card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import Card from 'primevue/card';
const router = useRouter();
onMounted(() => {
  setTimeout(() => {
    router.push('/')
  }, 3000)
})
</script>
<style scoped lang="scss">
.error404 {
  display: flex;
  justify-content: center;
  align-self: center;
  vertical-align: middle;
  height: 100%;
  overflow: hidden;
}
img{
  transform: scale(1.56) translateY(9%);

}
:deep(.p-card-header){
  overflow: hidden;
}
</style>