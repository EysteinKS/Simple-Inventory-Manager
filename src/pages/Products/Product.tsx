import React, { useMemo } from "react";
import { StyledProduct, ProductName, ProductCategory } from "./styles";
import {
  OrderedWithInfo,
  ReservedWithInfo,
  LoansWithInfo
} from "./ProductInfo";
import Icons from "../../components/util/Icons";
import Warning from "../../components/util/Warning";
import { useSelector } from "react-redux";
import { RootState, IProduct } from "../../redux/types";
import { hasActiveLoans } from "../../redux/selectors/loansSelectors";
import { getAmount } from "../../constants/util";

type TProductWithEdit = {
  product: IProduct;
  edit: (id: number) => void;
  showHistory: (id: number) => void;
  index: number;
};

const Product: React.FC<TProductWithEdit> = ({
  product,
  edit,
  showHistory,
  index
}) => {
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const hasLoans = useSelector(hasActiveLoans);
  const category = categories[product.categoryID - 1].name;
  let orders = useSelector((state: RootState) => state.orders.orders);
  let sales = useSelector((state: RootState) => state.sales.sales);
  let loans = useSelector((state: RootState) => state.loans.loans);
  let ordered = getAmount(orders, product.productID);
  let reserved = getAmount(sales, product.productID);
  let loaned = getAmount(loans, product.productID);
  let amount = product.amount;

  const total = useMemo(() => {
    if (amount + ordered + reserved + loaned === 0) {
      return "-";
    } else {
      return amount + (ordered || 0) - (reserved || 0) - (loaned || 0);
    }
  }, [amount, ordered, reserved, loaned]);

  return (
    <StyledProduct active={product.active} hasLoans={hasLoans} index={index}>
      <p>{product.productID}</p>
      <ProductName>{product.name}</ProductName>
      <ProductCategory>{category}</ProductCategory>
      <p>{amount || "-"}</p>
      <OrderedWithInfo productID={product.productID} amount={ordered} />
      <ReservedWithInfo productID={product.productID} amount={reserved} />
      {hasLoans && (
        <LoansWithInfo productID={product.productID} amount={loaned} />
      )}
      <p>{total || 0}</p>
      {total < 0 ? (
        <Warning style={{ justifySelf: "start", alignSelf: "center" }} />
      ) : (
        <div />
      )}
      <button onClick={() => showHistory(product.productID)}>H</button>
      <button onClick={() => edit(product.productID)}>
        <Icons.Edit />
      </button>
    </StyledProduct>
  );
};

export default Product;
