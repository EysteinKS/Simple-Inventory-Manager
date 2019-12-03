import React, { useState } from "react";
import NewModal from "../../components/inventory/NewModals/NewModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/types";
import { addChange } from "../../redux/actions/reportsActions";
import { selectCustomerNames } from "../../redux/selectors/customersSelectors";
import { saveCreatedCustomer } from "../../redux/actions/customersActions";

interface NewCustomerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewCustomer: React.FC<NewCustomerProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const customerNames = useSelector(selectCustomerNames);
  const nextID = useSelector(
    (state: RootState) => state.customers.currentID + 1
  );

  const handleSave = () => {
    setMessage("");
    if (name.length < 1) {
      setMessage("Fyll inn navn!");
    } else if (customerNames.includes(name)) {
      setMessage("Fyll inn et unikt navn!");
    } else {
      dispatch(
        addChange({
          type: "NEW_CUSTOMER",
          id: nextID,
          name,
          section: "customers"
        })
      );
      dispatch(saveCreatedCustomer(name));
      onClose();
    }
  };

  return (
    <NewModal
      isOpen={isOpen}
      onClose={onClose}
      title={"Ny kunde"}
      name={name}
      setName={setName}
      message={message}
      onSave={handleSave}
    />
  );
};

export default NewCustomer;
