<template>
  <v-row justify="center">
    <!-- <patigo-snack-bar v-model="patigoSnackBar" :message="message" :color="type" /> -->
    <v-dialog v-model="show" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ titleDialog }}</span>
        </v-card-title>
        <ValidationObserver ref="observer">
          <v-form ref="form" lazy-validation>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Nome"
                      rules="required|max:10|min:3"
                    >
                      <v-text-field
                        v-model="category.name"
                        id="name-input"
                        :counter="10"
                        :error-messages="errors"
                        label="Nome Categoria"
                        hint="Exemplo: Bebida, Pão, Carne."
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>

                  <v-col cols="12">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Descrição"
                      rules="required|max:60|min:5"
                    >
                      <v-textarea
                        v-model="category.description"
                        auto-grow
                        clearable
                        :counter="60"
                        :error-messages="errors"
                        row-height="24"
                        rows="1"
                        label="Descrição*"
                      ></v-textarea>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12">
                    <ValidationProvider v-slot="{ errors }" rules="required" name="Status">
                      <v-radio-group
                        v-model="category.status"
                        :error-messages="errors"
                        label="Status: "
                        row
                      >
                        <v-radio label="Ativo" color="indigo" value="A"></v-radio>
                        <v-radio label="Inativo" color="indigo" value="I"></v-radio>
                      </v-radio-group>
                    </ValidationProvider>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text large color="black darken-1" @click="show = false">Fechar</v-btn>
              <v-btn large color="info" @click="saveItem">Salvar</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "CategoryFormDialog",

  inject: ["save"],

  props: {
    category: {
      required: true,
      type: Object
    },
    value: Boolean,
    titleDialog: {
      required: true,
      type: String
    }
  },

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.cleanValidate();
        this.$emit("input", value);
      }
    }
  },

  methods: {
    saveItem() {
      this.$refs.observer.validate().then(success => {
        if (!success) {
          return;
        }
        this.save();
      });
    },

    cleanValidate() {
      this.$refs.observer.reset();
    }
  }
};
</script>
