<template>
  <div class="home">
    <v-img :src="require('../../assets/logo.svg')" class="my-3" contain height="200" />
    <patigo-home msg="Welcome to Your Vue.js App" class="d-flex justify-center" />
  </div>
</template>

<script>
export default {
  name: "HomeView",
  components: {
    PatigoHome: () => import("@/components/home/Home.vue")
  }
};
</script>
