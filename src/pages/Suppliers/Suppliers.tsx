import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, ISupplier } from "../../redux/types";
import useAuthLocation from "../../hooks/useAuthLocation";

import {
  TableWrapper,
  ListWrapper,
  TableContent,
  ContentHeader,
  TableHeader,
  getTableStyle,
  TWidth
} from "../../styles/table";
import {
  Title,
  HeaderButtons,
  HeaderButton,
  SortingKey,
  TDirections
} from "../../components/util/SectionHeader";
import Icons from "../../components/util/Icons";
import { Tooltip } from "../../components/util/HoverInfo";
import useSortableList from "../../hooks/useSortableList";
import NewSupplier from "./NewSupplier";
import Supplier from "./Supplier";
import { sort } from "../../constants/util";
import EditSupplier from "./EditSupplier";
import SupplierHistory from "./SupplierHistory";

const Suppliers = () => {
  const suppliers = useSelector(
    (state: RootState) => state.suppliers.suppliers
  );
  const { secondary } = useAuthLocation();

  const [sorting, setSorting] = useState([null, null] as any[]);
  const { sortedList, setList, sortFunc } = useSortableList(suppliers);
  useEffect(() => {
    setList(suppliers);
    /* eslint-disable-next-line */
  }, [suppliers]);
  const sortList = (dir: TDirections, index: number, func: Function) =>
    sortFunc(setSorting)(dir, index, func, sorting);

  const tableStyles = useMemo(() => {
    let data: TWidth[] = ["tiny", "large"];
    return getTableStyle(data, 2);
  }, []);

  const [isNewSupplierOpen, setNewSupplierOpen] = useState(false);
  const closeNewSupplier = () => setNewSupplierOpen(false);

  const handleNewSupplier = () => {
    setNewSupplierOpen(true);
  };

  const [editSupplier, setEditSupplier] = useState(null as ISupplier | null);
  const [historySupplier, setHistorySupplier] = useState(
    null as ISupplier | null
  );

  return (
    <TableWrapper>
      <TableHeader bckColor={secondary}>
        <Title>Leverandører</Title>
        <HeaderButtons>
          <HeaderButton
            onClick={handleNewSupplier}
            data-tip
            data-for={"supplier_header_add"}
          >
            <Icons.Add />
            <Tooltip handle={"supplier_header_add"}>Ny leverandør</Tooltip>
          </HeaderButton>
        </HeaderButtons>
      </TableHeader>
      <TableContent>
        <ContentHeader bckColor={secondary} columns={tableStyles.header}>
          <SortingKey
            onClick={dir => sortList(dir, 0, sort.by("supplierID", dir))}
            data-tip
            data-for={"supplier_header_id"}
          >
            #<Tooltip handle={"supplier_header_id"}>ID</Tooltip>
          </SortingKey>
          <SortingKey
            onClick={dir => sortList(dir, 0, sort.byName(dir))}
            data-tip
            data-for={"supplier_header_name"}
          >
            <Icons.Name />
            <Tooltip handle={"supplier_header_name"}>Navn</Tooltip>
          </SortingKey>
        </ContentHeader>
        <ListWrapper>
          {sortedList.map(s => (
            <Supplier
              key={"supplier_" + s.supplierID}
              supplier={s}
              history={() => setHistorySupplier(s)}
              edit={() => setEditSupplier(s)}
              columns={tableStyles.item}
            />
          ))}
        </ListWrapper>
      </TableContent>
      {isNewSupplierOpen && (
        <NewSupplier isOpen={isNewSupplierOpen} onClose={closeNewSupplier} />
      )}
      {editSupplier && (
        <EditSupplier
          supplier={editSupplier}
          close={() => setEditSupplier(null)}
        />
      )}
      {historySupplier && (
        <SupplierHistory
          supplier={historySupplier}
          close={() => setHistorySupplier(null)}
        />
      )}
    </TableWrapper>
  );
};

export default Suppliers;
