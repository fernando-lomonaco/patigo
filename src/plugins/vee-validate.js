import Vue from 'vue'
import {
  extend,
  localize,
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate'
import ptBr from 'vee-validate/dist/locale/pt_BR.json';
import {
  email,
  max,
  min,
  numeric,
  required,
} from 'vee-validate/dist/rules'

extend('email', email)
extend('max', max)
extend('min', min)
extend('numeric', numeric)
extend('required', required)

localize("ptBr", ptBr);

// Install VeeValidate components globally
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider)