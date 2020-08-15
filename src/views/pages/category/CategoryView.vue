<template>
  <div>
    <patigo-category />
  </div>
</template>

<script>
export default {
  name: "CategoryView",

  components: {
    PatigoCategory: () => import("@/components/Category")
  }
};
</script>

<style>
</style>