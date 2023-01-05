import { api } from "../apis/axios";

const isLoggedin = async () => {
  try {
    const res = await api["get"]("/auth/isLoggedin");
    return res.status === 200;
  } catch (error) {
    return false;
  }
};
export { isLoggedin };
