// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import router from './router'
import App from './App.vue'

// Importa vue-i18n
import { createI18n } from 'vue-i18n';

// Importa tus archivos de traducción
import es from './locales/es.json';
import en from './locales/en.json';
// Importa fr.json si lo tienes también
// import fr from './locales/fr.json';

//plugins
import toastPlugin from './plugins/toastPlugin'
import modalPlugin from './plugins/modalPlugin'
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css'; // Importa los estilos base de Tippy

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

/* Importa los componentes de Font Awesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* Importa íconos Solid (fas) - ¡AGREGA LOS QUE NECESITES! */
import {
  faHome,
  faBan,
  faUsers,
  faUserGroup,
  faUser,
  faChartPie,
  faRightFromBracket,
  faBuilding,
  faCalendarDays,
  faClock,
  faCircleQuestion,
  faBriefcase,
  faChartSimple, // Cambié de faChartBar a faChartSimple que es más genérico
  faFileLines,
  faRocket,
  faGear,
  faEarthAmericas, // Para vacaciones oficiales
  faClipboardCheck, // Para reportes
  faArrowRightFromBracket, // Para cerrar sesión
  faBell, // Para notificaciones
  faChevronDown, // Para dropdowns
  faChevronLeft, // Para toggle sidebar
  faChevronRight,
  faChartBar,
  faPlusCircle,
  faSyncAlt,
  faCogs,
  faUserTie,
  faDollarSign,
  faClipboardList,
  faEnvelopeOpenText,
  faCalendarCheck,
  faChartLine,
  faHollyBerry,
  faInfoCircle,
  faExclamationTriangle,
  faUsersCog,
  faWifi, // Para toggle sidebar
} from '@fortawesome/free-solid-svg-icons'

// Íconos regulares (far)
import { faSmile as farSmile, faClock as farClock } from '@fortawesome/free-regular-svg-icons'

// Íconos de marcas (fab)
import { faFacebookF, faFacebookSquare, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons'
import { ClipboardDocumentListIcon, EnvelopeOpenIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'

// Añade todos los íconos a la librería global de Font Awesome
library.add(

  faHome,
  faBan,
  faChartPie,
  faRightFromBracket,
  faUsers,
  faWifi,
  faUser,
  faUsersCog,
  faBuilding,
  faCalendarDays,
  faCalendarCheck,
  faChartLine,
  faHollyBerry,
  InformationCircleIcon,
  ExclamationCircleIcon,
  faInfoCircle,
  faExclamationTriangle,
  faClock,
  faClipboardList,
  faEnvelopeOpenText,
  faChartBar,
  faPlusCircle,
  faSyncAlt,
  faCogs,
  faUserTie,
  EnvelopeOpenIcon,
  faDollarSign,
  ClipboardDocumentListIcon,
  faBriefcase,
  faChartSimple,
  faFileLines,
  faRocket,
  faGear,
  faEarthAmericas,
  faClipboardCheck,
  faArrowRightFromBracket,
  faBell,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  farSmile,
  farClock,
  faFacebookF,
  faGithub,
  faGoogle,
  faFacebookSquare,
  faUserGroup,
  faCircleQuestion,
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon) // ¡Ahora puedes usar <font-awesome-icon> en cualquier lugar!

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // Usa el plugin de persistencia


// Configuración de Vue I18n
const i18n = createI18n({
  legacy: false, // Usar la API de composición
  locale: 'es', // Idioma predeterminado
  fallbackLocale: 'en', // Idioma de respaldo si no se encuentra una traducción
  messages: {
    es, // tus traducciones en español
    en  // tus traducciones en inglés
    // fr, si lo tienes
  }
});


app.use(pinia)
app.use(router)
app.use(toastPlugin)
app.use(modalPlugin)
app.use(i18n) // Añade i18n a la aplicación
app.use(VueTippy)
app.mount('#app')