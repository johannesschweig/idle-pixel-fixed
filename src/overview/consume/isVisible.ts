import { ConsumeItem } from "./OneClickConsume"
import { MessageOptions } from "./OneClickConsume"

export const isVisible = (item: ConsumeItem, amount: number) => {
  if (amount === 0) {
    return false
  // amount > retain
  } else if (item.message.message3 && item.message.message3num && item.message.message3 === MessageOptions.RETAIN && amount > item.message.message3num) {
    return true
  // amount < retain
  } else if (item.message.message3 && item.message.message3num && item.message.message3 === MessageOptions.RETAIN && amount <= item.message.message3num) {
    return false
  // max && no displaylimit 
  } else if (item.message.message3 && item.message.message3 === MessageOptions.MAX && !item.displayLimit) {
    return true
  // amount > displayLimit
  } else if (item.displayLimit && amount > item.displayLimit) {
    return true
  } else if (item.displayLimit && amount < item.displayLimit) {
    return false
  }
  // console.log(item, amount, item.message.message3 === MessageOptions.MAX) // should never be reached
  return false
}