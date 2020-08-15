<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :src="barImage"
    mobile-breakpoint="960"
    app
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
      <v-divider class="mb-1" />
    </template>

    <v-list dense nav>
      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="require('@/assets/img-patigo.png')"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ appName }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list expand nav>
      <patigo-menu v-for="(route , index) in routes" :key="index" :route="route" />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Drawer",

  components: {
    PatigoMenu: () => import("./Menu")
  },

  props: {
    expandOnHover: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    appName: process.env.VUE_APP_TITLE
  }),

  computed: {
    ...mapState(["barColor", "barImage"]),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      }
    },
    routes() {
      return this.$router.options.routes;
    },
    currentUser() {
      return this.$store.state.auth.user;
    }
  }
};
</script>

<style lang="sass">
</style>
