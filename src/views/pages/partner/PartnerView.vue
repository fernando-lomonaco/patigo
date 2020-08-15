<template>
  <div>
    <patigo-partner />
  </div>
</template>

<script>
export default {
  name: "PartnerView",

  components: {
    PatigoPartner: () => import("@/components/Partner")
  }
};
</script>

<style>
</style>