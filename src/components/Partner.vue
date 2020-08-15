<template>
  <v-container id="regular-tables" fluid tag="section">
    <patigo-snack-bar
      v-model="patigoSnackBar.status"
      :message="patigoSnackBar.message"
      :color="patigoSnackBar.type"
    />

    <patigo-header-page page="Parceiro" />

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
        <template v-slot:item.document="{ item }">{{ item.document }}</template>
        <template v-slot:item.name="{ item }">{{ formatName(item.name) }}</template>
        <template
          v-slot:item.lastDate="{ item }"
        >{{ formatDate(item.createdDate, item.updatedDate) }}
                <v-icon color="red" dark v-bind="attrs" v-on="on">mdi-heart</v-icon>

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
      :partner="partner"
      :dialog-title="formTitle"
      ref="dialog"
    />

    <patigo-confirm-dialog v-model="patigoConfirmDialog" :service="service" :code-domain="partner" />
  </v-container>
</template>

<script>
import Partner from "@/model/Partner";
import PartnerService from "@/service/PartnerService";
import DateHelper from "@/helper/DateHelper";

export default {
  name: "Partner",

  provide() {
    return {
      save: this.saveItem,
      search: this.searchDocument,
    };
  },

  components: {
    PatigoFormDialog: () => import("@/views/pages/partner/PartnerFormDialog"),
    PatigoConfirmDialog: () => import("@/components/shared/ConfirmDialog"),
    PatigoSnackBar: () => import("@/components/shared/SnackBar.vue"),
    PatigoHeaderPage: () => import("@/components/shared/HeaderPage.vue"),
  },

  created() {
    this.service = new PartnerService();
  },

  data() {
    return {
      partner: new Partner(),
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
        { text: "CNPJ", value: "document" },
        { text: "Nome", value: "name" },
        {
          text: "Última atualização",
          value: "lastDate",
        },
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
      return this.editedIndex === -1 ? "Adicionar Parceiro" : "Editar Parceiro";
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
          items = res._embedded.partners;
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
        this.partner = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    saveItem() {
      this.service.post(this.partner).then(
        (res) => {
          let status = res.status == 201 ? "cadastrado" : "editado";

          if (this.editedIndex > -1) {
            Object.assign(this.items[this.editedIndex], res.data);
          } else {
            this.items.unshift(res.data);
          }

          this.showSnackBar(
            true,
            `Parceiro ${res.data.name} ${status} com sucesso`,
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
          this.partner = res;
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
              `Parceiro ${item.name} removido com sucesso`,
              "info"
            );
          }
        },
        (err) => console.log("Error " + err)
      );
    },

    searchDocument() {
      let document = this.partner.document.replace(/[./-\s]/g, "");
      this.service.getDocumentInfo(document).then(
        (res) => {
          if (res != "ERROR") {
            this.partner.name = res.fantasia ? res.fantia : res.nome;
          }
        },
        (err) => (this.mensagem = err.message)
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
      this.partner = item;
    },

    formatName(value) {
      var name = value
        .toLowerCase()
        .split(" ")
        .map((c) => c[0].toUpperCase() + c.substring(1))
        .join(" ");
      return name;
    },

    formatDate(firstDate, secondDate) {
      return DateHelper.compareDate(firstDate, secondDate);
    },
  },
};
</script>
<style>
</style>