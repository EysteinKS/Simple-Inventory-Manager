import React, { useState, useEffect } from 'react'
import { RootState, ILoan } from '../../redux/types';
import { useSelector, useDispatch } from 'react-redux';
import useEditableList from '../../hooks/useEditableList';
import { addChange } from '../../redux/actions/reportsActions';
import { saveCreatedLoan, saveEditedLoan } from '../../redux/actions/loansActions';
import { isChanged, shouldLog } from '../../constants/util';
import ReactModal from 'react-modal';
import { Collapse } from '@material-ui/core';
import AddCustomer from './AddCustomer';
import OrderedProducts from './OrderedProducts';

ReactModal.setAppElement("#root");

type TEditLoan = {
  isOpen: boolean,
  close: () => void
}

export default function EditLoan({ isOpen, close }: TEditLoan) {
  const current = useSelector((state: RootState) => state.loans.currentLoan) as ILoan
  const customers = useSelector((state: RootState) => state.customers.customers)
  const dispatch = useDispatch()

  const [customer, setCustomer] = useState()
  const {
    list: ordered,
    add: addProduct,
    edit: editProduct,
    remove: removeProduct,
    replace: setOrdered
  } = useEditableList(current.ordered)

  const [init, setInit] = useState(false)
  if (isOpen && !init) {
    setCustomer(current.customerID)
    setOrdered(current.ordered)
    setInit(true)
  }

  const [newCustomer, toggleNewCustomer] = useState(false)
  useEffect(() => {
    if(!customers.length){
      toggleNewCustomer(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
  useEffect(() => {
    if (customer === "new") {
      toggleNewCustomer(true);
    } else if (customers.length) {
      toggleNewCustomer(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, toggleNewCustomer]);

  const save = () => {
    let returnedLoan: ILoan = {
      loanID: current.loanID,
      customerID: Number(customer),
      dateOrdered: current.dateOrdered,
      dateSent: current.dateSent,
      dateReceived: current.dateReceived,
      ordered
    }
    if(current.isNew){
      dispatch(addChange({
        type: "NEW_LOAN",
        id: returnedLoan.loanID,
        section: "loans"
      }))
      dispatch(saveCreatedLoan(returnedLoan))
    } else {
      let isLoanChanged = isChanged(current, returnedLoan)
      if(!isLoanChanged.isEqual){
        shouldLog("Changed loan content", isLoanChanged.changed)
        dispatch(addChange({
          type: "EDIT_LOAN_INFO",
          id: returnedLoan.loanID,
          section: "loans",
          changed: isLoanChanged.changed
        }))
        dispatch(saveEditedLoan(returnedLoan))
      }
    }
    close()
    setInit(false)
  }

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Edit loan"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={() => {
        close()
        setInit(false)
      }}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        },
        content: {
          top: "10vh",
          left: "5vw",
          right: "5vw",
          padding: "10px",
          display: "grid",
          gridTemplateRows: "10vh 60vh 10vh"
        }
      }}
    >
      <p style={{padding: "10px"}}>ID: {current.loanID}</p>
      <form
        style={{
          display: "grid",
          gridTemplateColumns: "50% 50%",
          justifyContent: "center",
          maxHeight: "60vh"
        }}
      >
        <label htmlFor="customer">Kunde</label>
        <select value={customer} onChange={e => setCustomer(e.target.value)}>
          {customers && customers.map(customer => (
            <option key={"customer_menu_" + customer.customerID} value={customer.customerID}>
              {customer.name}
            </option>
          ))}
          <option value="new">...</option>
        </select>
        <Collapse 
          in={newCustomer}
          style={{
            gridColumn: "2/3"
          }}
        >
          {newCustomer ? (
            <AddCustomer
              visible={(customer === "new")}
              customers={customers}
              close={id => {
                setCustomer(id)
                toggleNewCustomer(false)
              }}
            />
          ) : null}
        </Collapse>
        <OrderedProducts
          ordered={ordered}
          add={productID => addProduct({productID, amount: 1})}
          edit={(product, index) => editProduct(product, index)}
          remove={productID => removeProduct(productID)}
        />
      </form>
      <div style={{display: "grid", gridTemplateColumns: "60% 20% 20%"}}>
        <div/>
        <button onClick={save} disabled={(customer === "new")}>Lagre</button>
        <button onClick={() => {
          close()
          setInit(false)
        }}>
          Lukk
        </button>
      </div>
    </ReactModal>
  )
}
