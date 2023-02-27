import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import router from './router'
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import './assets/main.css'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';
const app = createApp(App)
app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)
app.use(createPinia())
app.use(router)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Spinner', ProgressSpinner)
app.mount('#app')

