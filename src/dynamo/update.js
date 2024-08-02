import axios from "axios";
import { API_URL } from "../consts";

const update = (data, auth) =>
  axios.post(`${API_URL}/cumsa-registrant-update`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth}`,
    },
  });

export default update;
