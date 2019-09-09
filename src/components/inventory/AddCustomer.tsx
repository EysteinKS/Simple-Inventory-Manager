import React, { useState, useCallback, useEffect } from "react"
import { ICustomer } from "../../redux/types";
import { useDispatch } from "react-redux";
import { addChange } from "../../redux/actions/reportsActions";
import { saveCreatedCustomer } from "../../redux/actions/customersActions";
import Icons from "../util/Icons";

type TAddCustomer = {
  visible: boolean,
  close: (id: number) => void,
  customers: ICustomer[]
}

const AddCustomer = ({ visible, close, customers }: TAddCustomer) => {
  const [name, setName] = useState("");
  const [ID, setID] = useState();
  const dispatch = useDispatch();
  const save = useCallback(
    event => {
      event.preventDefault();
      dispatch(addChange({
        type: "NEW_CUSTOMER",
        id: ID,
        name,
        section: "customers"
      }))
      dispatch(saveCreatedCustomer(name));
      close(ID);
    },
    [dispatch, name, close, ID]
  );

  useEffect(() => {
    if(visible) {
      setID(customers.length + 1);
    }
  }, [visible, setID, customers]);

  return (
    <div
      style={{
        gridColumn: "2 / 3",
        marginTop: "5px",
        marginBottom: "20px",
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "center"
      }}
    >
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Navn"
        style={{
          width: "100"
        }}
      />
      <button
        onClick={e => save(e)}
        style={{
          width: "10vw",
          backgroundColor: "rgb(255, 220, 0)"
        }}
      >
        <Icons.NewFolder />
      </button>
    </div>
  );
};

export default AddCustomer