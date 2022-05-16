export const getHeaders = function (forAuth = false, token) {
  return {
    Authorization: `${forAuth ? process.env.API_KEY : "Bearer " + token}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.Nexhealth+json;version=2",
  };
};
