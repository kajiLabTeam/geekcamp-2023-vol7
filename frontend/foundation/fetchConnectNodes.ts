import { NodeConnectData } from "@/components/util/type";

export default async function fetchConnectNodes(rootId: number) {
  const response = await fetch(`/api/nodes/connect/${rootId}`);
  if (!response.ok) throw Error(`${response.status}: ${response.statusText}`);
  const data = await response.json() as NodeConnectData | null;

  return data;
}
