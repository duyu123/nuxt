import Vue, { CreateElement, RenderContext, ComponentOptions } from 'vue'
import { DefaultSlots } from '../../utils/type'
import { emit } from '../../utils/functional'
import { CreateComponent } from '../../utils'

import './index.scss'

export type IconProps = {
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
  slots: DefaultSlots,
  ctx: RenderContext<IconProps>
) {
  const { text } = props
console.log(text)
  return (
   
    <svg class="icon" aria-hidden="true" style={{ fontSize: '16px', color: 'lightblue' }}>
      <use xlinkHref={`#icon${text}`}></use>
      { slots.default?.() }
    </svg>
  )
}

Icon.props = {
  text: String
}

export default CreateComponent('icon')<IconProps>(Icon)



