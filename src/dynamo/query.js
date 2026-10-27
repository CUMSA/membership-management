import axios from "axios";
import { API_URL } from "../consts";

const scan = (data, auth, { signal } = {}) => {
  return axios
    .post(`${API_URL}/cumsa-registrant-scan`, data, {
      timeout: 15000,
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
    })
    .then((r) => r.data.message.Items);
};

export default scan;
