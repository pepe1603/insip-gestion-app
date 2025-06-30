/**main.js */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import router from './router'
import App from './App.vue'
import toastPlugin from './plugins/toastPlugin'
import modalPlugin from './plugins/modalPlugin'
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css'; // Importa los estilos base de Tippy


const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(toastPlugin)
app.use(modalPlugin)
app.use(VueTippy)
app.mount('#app')