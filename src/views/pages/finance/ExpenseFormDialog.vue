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
                    <ValidationProvider v-slot="{ errors }" name="Catgoria" rules="required">
                      <v-select
                        v-model="selectedCategory"
                        :items="categories"
                        id="category-select"
                        item-text="name"
                        item-value="code"
                        label="Selecione uma Categoria"
                        :error-messages="errors"
                        v-on:change="getProducts(selectedCategory)"
                      ></v-select>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <ValidationProvider v-slot="{ errors }" name="Produto">
                      <v-select
                        v-model="finance.product"
                        :items="products"
                        id="product-select"
                        item-text="name"
                        item-value="code"
                        label="Selecione um Produto"
                        :error-messages="errors"
                      ></v-select>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <ValidationProvider v-slot="{ errors }" name="Data da compra" rules="required">
                      <v-menu>
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="finance.buyDate"
                            :value="formattedDate"
                            id="buy-date-input"
                            prepend-icon="date_range"
                            :error-messages="errors"
                            clearable
                            hint="formato DD/MM/AAAA"
                            label="Data da compra"
                            v-on="on"
                            v-bind="attrs"
                            @click:clear="date = null"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="date" locale="pt-BR"></v-date-picker>
                      </v-menu>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <vuetify-money
                      v-model="finance.value"
                      id="value-money"
                      label="Valor"
                      :valueWhenIsEmpty="valueWhenIsEmpty"
                      :options="options"
                      placeholder=" "
                    />
                  </v-col>
                  <v-col cols="12">
                    <ValidationProvider v-slot="{ errors }" rules="required" name="Parceiro">
                      <v-radio-group
                        v-model="finance.partner"
                        id="partner-radio"
                        :error-messages="errors"
                        label="Parceiro: "
                      >
                        <v-radio
                          v-for="(p, index) in partners"
                          :key="index"
                          :label="p.name"
                          color="indigo"
                          :value="p.code"
                        ></v-radio>
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
import PartnerService from "@/service/PartnerService";
import ProductService from "@/service/ProductService";
import DateHelper from "@/helper/DateHelper";

export default {
  name: "ExpenseFormDialog",

  inject: ["save"],

  props: {
    finance: {
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
    this.partnerService = new PartnerService();
    this.productService = new ProductService();
  },

  data: () => ({
    selectedCategory: null,
    categories: [],
    products: [],
    partners: [],
    date: null,
    valueWhenIsEmpty: "",
    options: {
      locale: "pt-BR",
      prefix: "R$",
      suffix: "",
      length: 11,
      precision: 2,
    },
  }),

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
    formattedDate() {
      return this.date ? DateHelper.formatBrlDate(this.date) : "";
    },

    toLowerCase() {
      return this.finance.partner.name.toLowerCase();
    },
  },

  mounted() {
    this.getCategories().then((data) => {
      this.categories = data.categories;
    });

    this.getPartners().then((data) => {
      this.partners = data.partners;
    });
  },

  methods: {
    saveItem() {
      this.finance.typeFinance = "EXPENSE";

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

    getPartners() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        let partners = this.partnerService.getAll().then((res) => {
          if (!res._embedded) {
            return [];
          }
          partners = res._embedded.partners;

          setTimeout(() => {
            resolve({
              partners,
            });
          }, 1000);
        });
      });
    },

    getProducts(categoryCode) {
      // eslint-disable-next-line no-unused-vars
      this.productService.getAll(categoryCode).then((res) => {
        if (!res._embedded) {
          return [];
        }
        this.products = res._embedded.products;
      });
    },
  },
};
</script>
