/*
 * @Description:
 * @Version: 2.0
 * @Autor: duyu123
 * @Date: 2020-2-22 10:49:26
 * @LastEditors: duyu123
 * @LastEditTime: 2020-2-22 10:49:26
 */

import Vue, { VNode, CreateElement, VueConstructor } from 'vue'
import { DefaultProps, PropsDefinition, InjectOptions, RenderContext, ComponentOptions } from 'vue/types/options'
import { ScopedSlots, DrmsComponentOptions } from './type'

export function transformFunctionComponent(fn:FunctionComponent): DrmsComponentOptions {
  return {
    functional: true,
    props: fn.props,
    model: fn.model,
    render: (h, context):any => 
      fn(h, context.props, unifySlots(context), context)
  }
}

/**
 * @description: 生成Component
 * @param { name:组件名称 }
 * @return: FunctionComponent
 * @author: czklove
 */
export function CreateComponent(name:string) {
  return function <Props = DefaultProps, Events = {}, Slots = {}>(
    sfc: DrmsComponentOptions | FunctionComponent) {
    if (typeof sfc === 'function') {
      sfc = transformFunctionComponent(sfc)
    }
    sfc.functional = true;
    sfc.name = 'drms-' + name
    sfc.install = install

    return sfc
  }
}

function install (this:ComponentOptions<Vue>, Vue:VueConstructor) {
  const { name } = this;
  Vue.component(name as string, this)
}

//  function组件的类型定义
export type FunctionComponent<Props=DefaultProps, PropsDefs = PropsDefinition<Props>> = {
  (h: CreateElement, Props:Props, slots: ScopedSlots, context:RenderContext<Props>): VNode|undefined,
  props?: PropsDefs,
  model?: ModelOptions,
  inject?: InjectOptions
}

// vmodel的类型定义
type ModelOptions = {
  prop?: string
  event?: string
}

// 处理插槽的内容
export function unifySlots (context: RenderContext) {
  // use data.scopedSlots in lower Vue version
  const scopedSlots = context.scopedSlots || context.data.scopedSlots || {}
  const slots = context.slots()

  Object.keys(slots).forEach(key => {
    if (!scopedSlots[key]) {
      scopedSlots[key] = () => slots[key]
    }
  })

  return scopedSlots
}

export type TsxComponent<Props, Events, Slots> = (
  props: Partial<Props & Events & TsxBaseProps<Slots>>
) => VNode

export type TsxBaseProps<Slots> = {
  key: string | number
  // hack for jsx prop spread
  props: any
  class: any
  style: string | object[] | object
  scopedSlots: Slots
}