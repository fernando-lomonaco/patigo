<template>
  <div>
    <patigo-product />
  </div>
</template>

<script>
export default {
  name: "ProductView",

  components: {
    PatigoProduct: () => import("@/components/Product")
  }
};
</script>

<style>
</style>