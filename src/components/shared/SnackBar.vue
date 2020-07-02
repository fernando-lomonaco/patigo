<template>
  <v-snackbar v-model="show" :timeout="timeout" :color="color" right bottom>
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="show = false">
        <v-icon>close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "SnackBar",

  props: {
    message: {
      required: true,
      type: String
    },
    color: String,
    value: Boolean
  },

  data: () => ({
    timeout: 8000
  }),

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>

<style>
</style>
