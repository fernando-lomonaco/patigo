<template>
  <v-navigation-drawer v-model="drawer" bottom light app>
    <!-- :src="bg" -->
    <v-list-item>
      <v-list-item-avatar>
        <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>John Leider</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list shaped>
      <patigo-menu v-for="(route , index) in routes" :key="index" :route="route"/>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Drawer",

  components: {
    PatigoMenu: () => import("./Menu")
  },

  data: () => ({
    drawer: true
  }),

  computed: {
    routes() {
      return this.$router.options.routes;
    },
    bg() {
      return "https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg";
    }
  }
};
</script>

<style>
</style>