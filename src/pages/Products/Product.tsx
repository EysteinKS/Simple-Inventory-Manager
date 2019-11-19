import React, { useMemo } from "react";
import { StyledProduct } from "./styles";
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
import Buttons from "../../components/util/Buttons";
import { Tooltip } from "../../components/util/HoverInfo";
import { ItemData } from "../../styles/table";

type TProductWithEdit = {
  product: IProduct;
  edit: (id: number) => void;
  showHistory: (id: number) => void;
  columns: string;
  extended: boolean;
};

const Product: React.FC<TProductWithEdit> = ({
  product,
  edit,
  showHistory,
  columns,
  extended
}) => {
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const hasLoans = useSelector(hasActiveLoans);
  const category = categories[product.categoryID - 1].name;
  const { orders, sales, loans } = useSelector((state: RootState) => {
    const { orders, sales, loans } = state;
    return { orders, sales, loans };
  });
  let ordered = getAmount(orders.orders, product.productID);
  let reserved = getAmount(sales.sales, product.productID);
  let loaned = getAmount(loans.loans, product.productID);
  let amount = product.amount;

  const total = useMemo(() => {
    if (amount + ordered + reserved + loaned === 0) {
      return "-";
    } else {
      return amount + (ordered || 0) - (reserved || 0) - (loaned || 0);
    }
  }, [amount, ordered, reserved, loaned]);

  const handles = useMemo(() => {
    const handleString = `product_${product.productID}_handle_`;
    return {
      history: handleString + "history",
      edit: handleString + "edit"
    };
  }, [product.productID]);

  return (
    <StyledProduct columns={columns} active={product.active}>
      {extended && <ItemData>{product.productID}</ItemData>}
      <ItemData>{product.name}</ItemData>
      {extended && (
        <>
          <ItemData>{category}</ItemData>
          <ItemData>{amount || "-"}</ItemData>
          <OrderedWithInfo productID={product.productID} amount={ordered} />
          <ReservedWithInfo productID={product.productID} amount={reserved} />
          {hasLoans && (
            <LoansWithInfo productID={product.productID} amount={loaned} />
          )}{" "}
        </>
      )}
      <ItemData>{total || 0}</ItemData>
      <ItemData>
        {total < 0 && (
          <Warning
            style={{
              justifySelf: "start",
              alignSelf: "center",
              color: "#bd3737"
            }}
          />
        )}
      </ItemData>
      <div />
      <Buttons.Click
        data-tip
        data-for={handles.history}
        onClick={() => showHistory(product.productID)}
        border="bottom"
      >
        <Icons.History />
        <Tooltip handle={handles.history}>Historikk</Tooltip>
      </Buttons.Click>
      <Buttons.Click
        data-tip
        data-for={handles.edit}
        onClick={() => edit(product.productID)}
        border="bottom"
      >
        <Icons.Edit />
        <Tooltip handle={handles.edit}>Rediger</Tooltip>
      </Buttons.Click>
    </StyledProduct>
  );
};

export default Product;
