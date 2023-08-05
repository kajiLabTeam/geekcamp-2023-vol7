// 指定した時間待機する
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
