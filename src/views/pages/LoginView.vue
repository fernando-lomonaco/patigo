<template>
  <v-app id="app">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col md="3">
            <v-card class="elevation-12" color="#0D47A1">
              <v-card-title class="white--text justify-center">LOGIN</v-card-title>

              <v-card-text>
                <ValidationObserver ref="observer">
                  <v-form ref="form" lazy-validation>
                    <ValidationProvider v-slot="{ errors }" name="Username" rules="required">
                      <v-text-field
                        v-model="user.username"
                        id="username"
                        label="Login"
                        name="login"
                        type="text"
                        prepend-inner-icon="mdi-account"
                        :error-messages="errors"
                        outlined
                        color="white"
                      ></v-text-field>
                    </ValidationProvider>

                    <ValidationProvider v-slot="{ errors }" name="Password" rules="required">
                      <v-text-field
                        v-model="user.password"
                        id="password"
                        label="Password"
                        name="password"
                        :type="showPassword ? 'password' : 'text'"
                        prepend-inner-icon="lock"
                        :error-messages="errors"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPassword = !showPassword"
                        outlined
                        color="white"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-form>
                </ValidationObserver>
                <v-alert v-if="message" type="error">
                  <strong>Atenção!</strong>
                  {{ message }}
                </v-alert>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  large
                  color="white"
                  :loading="loading"
                  outlined
                  :disabled="loading"
                  @click="handleLogin"
                >LET'S GO</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import User from "@/model/User";

export default {
  name: "LoginView",
  data: () => ({
    user: new User(),
    loading: false,
    showPassword: true,
    message: ""
  }),

  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },

  created() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
  },

  methods: {
    handleLogin() {
      this.loading = true;
      this.$refs.observer.validate().then(success => {
        if (!success) {
          this.loading = false;
          return;
        }
        if (this.user.username && this.user.password) {
          this.$store.dispatch("auth/login", this.user).then(
            () => {
              this.$router.push("/");
            },
            error => {
              this.loading = false;
              this.message = "Verifique suas credencias.";
              console.log(
                (error.response && error.response.data) ||
                  error.message ||
                  error.toString()
              );
            }
          );
        }
      });
    }
  }
};
</script>
<style scoped>
#app {
  background-image: linear-gradient(
    to right,
    #d28df7,
    #bd7fde,
    #a871c6,
    #9363ad,
    #7e5594
  );
}
</style>
