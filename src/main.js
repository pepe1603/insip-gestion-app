import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import router from './router';
import App from './App.vue';

// plugins
import toastPlugin from './plugins/toastPlugin';
import modalPlugin from './plugins/modalPlugin';
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css'; // Importa los estilos base de Tippy

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

/* Importa los componentes de Font Awesome */
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* Importa íconos Solid (fas) - ¡AGREGA LOS QUE NECESITES! */
import {
    faHome,
    faServer,
    faBan,
    faCheckCircle,
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
    faChartBar,
    faPlusCircle,
    faSyncAlt,
    faCogs,
    faUserTie,
    faDollarSign,
    faClipboardList,
    faTimesCircle,
    faEnvelopeOpenText,
    faCalendarCheck,
    faChartLine,
    faHollyBerry,
    faInfoCircle,
    faExclamationTriangle,
    faUsersCog,
    faWifi,
} from '@fortawesome/free-solid-svg-icons';

// Íconos regulares (far)
import { faSmile as farSmile, faClock as farClock } from '@fortawesome/free-regular-svg-icons';

// Íconos de marcas (fab)
import { faFacebookF, faFacebookSquare, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { ClipboardDocumentListIcon, EnvelopeOpenIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';

// Añade todos los íconos a la librería global de Font Awesome
library.add(
    faHome,
    faBan,
    faChartPie,
    faRightFromBracket,
    faUsers,
    faWifi,
    faUser,
    faServer,
    faCheckCircle,
    faUsersCog,
    faBuilding,
    faCalendarDays,
    faTimesCircle,
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
);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon); // ¡Ahora puedes usar <font-awesome-icon> en cualquier lugar!

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // Usa el plugin de persistencia

app.use(pinia);
app.use(router);
app.use(toastPlugin);
app.use(modalPlugin);
// app.use(i18n); // ¡Esta línea fue eliminada!
app.use(VueTippy);
app.mount('#app');