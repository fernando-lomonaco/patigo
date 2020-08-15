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
                    <ValidationProvider v-slot="{ errors }" name="Categoria" rules="required">
                      <v-select
                        v-model="product.category"
                        :items="categories"
                        label="Selecione uma Categoria"
                        item-text="name"
                        item-value="code"
                        id="category-select"
                        return-object
                        :error-messages="errors"
                      ></v-select>
                    </ValidationProvider>
                  </v-col>

                  <v-col cols="12" md="6">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Nome"
                      rules="required|max:30|min:3"
                    >
                      <v-text-field
                        v-model="product.name"
                        id="name-input"
                        :counter="30"
                        :error-messages="errors"
                        aria-autocomplete="false"
                        label="Nome Produto"
                        hint="Exemplo: Bebida, Pão, Carne."
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>

                  <v-col cols="12">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Descrição"
                      rules="required|max:80|min:5"
                    >
                      <v-textarea
                        v-model="product.description"
                        id="description-textarea"
                        auto-grow
                        clearable
                        :counter="80"
                        :error-messages="errors"
                        row-height="24"
                        rows="1"
                        label="Descrição"
                      ></v-textarea>
                    </ValidationProvider>
                  </v-col>

                  <v-col cols="12" md="6">
                    <ValidationProvider v-slot="{ errors }" rules="required" name="Status">
                      <v-radio-group
                        v-model="product.status"
                        id="status-radio"
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
import CategoryService from "@/service/CategoryService";

export default {
  name: "ProductFormDialog",

  inject: ["save"],

  data: () => ({
    categories: [],
    teste: null,
  }),

  props: {
    product: {
      required: true,
      type: Object,
    },
    value: Boolean,
    dialogTitle: {
      required: true,
      type: String,
    },
  },

  created() {
    this.categoryService = new CategoryService();
  },

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.cleanValidate();
        this.$emit("input", value);
      },
    },
  },

  mounted() {
    this.getCategories().then((data) => {
      this.categories = data.categories;
    });
  },

  methods: {
    saveItem() {
      this.$refs.observer.validate().then((success) => {
        if (!success) {
          return;
        }
        this.save();
      });
    },

    cleanValidate() {
      this.$refs.observer.reset();
    },

    getCategories() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        let categories = this.categoryService.getAll("A").then((res) => {
          if (!res._embedded) {
            return [];
          }
          categories = res._embedded.categories;

          setTimeout(() => {
            resolve({
              categories,
            });
          }, 1000);
        });
      });
    },
  },
};
</script>
