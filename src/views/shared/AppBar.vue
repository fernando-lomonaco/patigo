<template>
  <v-app-bar id="app-bar" absolute app color="transparent" flat height="48">
    <v-btn class="mr-3" icon fab small @click="setDrawer(!drawer)">
      <v-icon small color="info" v-if="drawer">chevron_left</v-icon>
      <v-icon small color="info" v-else>chevron_right</v-icon>
    </v-btn>

    <v-toolbar-title class="hidden-sm-and-down font-weight-light" v-text="$route.name" />

    <v-spacer></v-spacer>

    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-icon color="red" dark v-bind="attrs" v-on="on">mdi-heart</v-icon>
      </template>
      <span>{{ currentUser.username }}</span>
    </v-tooltip>

    <v-menu transition="fab-transition" bottom left offset-y origin="top" min-width="200px">
      <template v-slot:activator="{ on, attrs }">
        <v-list dense nav>
          <v-list-item>
            <v-list-item-avatar>
              <v-img
                src="https://randomuser.me/api/portraits/men/78.jpg"
                min-width="0"
                v-bind="attrs"
                v-on="on"
                style="cursor:pointer"
              ></v-img>
            </v-list-item-avatar>
          </v-list-item>
        </v-list>
      </template>
      <v-list dense nav>
        <div>
          <app-bar-item v-for="(n, i) in notifications" :key="`item-${i}`" :href="n.to">
            <v-list-item-title v-text="n.name" />
          </app-bar-item>
          <v-divider />
          <app-bar-item>
            <v-list-item-title @click="logOut">Sair</v-list-item-title>
          </app-bar-item>
        </div>
      </v-list>
    </v-menu>

    <!-- <v-list dense nav>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
          </v-list-item-avatar>
        </v-list-item>
    </v-list>-->
  </v-app-bar>
</template>

<script>
import { VHover, VListItem } from "vuetify/lib";

import { mapState, mapMutations } from "vuex";

export default {
  name: "AppBar",

  components: {
    AppBarItem: {
      render(h) {
        return h(VHover, {
          scopedSlots: {
            default: ({ hover }) => {
              return h(
                VListItem,
                {
                  attrs: this.$attrs,
                  class: {
                    "black--text": !hover,
                    "white--text secondary elevation-12": hover,
                  },
                  props: {
                    activeClass: "",
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                },
                this.$slots.default
              );
            },
          },
        });
      },
    },
  },

  data: () => ({
    titlePage: "",

    notifications: [
      { name: "Perfil", to: "/category" },
      { name: "Xurumb", to: "/product" },
    ],
  }),

  computed: {
    ...mapState(["drawer"]),
    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER",
    }),
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style>
</style>