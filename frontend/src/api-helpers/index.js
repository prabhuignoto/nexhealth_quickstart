import { deleteData, getData, postData } from "../utils";

export async function apiGET({ url, onSuccess, onError }) {
  try {
    const request = await getData(url);
    const result = await request.json();

    if (result.code) {
      onSuccess && result.data && onSuccess(result.data);
    } else {
      onError && onError(result.error);
    }
  } catch (error) {
    onError && onError(error);
  }
}

export async function apiPOST({ url, data, onSuccess, onError }) {
  try {
    const request = await postData(url, data);
    const result = await request.json();

    if (result.code) {
      onSuccess && result.data && onSuccess(result.data);
    } else {
      onError && onError(result.error);
    }
  } catch (error) {
    onError && onError(error);
  }
}

export async function apiDELETE({ url, onSuccess, onError }) {
  try {
    const request = await deleteData(url);

    const result = await request.json();

    if (result.code) {
      onSuccess && result.data && onSuccess(result.data);
    } else {
      onError && onError(result.error);
    }
  } catch (error) {
    onError && onError(error);
  }
}
