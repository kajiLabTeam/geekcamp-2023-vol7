import { GraphData } from "./types";

export default async function fetchLinkNodes(currentId: number): Promise<GraphData> {
  // TODO: ちゃんとしたfetchに置き換える

  const data = {
    currentNode : {
      nodeId : currentId,
      name : "",
      articleId: 1234
    },
    connectNodes: [
      {
        nodeId : Math.random() * 1e10 | 0,
        name : "JavaScript",
        articleId: 31415
      },
      {
        nodeId : Math.random() * 1e10 | 0,
        name : "Next.js",
        articleId: 20394
      }
    ]
  };

  const nodes = data.connectNodes.map(v => ({
    id: v.nodeId,
    name: v.name,
    articleId: v.articleId,
    val: 10
  }));

  const links = nodes.map(({ id }) => ({
    source: currentId,
    target: id
  }));

  return { nodes, links };
}
