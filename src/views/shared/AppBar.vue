<template>
  <v-app-bar color="deep-purple accent-1" dense dark app>
    <v-app-bar-nav-icon @click="drawer =! drawer"></v-app-bar-nav-icon>

    <v-toolbar-title>{{ appTitle }}</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-subheader>AÇÕES</v-subheader>
        <v-divider />
        <v-list-item-group v-model="item" color="primary">
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",

  data: () => ({
    appTitle: process.env.VUE_APP_TITLE,
    drawer: null,
    item: 1,
    items: [
      { text: "Perfil", icon: "account_circle" },
      { text: "Sair", icon: "exit_to_app" }
    ]
  })
};
</script>

<style>
</style>