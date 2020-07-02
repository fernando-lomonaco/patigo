<template>
  <div>
    <patigo-category />
  </div>
</template>

<script>
export default {
  name: "CategoryView",

  components: {
    PatigoCategory: () => import("@/components/category/Category")
  }
};
</script>

<style>
</style>