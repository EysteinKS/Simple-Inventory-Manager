import store from "store";
import { useDispatch } from "react-redux";
import { setDemo } from "../redux/actions/authActions";

const demoKey = "demo";

const useDemo = () => {
  const dispatch = useDispatch();

  const demoLogin = () => {
    dispatch(setDemo(true));
    store.set(demoKey, true);
  };

  const demoLogout = () => {
    dispatch(setDemo(false));
    store.set(demoKey, false);
  };

  const isDemo = () => store.get(demoKey);

  return {
    demoLogin,
    demoLogout,
    isDemo
  };
};

export default useDemo;
