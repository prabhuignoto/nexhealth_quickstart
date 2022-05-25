import { getData } from "../utils";

export async function apiGET({ url, onSuccess, onError }) {
  try {
    const request = await getData(url);
    const result = await request.json();

    if (result.code) {
      onSuccess && result.data && onSuccess(result.data);
    }
  } catch (error) {
    onError && onError(error);
  }
}
