<template>
  <div>
    <v-list-item :to="route.path" link v-if="isVisible">
      <v-list-item-icon>
        <v-icon>{{ route.icon }}</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{ route.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-group
      :prepend-icon="route.icon"
      :key="route.name"
      no-action
      v-if="route.children && route.children.length"
      color="inherit"
    >
      <template v-slot:activator>
        <v-list-item-title>{{ route.name }}</v-list-item-title>
      </template>
      <v-list-item
        v-for="(child, index) in route.children"
        :key="index"
        :to="route.path + '/' + child.path"
        dense
        color="info"
      >
        <v-list-item-icon>
          <v-icon>{{ child.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ child.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
export default {
  name: "Menu",
  props: {
    route: {
      type: Object
    }
  },
  computed: {
    isVisible() {
      if (
        this.route.meta &&
        (this.route.meta.visible === undefined || this.route.meta.visible)
      ) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style>
</style>