import axios from "axios";
import { API_URL } from "../consts";

const scan = (data, auth) => {
  console.log(auth);
  return axios
    .post(`${API_URL}/cumsa-registrant-scan`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
    })
    .then((r) => r.data.message.Items);
};

export default scan;
