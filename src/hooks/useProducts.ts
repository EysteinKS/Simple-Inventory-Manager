import { useSelector } from "react-redux";
import { RootState, IProduct } from "../redux/types";
import { useMemo, useState, Dispatch, SetStateAction } from "react";

const useProducts = (): [IProduct[], Dispatch<SetStateAction<number[]>>] => {
  const products = useSelector((state: RootState) => state.products.products);
  const [supplierProducts, setSupplierProducts] = useState([] as number[]);

  const returnedProducts = useMemo(() => {
    if (supplierProducts.length > 0) {
      return products.filter(product =>
        supplierProducts.includes(product.productID)
      );
    } else {
      return products;
    }
  }, [products, supplierProducts]);

  return [returnedProducts, setSupplierProducts];
};

export default useProducts;
