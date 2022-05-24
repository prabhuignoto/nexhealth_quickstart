import { getData } from "../utils";

export async function apiGET(url, cb, onError) {
  try {
    const request = await getData(url);
    const result = await request.json();

    if (result.code) {
      cb && result.data && cb(result.data);
    }
  } catch (error) {
    onError && onError();
  }
}
