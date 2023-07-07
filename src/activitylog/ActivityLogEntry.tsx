import LootEntry from "./entries/LootEntry";
import {ActivityLogItem, ActivityLogItemType} from "./types";
import CookEntry from "./entries/CookEntry";
import ToastEntry from "./entries/ToastEntry";

interface Props {
  item: ActivityLogItem;
}

const ActivityLogEntry = ({ item }: Props) => {
  switch (item.type) {
    case ActivityLogItemType.LOOT:
      return <LootEntry content={item.content} timestamp={item.timestamp}/>;
    case ActivityLogItemType.COOK:
      return <CookEntry content={item.content} timestamp={item.timestamp} />
    case ActivityLogItemType.TOAST:
      return <ToastEntry content={item.content} timestamp={item.timestamp} />
    default:
      return null;
  }
};

export default ActivityLogEntry;
