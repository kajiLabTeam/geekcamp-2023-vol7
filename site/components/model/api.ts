import { Technology } from "@components/type/type";

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

async function getTechs(): Promise<Technology[]> {
  const url = new URL("techs", baseURL);

  const techs = await fetcher<Technology[]>(url.toString())
    .then((techs) => techs)
    .catch((err) => {
      console.log(err);
      return [];
    });

  return techs;
}

export { getTechs };
