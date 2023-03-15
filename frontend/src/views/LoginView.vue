<template>
  <div class="card form login">
    <div class="flex justify-content-center">
      <div class="card">
        <div class="flex flex-column align-items-center justify-content-center">
          <img src="@/assets/logoave.svg" alt="Logo" width="100" height="100" />
          <h3 class="text-center">Login</h3>
        </div>
        <form @submit.prevent="login" class="p-fluid">
          <div class="field">
            <div class="p-float-label">
              <InputText id="name" v-model="username" />
              <label for="name">Name*</label>
            </div>
          </div>
          <div class="field">
            <div class="p-float-label p-input-icon-right">
              <i class="pi pi-envelope" />
              <InputText id="email" v-model="email" aria-describedby="email-error" />
              <label for="email">Email*</label>
            </div>
          </div>
          <div class="field">
            <div class="p-float-label">
              <Password id="password" v-model="password" toggleMask>
                <template #header>
                  <h6>Pick a password</h6>
                </template>
              </Password>
              <label for="password">Password*</label>
            </div>
          </div>
          <Button type="submit" label="Submit" class="mt-2" />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import * as API from '../helpers/api'
const router = useRouter();
const toast = useToast();
const username = ref('')
const password = ref('')
const email = ref('')
async function login() {
  if (username.value === '' || password.value === '' || email.value === '') {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill all fields', life: 3000 });
    return
  }
  const res = await API.login({ user: username.value, password: password.value, email: email.value })
  if (res.status === 200) {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Login successful', life: 3000 });
    localStorage.setItem('token', res.data.token)
    router.push('/')
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Login failed', life: 3000 });
  }

}

</script>
<style scoped lang="scss">
.login {
  border: 1px solid #ddd;
  animation-duration: 0.5s;
  animation-name: fadeInOpacity;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
  background-color: #f7f5f9;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
  max-width: 500px;
  padding: 20px;
  position: relative;
  width: 100%;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
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
  padding: 1.5rem 1.5rem 1.5rem 1.5rem;
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