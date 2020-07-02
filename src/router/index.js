import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    title: 'Home',
    icon: "home",
    meta: {
      visible: true
    },
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/HomeView.vue')
  },
  {
    path: '/about',
    title: 'About',
    icon: "info",
    meta: {
      visible: true
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/category',
    title: 'Categoria',
    icon: "category",
    meta: {
      visible: true
    },
    component: () => import(/* webpackChunkName: "category" */ '@/views/pages/category/CategoryView.vue')

  },
  {
    path: '/product',
    title: 'Produto',
    icon: 'add_shopping_cart',
    meta: {
      visible: true
    },
    component: () => import(/* webpackChunkName: "category" */ '@/views/pages/product/ProductView.vue')

  },
  {
    path: '/partner',
    title: 'Parceiro',
    icon: 'person_pin',
    meta: {
      visible: true
    },
    component: () => import(/* webpackChunkName: "category" */ '@/views/pages/partner/PartnerView.vue')

  },
  {
    path: '/finance',
    title: 'Financeiro',
    icon: 'attach_money',
    meta: {
      visible: false
    },
    children: [
      {
        path: 'expense',
        title: 'Despesa',
        icon: 'remove',
        meta: {
          visible: true
        }
      },
      {
        path: 'revenue',
        title: 'Receita',
        icon: 'add',
        meta: {
          visible: true
        }
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
