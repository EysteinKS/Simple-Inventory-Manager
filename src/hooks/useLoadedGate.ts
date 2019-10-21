import { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import useGate from "./useGate";
import { RootState } from "../redux/types";

export default function useLodadedGate() {
  const authSelector = useSelector(
    (state: RootState) => state.auth,
    shallowEqual
  );
  const prodSelector = useSelector(
    (state: RootState) => state.products,
    shallowEqual
  );
  const catSelector = useSelector(
    (state: RootState) => state.categories,
    shallowEqual
  );
  const ordSelector = useSelector(
    (state: RootState) => state.orders,
    shallowEqual
  );
  const suppSelector = useSelector(
    (state: RootState) => state.suppliers,
    shallowEqual
  );
  const saleSelector = useSelector(
    (state: RootState) => state.sales,
    shallowEqual
  );
  const custSelector = useSelector(
    (state: RootState) => state.customers,
    shallowEqual
  );

  const isLoadingArr = useMemo(
    () => [
      authSelector.isLoading,
      prodSelector.isLoading,
      catSelector.isLoading,
      ordSelector.isLoading,
      suppSelector.isLoading,
      saleSelector.isLoading,
      custSelector.isLoading
    ],
    [
      authSelector.isLoading,
      prodSelector.isLoading,
      catSelector.isLoading,
      ordSelector.isLoading,
      suppSelector.isLoading,
      saleSelector.isLoading,
      custSelector.isLoading
    ]
  );

  const isLoadedArr = useMemo(
    () => [
      authSelector.isLoaded,
      prodSelector.isLoaded,
      catSelector.isLoaded,
      ordSelector.isLoaded,
      suppSelector.isLoaded,
      saleSelector.isLoaded,
      custSelector.isLoaded
    ],
    [
      authSelector.isLoaded,
      prodSelector.isLoaded,
      catSelector.isLoaded,
      ordSelector.isLoaded,
      suppSelector.isLoaded,
      saleSelector.isLoaded,
      custSelector.isLoaded
    ]
  );

  const loadingErrorArr = useMemo(
    () => [
      authSelector.loadingError,
      prodSelector.loadingError,
      catSelector.loadingError,
      ordSelector.loadingError,
      suppSelector.loadingError,
      saleSelector.loadingError,
      custSelector.loadingError
    ],
    [
      authSelector.loadingError,
      prodSelector.loadingError,
      catSelector.loadingError,
      ordSelector.loadingError,
      suppSelector.loadingError,
      saleSelector.loadingError,
      custSelector.loadingError
    ]
  );

  const isLoadingGate = useGate(isLoadingArr, "OR");
  const isLoadedGate = useGate(isLoadedArr, "AND");
  const loadingErrorGate = useGate(loadingErrorArr, "OR");

  return [isLoadingGate, isLoadedGate, loadingErrorGate];
}
