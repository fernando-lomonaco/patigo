import Login from "@/views/pages/LoginView";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter)

const routes = [
  {
    path: "/login",
    title: "Login",
    meta: {
      visible: false
    },
    component: Login
  },
  {
    path: "/",
    title: "Home",
    icon: "home",
    meta: {
      visible: false,
      requiresAuth: true

    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "home" */ "@/views/pages/HomeView")
  },
  {
    path: "/home",
    name: "Home",
    icon: "home",
    meta: {
      visible: true,
      requiresAuth: true
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "home" */ "@/views/pages/HomeView")
  },
  {
    path: "/user",
    component: () => import("@/views/pages/UserProfile"),
    meta: {
      visible: false,
      requiresAuth: true
    },
  },
  {
    path: "/category",
    name: "Categoria",
    icon: "category",
    meta: {
      visible: true,
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName: "category" */ "@/views/pages/category/CategoryView")

  },
  {
    path: "/product",
    name: "Produto",
    icon: "add_shopping_cart",
    meta: {
      visible: true,
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName: "product" */ "@/views/pages/product/ProductView")
  },
  {
    path: "/partner",
    name: "Parceiro",
    icon: "person_pin",
    meta: {
      visible: true,
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName: "partner" */ "@/views/pages/partner/PartnerView")
  },
  {
    path: "/finance",
    name: "Financeiro",
    icon: "attach_money",
    meta: {
      visible: false
    },
    component: () => import(/* webpackChunkName: "expense" */ "@/views/pages/finance/FinanceView"),
    children: [
      {
        path: "expense",
        name: "Despesa",
        icon: "remove",
        meta: {
          visible: true,
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName: "expense" */ "@/views/pages/finance/ExpenseView")

      },
      {
        path: "revenue",
        name: "Receita",
        icon: "add",
        meta: {
          visible: true,
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName: "revenue" */ "@/views/pages/finance/RevenueView")
      },
    ],
  },
]

export const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('user') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      let user = JSON.parse(localStorage.getItem('user'))
      if (to.matched.some(record => record.meta.is_admin)) {
        if (user.is_admin == 1) {
          next()
        }
        else {
          next({ name: 'userboard' })
        }
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('user') == null) {
      next()
    }
    else {
      next({ name: 'userboard' })
    }
  } else {
    next()
  }
})


// const publicPages = "/login";
// const authRequired = !publicPages.includes(to.path);

// const loggedIn = localStorage.getItem("user");

// // trying to access a restricted page + not logged in
// // redirect to login page
// if (authRequired && !loggedIn) {
//   next("/login");
// } else {
//   next();
// }
// })

export default router
