<template>
  <v-app>
    <patigo-drawer />

    <patigo-app-bar />

    <v-main>
      <v-container fluid>
        <transition name="moveInUp">
          <router-view />
        </transition>
      </v-container>
    </v-main>

    <patigo-footer />
  </v-app>
</template>

<script>
// import { routes } from "./router/index";

export default {
  name: "App",

  components: {
    PatigoDrawer: () => import("./views/shared/Drawer"),
    PatigoAppBar: () => import("./views/shared/AppBar"),
    PatigoFooter: () => import("./views/shared/Footer")
  },

  // data: () => ({
  //   routes
  // })
};
</script>
<style scoped>
.moveInUp-enter-active {
  animation: fadeIn 1s ease-in;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
