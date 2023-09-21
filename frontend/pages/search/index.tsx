import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";

export default function Search() {
  const [_, setIsFirst] = useLocalStorage({
    key: "isFirst",
    defaultValue: true,
  });

  useEffect(() => {
    setIsFirst(false);
  }, [setIsFirst]);

  return <div>検索</div>;
}
