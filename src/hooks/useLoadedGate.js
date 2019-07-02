import {useMemo, useEffect} from "react"
import {useSelector, shallowEqual} from "react-redux"
import useGate from "./useGate"

export default function useLodadedGate() {
  const authSelector = useSelector(state => state.auth, shallowEqual)
  const prodSelector = useSelector(state => state.products, shallowEqual)
  const catSelector = useSelector(state => state.categories, shallowEqual)
  const ordSelector = useSelector(state => state.orders, shallowEqual)
  const suppSelector = useSelector(state => state.suppliers, shallowEqual)
  const saleSelector = useSelector(state => state.sales, shallowEqual)
  const custSelector = useSelector(state => state.customers, shallowEqual) 
  
  const isLoadingArr2 = useMemo(() => [
    authSelector.isLoading,
    prodSelector.isLoading, catSelector.isLoading, 
    ordSelector.isLoading, suppSelector.isLoading,
    saleSelector.isLoading, custSelector.isLoading
  ], [
    authSelector.isLoading,
    prodSelector.isLoading, catSelector.isLoading,
    ordSelector.isLoading, suppSelector.isLoading,
    saleSelector.isLoading, custSelector.isLoading
  ])

  const isLoadedArr2 = useMemo(() => [
    authSelector.isLoaded,
    prodSelector.isLoaded, catSelector.isLoaded,
    ordSelector.isLoaded, suppSelector.isLoaded,
    saleSelector.isLoaded, custSelector.isLoaded
  ], [
    authSelector.isLoaded,
    prodSelector.isLoaded,catSelector.isLoaded,
    ordSelector.isLoaded, suppSelector.isLoaded,
    saleSelector.isLoaded, custSelector.isLoaded
  ])

  const loadingErrorArr2 = useMemo(() => [
    authSelector.loadingError,
    prodSelector.loadingError, catSelector.loadingError,
    ordSelector.loadingError, suppSelector.loadingError,
    saleSelector.loadingError, custSelector.loadingError
  ], [
    authSelector.loadingError,
    prodSelector.loadingError, catSelector.loadingError,
    ordSelector.loadingError, suppSelector.loadingError,
    saleSelector.loadingError, custSelector.loadingError
  ])

  const isLoadingGate = useGate(isLoadingArr2, "OR", "isLoading");
  const isLoadedGate = useGate(isLoadedArr2, "AND", "isLoaded");
  const loadingErrorGate = useGate(loadingErrorArr2, "OR", "loadingError");

  useEffect(() => {
    //console.log(`isLoadingGate: ${isLoadingGate}, isLoadedGate: ${isLoadedGate}, loadingErrorGate: ${loadingErrorGate}`)
  }, [isLoadingGate, isLoadedGate, loadingErrorGate])

  return [isLoadingGate, isLoadedGate, loadingErrorGate]
}