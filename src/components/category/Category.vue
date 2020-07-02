<template>
  <v-container id="regular-tables" fluid tag="section">
    <patigo-snack-bar
      v-model="patigoSnackBar.status"
      :message="patigoSnackBar.message"
      :color="patigoSnackBar.type"
    />

    <div class="my-2 d-flex justify-end">
      <v-btn color="info" class="ma-2" dark large @click="openFormModal">
        <v-icon color="white darken-2" left>mdi-plus-circle</v-icon>Adicionar Categoria
      </v-btn>
    </div>
    <v-card>
      <v-card-title>
         <v-col cols="2">
        <v-select
          :items="[5,10,15]"
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
        <!-- <v-data-table
        :headers="headers"
        :items="items"
        :server-items-length="totalItems"
        :items-per-page="itemsPerPage"
        :loading="loading"
        :page.sync="page"
        :search="search"
        :item-key="category.name"
        :footer-props="footerProps"
        sort-by="createdDate"
        class="elevation-1"
        >-->
        <template v-slot:item.name="{ item }">{{ item.category.name }}</template>
        <template v-slot:item.createdDate="{ item }">{{ formatDate(item.category.createdDate) }}</template>
        <template v-slot:item.updatedDate="{ item }" class="center">
          <v-layout>{{item.category.updatedDate == item.category.createdDate ? "-" : formatDate(item.category.updatedDate) }}</v-layout>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.category.status == 'A' ? 'green' : 'amber'"
            dark
          >{{ item.category.status == "A" ? "Ativo" : "Inativo" }}</v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon medium class="mr-2" color="info darken-2" @click="editItem(item)">edit</v-icon>
          <v-icon medium color="red darken-2" @click="openModalRemove(item)">delete</v-icon>
        </template>
      </v-data-table>
     
      <div class="text-center pt-2">        
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-card>
    <patigo-form-dialog
      v-model="patigoFormDialog"
      :category="category"
      :title-dialog="formTitle"
      ref="dialog"
    />

    <patigo-confirm-dialog
      v-model="patigoConfirmDialog"
      :service="service"
      :code-domain="category"
    />
  </v-container>
</template>

<script>
import Category from "@/model/Category";
import CategoryService from "@/service/CategoryService";

export default {
  name: "Category",

  provide() {
    return {
      save: this.saveItem
    };
  },

  components: {
    PatigoFormDialog: () => import("@/views/pages/category/CategoryFormDialog"),
    PatigoConfirmDialog: () => import("@/components/shared/ConfirmDialog"),
    PatigoSnackBar: () => import("@/components/shared/SnackBar.vue")
  },

  created() {
    this.service = new CategoryService();
  },

  data() {
    return {
      category: new Category(),
      titleDialog: "Cadastrar Categoria",
      patigoFormDialog: false,
      patigoConfirmDialog: false,
      patigoSnackBar: {
        status: false,
        message: "",
        type: ""
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
          text: "Data criação",
          value: "createdDate"
        },
        {
          text: "Data atualização",
          value: "updatedDate",
          sortable: false
        },
        { text: "Status", value: "status" },
        { text: "Ações", value: "actions", sortable: false }
      ],
      editedIndex: -1,
      defaultItem: {
        name: "",
        description: "",
        status: null
      }
    };
  },

  watch: {
    patigoFormDialog(val) {
      val || this.closeFormDialog();
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Adicionar Categoria"
        : "Editar Categoria";
    }
  },

  mounted() {
    this.getAll().then(data => {
      this.items = data.items;
      this.perPage = data.perPage;
    });
  },

  methods: {
    getAll() {
      this.loading = true;
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        let items = this.service.getAll().then(res => {
          if (!res._embedded) {
            this.loading = false;
            return [];
          }
          items = res._embedded.categories;
          const total = res.page.totalElements;
          const perPage = res.page.size;

          setTimeout(() => {
            this.loading = false;
            resolve({
              items,
              total,
              perPage
            });
          }, 1000);
        });
      });
    },

    closeFormDialog() {
      this.patigoFormDialog = false;
      this.$nextTick(() => {
        this.$refs.dialog.cleanValidate();
        this.category = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    saveItem() {
      this.service.post(this.category).then(
        res => {
          let status = res.status == 201 ? "cadastrada" : "editada";

          if (this.editedIndex > -1) {
            Object.assign(this.items[this.editedIndex], res.data);
          } else {
            this.items.unshift(res.data);
          }

          this.showSnackBar(
            true,
            `Categoria ${res.data.category.name} ${status} com sucesso`,
            "success"
          );

          this.closeFormDialog();
        },
        err => console.log("Error " + err)
      );
      //
    },

    editItem(item) {
      this.openFormModal();
      this.editedIndex = this.items.indexOf(item);
      this.service.get(item.category.code).then(
        res => {
          this.category = res.category;
        },
        err => console.log("Error " + err)
      );
    },

    removeItem(item) {
      const index = this.items.indexOf(item);
      return this.service.delete(item.category.code).then(
        res => {
          if (res == 204) {
            this.items.splice(index, 1);
            this.patigoConfirmDialog = false;
            this.showSnackBar(
              true,
              `Categoria ${item.category.name} removida com sucesso`,
              "info"
            );
          }
        },
        err => console.log("Error " + err)
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
      this.category = item;
    },

    formatDate(value) {
      return new Date(value).toLocaleString();
    }
  }
};
</script>
<style>
</style>