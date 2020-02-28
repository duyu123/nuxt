import VueRouter, { Route } from "vue-router";
import Vue from 'vue';
declare var document: Document;
declare module '*.vue' {
  export default Vue;
}
declare module "*.ts" {
  const value: any;
  export default value;
}

declare global {
  interface window {
    require: any;
  }
}

// 识别 this.$route
declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter; // 这表示this下有这个东西
    $route: Route;
    $notify: any;
  }
}