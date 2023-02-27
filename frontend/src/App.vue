<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useRouter, useRoute } from "vue-router";
import Menubar from 'primevue/menubar';
import Toast from 'primevue/toast';
import { ref } from 'vue';
import { onMounted , watchEffect} from 'vue';
const viewNav= ref(false)
const router = useRouter()
const paths = [
  {
    label: 'Home',
    path: '/',
    icon: 'pi pi-fw pi-home',
  },
  {
    label: 'Products',
    path: '/products',
    icon: 'pi pi-fw pi-shopping-cart',
  },
  {
    label: 'Supplier',
    path: '/supplier',
    icon: 'pi pi-fw pi-user',
  },
  {
    label: 'Users',
    path: '/users',
    icon: 'pi pi-fw pi-users',
  },
  {
    label: 'Crons',
    path: '/crons',
    icon: 'pi pi-fw pi-clock',
  },
  {
    label: 'Category',
    path: '/categories',
    icon: 'pi pi-fw pi-list',
  },
]
watchEffect(() => {
  if (router.currentRoute.value.path === '/login' || localStorage.getItem('token') === null || router.currentRoute.value.name === 'error404') {
    viewNav.value = false
  } else {
    viewNav.value = true
  }
})
</script>

<template>
  <div id="app">
    <Toast></Toast>
    <header v-if="viewNav">
        <nav>
          <Menubar :model="paths" >
          <template #start>
            <img class="logo" src="@/assets/logoave.svg" alt="Logo" />
          </template>
          <template #item="{ item }">
            <RouterLink :to="item.path">
              <span class="pi pi-fw" :class="item.icon"></span>
              <span>{{ item.label }}</span>
            </RouterLink>
          </template>
          </Menubar> 
        </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 0;
}

nav a.router-link-exact-active {
  color: rgb(186, 130, 238);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  /* header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  } */

  .logo {
    margin: 0 2rem 0 0;
  }

  /* header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  } */

  /* nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  } */
}
</style>
