import React, { useState, useMemo } from 'react'
import { RootState, ILoan } from '../../../redux/types';
import { useSelector, useDispatch } from 'react-redux';
import useEditableList from '../../../hooks/useEditableList';
import { addChange } from '../../../redux/actions/reportsActions';
import { saveCreatedLoan, saveEditedLoan } from '../../../redux/actions/loansActions';
import { isChanged, shouldLog } from '../../../constants/util';
import ReactModal from 'react-modal';
import OrderedProducts from '../OrderedProducts';
import SelectTarget from '../SelectTarget';
import EditModal, { OrderedProduct } from './EditModal';
import Names from '../../Names';
import Icons from '../../util/Icons';
import { StyledFooter, StyledDetails, ProductWithEdit, CenteredText, TargetWithEdit, EndText, IDText, StyledHeader } from './styles';
import useProducts from '../../../hooks/useProducts';

ReactModal.setAppElement("#root");

type TEditLoan = {
  isOpen: boolean,
  close: () => void
}

type ViewTypes = "details" | "customer" | "products"

export default function EditLoan({ isOpen, close }: TEditLoan) {
  const current = useSelector((state: RootState) => state.loans.currentLoan) as ILoan
  const [products] = useProducts()
  const dispatch = useDispatch()

  const [customer, setCustomer] = useState()
  const [view, setView] = useState("details" as ViewTypes)

  const viewText = useMemo(() => {
    switch(view){
      case "details":
        return "Utlån"
      case "customer":
        return "Kunde"
      case "products":
        return "Produkter"
      default:
        return ""
    }
  }, [view])

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
    <EditModal
      isOpen={isOpen}
      label="Edit Loan"
      onClose={close}
    >
      <StyledHeader>
        {(view === "details")
          ? <br/>
          : <button onClick={() => setView("details")}><Icons.ArrowBack/></button>
        }
        <CenteredText>{viewText}</CenteredText>
      </StyledHeader>
      {(view === "details") &&
      <StyledDetails>
        <IDText>ID: {current.loanID}</IDText>
        <EndText>Kunde:</EndText>
        <TargetWithEdit>
          <p><Names target="customers" id={customer}/></p>
          <button onClick={() => setView("customer")}><Icons.Edit/></button>
        </TargetWithEdit>
        <ProductWithEdit>
          <CenteredText style={{ gridColumn: "2/3" }}>Produkter</CenteredText>
          <button onClick={() => setView("products")}><Icons.Edit/></button>
        </ProductWithEdit>
        <div style={{ gridColumn: "1/3" }}>
          {ordered.map(product => <OrderedProduct key={"ordered_product_" + product.productID} product={product}/>)}
        </div>
      </StyledDetails>}
      {(view === "customer") &&
      <SelectTarget type="customers" select={(id) => {
        setCustomer(id)
        setView("details")
      }}/>}
      {(view === "products") &&
      <OrderedProducts
        products={products}
        ordered={ordered}
        add={productID => addProduct({productID, amount: 1})}
        edit={(product, index) => editProduct(product, index)}
        remove={productID => removeProduct(productID)}
      />}
      <StyledFooter>
        <div/>
        <button 
          onClick={save} 
          disabled={(customer === "new" || view === "products" || view === "customer")}
        >Lagre</button>
        <button onClick={() => {
          close()
          setInit(false)
        }}>Lukk</button>
      </StyledFooter>
    </EditModal>
  )
}