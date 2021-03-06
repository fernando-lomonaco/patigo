<template>
  <v-container id="regular-tables" fluid tag="section">
    <patigo-snack-bar
      v-model="patigoSnackBar.status"
      :message="patigoSnackBar.message"
      :color="patigoSnackBar.type"
    />

    <patigo-header-page page="Produto" />

    <v-card>
      <v-card-title>
        <v-col cols="2">
          <v-select
            v-if="pageCount > 1"
            :items="[5,10,15]"
            menu-props="auto"
            label="Item por página"
            hide-details
            :value="itemsPerPage"
            @input="itemsPerPage = parseInt($event, 10)"
          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Buscar" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        :loading="loading"
        class="elevation-1"
        @page-count="pageCount = $event"
      >
        <template v-slot:item.name="{ item }">{{ item.name }}</template>
        <template
          v-slot:item.lastDate="{ item }"
        >{{ formatDate(item.createdDate, item.updatedDate) }}</template>
        <template v-slot:item.category="{ item }">{{ item.category.name }}</template>
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status == 'A' ? 'green' : 'amber'"
            dark
          >{{ item.status == "A" ? "Ativo" : "Inativo" }}</v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon medium class="mr-2" color="info darken-2" @click="editItem(item)">edit</v-icon>
          <v-icon medium color="red darken-2" @click="openModalRemove(item)">delete</v-icon>
        </template>
      </v-data-table>

      <div class="text-center pt-2">
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="6"
          circle
          light
          color="info"
        ></v-pagination>
      </div>
    </v-card>
    <patigo-form-dialog
      v-model="patigoFormDialog"
      :product="product"
      :dialog-title="formTitle"
      ref="dialog"
    />

    <patigo-confirm-dialog v-model="patigoConfirmDialog" :service="service" :code-domain="product" />
  </v-container>
</template>

<script>
import Product from "@/model/Product";
import ProductService from "@/service/ProductService";
import DateHelper from "@/helper/DateHelper";

export default {
  name: "Product",

  provide() {
    return {
      save: this.saveItem,
    };
  },

  components: {
    PatigoFormDialog: () => import("@/views/pages/product/ProductFormDialog"),
    PatigoConfirmDialog: () => import("@/components/shared/ConfirmDialog"),
    PatigoSnackBar: () => import("@/components/shared/SnackBar.vue"),
    PatigoHeaderPage: () => import("@/components/shared/HeaderPage.vue"),
  },

  created() {
    this.service = new ProductService();
  },

  data() {
    return {
      product: new Product(),
      patigoFormDialog: false,
      patigoConfirmDialog: false,
      patigoSnackBar: {
        status: false,
        message: "",
        type: "",
      },
      search: "",
      itemsPerPage: 5,
      page: 1,
      pageCount: 0,
      items: [],
      loading: true,
      headers: [
        { text: "Nome", value: "name" },
        {
          text: "Última atualização",
          value: "lastDate",
        },
        {
          text: "Categoria",
          value: "category",
          sortable: false,
        },
        { text: "Status", value: "status" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      defaultItem: {
        name: "",
        description: "",
        status: null,
      },
    };
  },

  watch: {
    patigoFormDialog(val) {
      val || this.closeFormDialog();
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Adicionar Produto" : "Editar Produto";
    },
  },

  mounted() {
    this.getAll().then((data) => {
      this.items = data.items;
      this.perPage = data.perPage;
    });
  },

  methods: {
    getAll() {
      this.loading = true;
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        let items = this.service.getAll().then((res) => {
          if (!res._embedded) {
            this.loading = false;
            return [];
          }
          items = res._embedded.products;
          const total = res.page.totalElements;
          const perPage = res.page.size;

          setTimeout(() => {
            this.loading = false;
            resolve({
              items,
              total,
              perPage,
            });
          }, 1000);
        });
      });
    },

    closeFormDialog() {
      this.patigoFormDialog = false;
      this.$nextTick(() => {
        this.$refs.dialog.cleanValidate();
        this.product = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    saveItem() {
      this.service.post(this.product).then(
        (res) => {
          let status = res.status == 201 ? "cadastrado" : "editado";

          if (this.editedIndex > -1) {
            Object.assign(this.items[this.editedIndex], res.data);
          } else {
            this.items.unshift(res.data);
          }

          this.showSnackBar(
            true,
            `Produto ${res.data.name} ${status} com sucesso`,
            "success"
          );

          this.closeFormDialog();
        },
        (err) => console.log("Error " + err)
      );
      //
    },

    editItem(item) {
      this.openFormModal();
      this.editedIndex = this.items.indexOf(item);
      this.service.get(item.code).then(
        (res) => {
          this.product = res;
        },
        (err) => console.log("Error " + err)
      );
    },

    removeItem(item) {
      const index = this.items.indexOf(item);
      return this.service.delete(item.code).then(
        (res) => {
          if (res == 204) {
            this.items.splice(index, 1);
            this.patigoConfirmDialog = false;
            this.showSnackBar(
              true,
              `Produto ${item.name} removido com sucesso`,
              "info"
            );
          }
        },
        (err) => console.log("Error " + err)
      );
    },

    showSnackBar(status = true, message, type) {
      this.patigoSnackBar.status = status;
      this.patigoSnackBar.type = type;
      this.patigoSnackBar.message = message;
    },

    openFormModal() {
      this.patigoFormDialog = true;
    },

    openModalRemove(item) {
      this.patigoConfirmDialog = true;
      this.product = item;
    },

      formatDate(firstDate, secondDate) {
      return DateHelper.compareDate(firstDate, secondDate);
    },
  },
};
</script>
<style>
</style>