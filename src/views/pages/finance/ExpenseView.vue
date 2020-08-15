<template>
  <div>
    <patigo-expense />
  </div>
</template>

<script>
export default {
  name: "ExpenseView",

  components: {
    PatigoExpense: () => import("@/components/Expense")
  }
};
</script>

<style>
</style>