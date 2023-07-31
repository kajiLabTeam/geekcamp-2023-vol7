import { datetime } from "@components/type/type";

export function getDayFromDatetime(datetime: datetime): string {
  let day = datetime.slice(0, 10);
  day = day.replace("-", "年").replace("-", "月") + "日";
  return day;
}
