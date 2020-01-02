import React, { useState } from "react";
import { ICustomer } from "../../redux/types";
import useAuthLocation from "../../hooks/useAuthLocation";
import EditModal from "../../components/inventory/EditModals/EditModal";
import {
  ModalHeader,
  TitleWrapper,
  ModalTitle,
  ModalButton,
  ModalContent,
  ModalFooter
} from "../../styles/modal";
import Icons from "../../components/util/Icons";
import { InputWrapper, InputLabel, TextInput } from "../../styles/form";
import { useDispatch } from "react-redux";
import { addChange } from "../../redux/actions/reportsActions";
import { saveEditedCustomer } from "../../redux/actions/customersActions";
import {
  addNotification,
  notifications
} from "../../redux/actions/notificationActions";

interface EditCustomerProps {
  customer: ICustomer;
  close: () => void;
}

const EditCustomer: React.FC<EditCustomerProps> = ({ customer, close }) => {
  const { color, secondary } = useAuthLocation();

  const [name, setName] = useState(customer.name);
  const dispatch = useDispatch();

  const save = () => {
    if (name !== customer.name && name.length > 0) {
      let returnedCustomer: ICustomer = {
        name,
        ...customer
      };
      dispatch(
        addChange({
          type: "EDIT_CUSTOMER_INFO",
          id: returnedCustomer.customerID,
          section: "customers",
          changed: [
            {
              key: "name",
              oldValue: customer.name,
              newValue: name
            }
          ]
        })
      );
      dispatch(saveEditedCustomer(returnedCustomer));
      dispatch(addNotification(notifications.addedChange()));
    }
    close();
  };

  return (
    <EditModal isOpen={Boolean(customer)} label="Edit customer" onClose={close}>
      <ModalHeader bckColor={color} padBottom="7px">
        <TitleWrapper>
          <ModalTitle>
            <Icons.Customers /> Kunde #{customer.customerID}{" "}
          </ModalTitle>
        </TitleWrapper>
        <ModalButton onClick={close}>
          <Icons.Close />
        </ModalButton>
      </ModalHeader>
      <ModalContent>
        <InputWrapper>
          <InputLabel>
            <Icons.Customers /> Kunde
          </InputLabel>
          <TextInput
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </InputWrapper>
      </ModalContent>
      <ModalFooter bckColor={secondary}>
        <ModalButton onClick={save} disabled={name === customer.name}>
          <Icons.Save />
        </ModalButton>
      </ModalFooter>
    </EditModal>
  );
};

export default EditCustomer;
