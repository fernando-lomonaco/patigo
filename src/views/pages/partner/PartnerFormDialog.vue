<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
        </v-card-title>
        <ValidationObserver ref="observer">
          <v-form ref="form" lazy-validation>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="CNPJ"
                      rules="required|max:18|regex:\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}"
                    >
                      <v-text-field
                        v-model="partner.document"
                        id="document-input"
                        v-mask="'##.###.###/####-##'"
                        :error-messages="errors"
                        label="CNPJ"
                        @keyup="searchDocument"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>

                  <v-col cols="12">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Nome"
                      rules="required|max:60|min:3"
                    >
                      <v-text-field
                        v-model="partner.name"
                        id="name-input"
                        readonly
                        :counter="60"
                        :error-messages="errors"
                        label="Nome Parceiro"
                      ></v-text-field>
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
  name: "PartnerFormDialog",

  inject: ["save", "search"],

  props: {
    partner: {
      required: true,
      type: Object
    },
    value: Boolean,
    dialogTitle: {
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

    searchDocument() {
      this.search();
    },

    cleanValidate() {
      this.$refs.observer.reset();
    }
  }
};
</script>
