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



/* Importa los componentes de Font Awesome */
import { library } from '@fortawesome/fontawesome-svg-core' //fontawesome core
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome' //font aweesome icon component

/*
* Importa algunos íconos que probablemente usaremos. ¡Puedes añadir más según necesites!
import { faHeart, faStar, faStarHalf, faCrown, faSmile, faFaceGrinHearts } from '@fortawesome/free-solid-svg-icons'

* Añade los íconos a la librería global de Font Awesome , esssto son cuando queremosss ussar inconos espécificos en lugar de cargar todos
library.add(faHeart, faStar, faStarHalf, faCrown, faSmile, faFaceGrinHearts)

*/
// Íconos regulares (far)
import { faSmile as farSmile, faClock as farClock } from '@fortawesome/free-regular-svg-icons'

// Íconos de marcas (fab)
import { faFacebookF, faFacebookSquare, faGithub ,faGoogle} from '@fortawesome/free-brands-svg-icons'

// Luego los agregas a la librería
library.add(farSmile, farClock, faFacebookF, faGithub, faGoogle, faFacebookSquare)


const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon) // ¡Ahora puedes usar <font-awesome-icon> en cualquier lugar!

app.use(createPinia())
app.use(router)
app.use(toastPlugin)
app.use(modalPlugin)
app.use(VueTippy)
app.mount('#app')