<template>
  <v-container id="regular-tables" fluid tag="section">
    <patigo-snack-bar
      v-model="patigoSnackBar.status"
      :message="patigoSnackBar.message"
      :color="patigoSnackBar.type"
    />

    <patigo-header-page page="Despesa" />

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
        <template v-slot:item.product="{ item }">{{ item.product.name }}</template>
        <template v-slot:item.buyDate="{ item }">{{ formatDate(item.buyDate) }}</template>
        <template v-slot:item.partner="{ item }">{{ item.partner.name }}</template>
        <template v-slot:item.value="{ item }">{{ item.value }}</template>
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
      :finance="finance"
      :dialog-title="formTitle"
      ref="dialog"
    />

    <patigo-confirm-dialog v-model="patigoConfirmDialog" :service="service" :code-domain="finance" />
  </v-container>
</template>

<script>
import Finance from "@/model/Finance";
import FinanceService from "@/service/FinanceService";
import DateHelper from "@/helper/DateHelper";

export default {
  name: "Expense",

  provide() {
    return {
      save: this.saveItem,
    };
  },

  components: {
    PatigoFormDialog: () => import("@/views/pages/finance/ExpenseFormDialog"),
    PatigoConfirmDialog: () => import("@/components/shared/ConfirmDialog"),
    PatigoSnackBar: () => import("@/components/shared/SnackBar.vue"),
    PatigoHeaderPage: () => import("@/components/shared/HeaderPage.vue"),
  },

  created() {
    this.service = new FinanceService();
  },

  data: () => ({
    finance: new Finance(),
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
      { text: "Produto", value: "product" },
      {
        text: "Data compra",
        value: "buyDate",
      },
      { text: "Parceiro", value: "partner" },
      { text: "Valor", value: "value" },
      { text: "Ações", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    defaultItem: {
      name: "",
      description: "",
      status: null,
    },
  }),

  watch: {
    patigoFormDialog(val) {
      val || this.closeFormDialog();
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Adicionar Despesa" : "Editar Despesa";
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
          items = res._embedded.finances;
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
        this.finance = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    saveItem() {
      this.service.post(this.finance).then(
        (res) => {
          let status = res.status == 201 ? "cadastrada" : "editada";

          if (this.editedIndex > -1) {
            Object.assign(this.items[this.editedIndex], res.data);
          } else {
            this.items.unshift(res.data);
          }

          this.showSnackBar(
            true,
            `Despesa ${res.data.finance.name} ${status} com sucesso`,
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
      this.service.get(item.finance.code).then(
        (res) => {
          this.finance = res.finance;
        },
        (err) => console.log("Error " + err)
      );
    },

    removeItem(item) {
      const index = this.items.indexOf(item);
      return this.service.delete(item.finance.code).then(
        (res) => {
          if (res == 204) {
            this.items.splice(index, 1);
            this.patigoConfirmDialog = false;
            this.showSnackBar(
              true,
              `Despesa ${item.finance.name} removida com sucesso`,
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
      this.finance = item;
    },

    formatDate(date) {
      return DateHelper.formatBrlDate(date);
    },
  },
};
</script>
<style>
</style>