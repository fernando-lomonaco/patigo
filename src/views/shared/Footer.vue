<template>
  <v-footer :inset="footer.inset" app>
    <a href="mailto:experimente@monacosburger.com.br" class="text-footer">Monaco's Burger</a>
    <span class="px-4">&copy; {{ new Date().getFullYear() }}</span>
  </v-footer>
</template>
<script>
export default {
  name: "Footer",
  data: () => ({
    footer: {
      inset: true
    }
  })
};
</script>

<style scoped>
a.text-footer {
  color: #DE2027;
  font-size: 18px;
  text-decoration: none;
  display: inline-block;
  position: relative;
  font-family: "Dosis", sans-serif;
}

a.text-footer:hover {
  text-decoration: none;
  color: #DE2027;
  mask-image: linear-gradient(
    -75deg,
    rgba(0, 0, 0, 0.6) 30%,
    rgb(8, 7, 7) 50%,
    rgba(0, 0, 0, 0.6) 70%
  );
  mask-size: 200%;
  animation: shine 2s infinite;
}

@keyframes shine {
  from {
    -webkit-mask-position: 150%;
  }

  to {
    -webkit-mask-position: -50%;
  }
}
</style>