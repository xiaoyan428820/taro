// @ts-nocheck
import { isNumber } from '@tarojs/shared'

import { convertNumber2VP } from '../../'

export class FlexManager {

  static flexAlign (value: string | number | undefined): FlexAlign {
    switch (value) {
      case 'flex-end':
        return FlexAlign.End
      case 'center':
        return FlexAlign.Center
      case 'space-between':
        return FlexAlign.SpaceBetween
      case 'space-around':
        return FlexAlign.SpaceAround
      case 'space-evenly':
        return FlexAlign.SpaceEvenly
      default:
        return FlexAlign.Start
    }
  }

  static reverseFlexAlign (value: FlexAlign): string {
    switch (value) {
      case FlexAlign.Start:
        return 'flex-start'
      case FlexAlign.End:
        return 'flex-end'
      case FlexAlign.Center:
        return 'center'
      case FlexAlign.SpaceBetween:
        return 'space-between'
      case FlexAlign.SpaceAround:
        return 'space-around'
      case FlexAlign.SpaceEvenly:
        return 'space-evenly'
      default:
        return ''
    }
  }

  static direction (value: string): FlexDirection {
    switch (value) {
      case 'row': return FlexDirection.Row
      case 'row-reverse': return FlexDirection.RowReverse
      case 'column-reverse': return FlexDirection.ColumnReverse
      default: return FlexDirection.Column
    }
  }

  static reverseDirection (value: FlexDirection): string {
    switch (value) {
      case FlexDirection.Row: return 'row'
      case FlexDirection.RowReverse: return 'row-reverse'
      case FlexDirection.Column: return 'column'
      case FlexDirection.ColumnReverse: return 'column-reverse'
      default: return ''
    }
  }

  static itemAlign (value: string | number | undefined): ItemAlign {
    switch (value) {
      case 'flex-start':
        return ItemAlign.Start
      case 'flex-end':
        return ItemAlign.End
      case 'center':
        return ItemAlign.Center
      case 'stretch':
        return ItemAlign.Stretch
      case 'baseline':
        return ItemAlign.Baseline
      default:
        return ItemAlign.Auto
    }
  }

  static reverseItemAlign (value: ItemAlign): string {
    switch (value) {
      case ItemAlign.Start:
        return 'flex-start'
      case ItemAlign.End:
        return 'flex-end'
      case ItemAlign.Center:
        return 'center'
      case ItemAlign.Stretch:
        return 'stretch'
      case ItemAlign.Baseline:
        return 'baseline'
      case ItemAlign.Auto:
        return 'auto'
      default:
        return ''
    }
  }

  static justifyContent (value: string): FlexAlign {
    return FlexManager.flexAlign(value)
  }

  static alignItems (value: string): ItemAlign {
    return FlexManager.itemAlign(value)
  }

  static alignSelf (value: string): ItemAlign {
    return FlexManager.itemAlign(value)
  }

  static flexWrap (value: string): FlexWrap {
    return value === 'wrap' ? FlexWrap.Wrap : FlexWrap.NoWrap
  }

  static alignContent (style: Record<string, string | number> = {}): FlexAlign | undefined {
    if (style.flexWrap !== 'wrap') return undefined
    const value = style.alignContent
    return FlexManager.flexAlign(value)
  }

  static flexSize (style: Record<string, string | number> = {}): [number, number, number | string] {
    const flex = style.flex
    const flexGrow = style.flexGrow || 0
    const flexShrink = style.flexShrink || 0
    const flexBasis = style.flexBasis || 'auto'
    let res: [number, number, number | string] = [Number(flexGrow), Number(flexShrink), flexBasis]

    if (typeof flex === 'number') {
      res = [flex, 1, 0]
    } else if (flex === 'auto') {
      res = [1, 1, 'auto']
    } else if (flex === 'none') {
      res = [0, 0, 'auto']
    } else if (typeof flex === 'string') {
      const FlexList = flex.replace(new RegExp('\\s+'), ' ').split(' ')
      FlexList.forEach((item, index) => {
        res[index] = index < 2 ? Number(item) : item
      })
    }
    return res
  }
}

export function getNodeMarginOrPaddingData (dataValue: string) {
  let res: any = {}
  if (dataValue) {
    const values = dataValue.trim().split(new RegExp('\\s+'))
    switch (values.length) {
      case 1:
        res = { top: values[0], right: values[0], bottom: values[0], left: values[0] }
        break
      case 2:
        res = { top: values[0], right: values[1], bottom: values[0], left: values[1] }
        break
      case 3:
        res = { top: values[0], right: values[1], bottom: values[2], left: values[1] }
        break
      case 4:
        res = { top: values[0], right: values[1], bottom: values[2], left: values[3] }
        break
      default:
        break
    }
    Object.keys(res).forEach(key => {
      const exec = `${res[key]}`.match(/(\d+)(px)$/)
      if (exec && values.length > 1) {
        res[key] = getUnit(+exec[1])
      }
    })
  }
  return res
}


export function getUnit (val) {
  if (/\d+(vp)$/.test(val)) {
    return val
  } else if (isNumber(val) || /\d+px$/.test(val)) {
    return convertNumber2VP(parseFloat(val))
  }
  return val
}