import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VueI18n from 'vue-i18n'
import VueMask from 'v-mask'

import pt from 'vuetify/es5/locale/pt'

Vue.use(Vuetify);
Vue.use(VueI18n);
Vue.use(VueMask);

const theme = {
    primary: '#4CAF50',
    secondary: '#9C27b0',
    accent: '#9C27b0',
    info: '#4B6FDD',
}

const messages = {
    pt: {
        $vuetify: pt,
    },
}

const i18n = new VueI18n({
    locale: 'pt',
    messages,
})

export default new Vuetify({
    lang: {
        t: (key, ...params) => i18n.t(key, params),
    },
    theme: {
        themes: {
            dark: theme,
            light: theme,
        },
    },

});
