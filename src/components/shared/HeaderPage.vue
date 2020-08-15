<template>
  <div class="d-flex justify-space-between mb-6">
    <h4 class="d-flex align-center">Lista de {{ toPlural }}</h4>
    <v-btn color="info" dark large @click="openModal">
      <v-icon color="white darken-2" left>mdi-plus-circle</v-icon>
      Adicionar {{ page }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "HeaderPage",

  props: {
    page: {
      required: true,
      type: String
    }
  },

  computed: {
    toPlural() {
      return this.page + "s";
    }
  },

  methods: {
    openModal() {
      this.$parent.openFormModal();
    }
  }
};
</script>

<style>
</style>