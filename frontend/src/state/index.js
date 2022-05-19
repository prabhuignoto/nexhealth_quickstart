import { atom } from "recoil";

export const locationState = atom({
  key: "locationId",
  default: "",
});

export const apiState = atom({
  key: "apiState",
  default: {
    failed: false,
    message: "",
  },
});

export const subDomainState = atom({
  key: "subdomain",
  default: "",
});

export const locationsState = atom({
  key: "locations",
  default: [],
});
