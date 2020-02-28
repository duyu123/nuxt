
// import { Vue, Component, Prop } from 'vue-property-decorator'
// import './index.scss'

// interface Svg {
//   icon: string
// }

// @Component
// export default class IconComponent extends Vue {
//   @Prop({ type: Object, required: true }) readonly svg!: Svg

//   public render() {
//     return (
//       <div></div>
//         // <svg className="icon" aria-hidden="true">
//         //   <use xlink:href="{`#icon-${this.svg.icon}`}"></use>
//         // </svg>
//     )
//   }
// }

import Vue, { CreateElement, RenderContext, ComponentOptions } from 'vue'
import { DefaultSlots } from '../../utils/type'
import { emit } from '../../utils/functional'
import { CreateComponent } from '../../utils'
require('../../assets/font/iconfont.js')

type IconProps = {
  text: String
}

/**
 * @description:
 * @param {CreateElement} h
 * @param {IconProps} props
 * @param {RenderContext<IconProps>} ctx
 * @return:
 * @author: serina
 */
function Icon (
  h: CreateElement,
  props: IconProps,
  ctx: RenderContext<IconProps>
) {
  const { text } = props

  return (
    <svg className="icon" aria-hidden="true">
      <use v-bind={{'xlink:href': `#icon-${text}`}}></use>
    </svg>
  )
}

Icon.props = {
  text: String
}

export default CreateComponent('icon')<IconProps>(Icon)



