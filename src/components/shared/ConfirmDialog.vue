<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Atenção!</v-card-title>
        <v-card-text>Você confirma que gostaria de deletar?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="show = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="confirm">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "ConfirmDialog",

  props: {
    value: Boolean,
    service: Object,
    codeDomain: Object
  },

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },

  methods: {
    confirm() {
      this.$parent.removeItem(this.codeDomain);
    }
  }
};
</script>

<style>
</style>