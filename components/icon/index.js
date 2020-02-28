import IconComponent from './index.vue';

IconComponent.install = (Vue) =>{
  Vue.component(IconComponent.name, IconComponent)
}

export default IconComponent;