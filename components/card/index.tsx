import Vue, { CreateElement, RenderContext, ComponentOptions } from 'vue'
import { DefaultSlots } from '../../utils/type'
import { emit } from '../../utils/functional'
import { CreateComponent } from '../../utils'

import './index.scss'

export type CardProps = {
  text: String
}

/**
 * @description:
 * @param {CreateElement} h
 * @param {CardProps} props
 * @param {RenderContext<CardProps>} ctx
 * @return:
 * @author: serina
 */
function Card (
  h: CreateElement,
  props: CardProps,
  slots: DefaultSlots,
  ctx: RenderContext<CardProps>
) {
  const { text } = props
  return (
   
  )
}

Card.props = {
  text: String
}

export default CreateComponent('card')<CardProps>(Card)



