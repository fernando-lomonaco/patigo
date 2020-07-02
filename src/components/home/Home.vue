<template>
  <div>
    <h2>{{ msg }} - {{ toUpper }}</h2>
  </div>
</template>
<script>
export default {
  name: "Home",

  data() {
    return {
      nome: "Teste"
    };
  },

  computed: {
    toUpper() {
      return this.nome.toUpperCase()
    }
  },

  props: {
    msg: String
  }
};
</script>
<style scoped>
</style>