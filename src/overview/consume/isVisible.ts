import { ConsumeItem } from "./OneClickConsume"
import { MessageOptions } from "./OneClickConsume"

export const isVisible = (item: ConsumeItem, amount: number) => {
  if (amount === 0) {
    return false
  } else if (item.message.message3 && item.message.message3num && item.message.message3 === MessageOptions.RETAIN && amount > item.message.message3num) {
    return true
  } else if (item.displayLimit && amount > item.displayLimit) {
    return true
  }
  return false
}