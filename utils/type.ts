/*
 * @Description:
 * @Version: 2.0
 * @Autor: duyu123
 * @Date: 2020-2-22 10:49:26
 * @LastEditors: duyu123
 * @LastEditTime: 2020-2-22 10:49:26
 */

/*eslint-disable*/
import Vue, { VNode, ComponentOptions, VueConstructor } from 'vue'

export type ScopedSlot<Props = any> = (props?: Props) => VNode[] | VNode | undefined;
export type DefaultSlots = {
  default?: ScopedSlot
}

export type ObjectIndex = Record<string, any>

export type ScopedSlots = {
  [key: string]: ScopedSlot | undefined
}

export interface DrmsComponentOptions extends ComponentOptions<Vue> {
  functional?: boolean;
  install?: (Vue: VueConstructor) => void;
}
