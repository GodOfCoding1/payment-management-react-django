import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isLoggedin } from "../helpers/protected";

const Protected = ({ children }) => {
  const [isAuthenticated, setisAuthenticated] = useState(true);
  const [renderThis, setRenderThis] = useState(children);
  useEffect(() => {
    (async () => {
      const auth = await isLoggedin();
      setisAuthenticated(auth);
    })();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setRenderThis(<Navigate to="/login" replace />);
    }
  }, [isAuthenticated]);

  return renderThis;
};
export default Protected;
