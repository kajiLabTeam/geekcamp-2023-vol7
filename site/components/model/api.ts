import { Node, Technology } from "@components/type/type";

const baseURL = "example.com/";

const wrap = <T>(task: Promise<Response>): Promise<T> => {
  return new Promise((resolve, reject) => {
    task
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((json) => {
              resolve(json);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const fetcher = <T = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> => {
  return wrap<T>(fetch(input, init));
};

export async function getTechs(): Promise<Node[]> {
  const url = new URL("techs", baseURL);

  const nodes = await fetcher<Node[]>(url.toString())
    .then((nodes) => nodes)
    .catch((err) => {
      console.log(err);
      return [] as Node[];
    });

  return nodes;
}

export async function getTechInfo(id: number): Promise<Technology | null> {
  const url = new URL("tech", baseURL);

  const info = await fetcher<Technology>(url.toString(), {
    headers: { id: id.toString() },
  })
    .then((info) => info)
    .catch((err) => {
      console.log(err);
      return null;
    });

  return info;
}
