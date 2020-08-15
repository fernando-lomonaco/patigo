<template>
  <v-app :id="!currentUser ? 'xpt' : ''">
    <patigo-drawer v-if="currentUser" />

    <patigo-app-bar v-if="currentUser" />

    <v-main>
      <v-container fluid>
        <transition name="moveInUp">
          <router-view />
        </transition>
      </v-container>
    </v-main>

    <patigo-footer v-if="currentUser" />
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

  computed: {
    currentUser() {
      return this.$store.state.auth.status.loggedIn;
    }
  }

  // data: () => ({
  //   routes
  // })
};
</script>
<style scoped>
#xpt {
  background-image: linear-gradient(
    to right,
    #d28df7,
    #bd7fde,
    #a871c6,
    #9363ad,
    #7e5594
  );
}
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
