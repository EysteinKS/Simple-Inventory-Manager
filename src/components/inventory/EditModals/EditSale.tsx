import React, { useState, useMemo } from 'react'
import { RootState, ISale } from '../../../redux/types';
import { useSelector, useDispatch } from 'react-redux';
import useEditableList from '../../../hooks/useEditableList';
import { addChange } from '../../../redux/actions/reportsActions';
import { isChanged, shouldLog } from '../../../constants/util';
import ReactModal from 'react-modal';
import OrderedProducts from '../OrderedProducts';
import SelectTarget from '../SelectTarget';
import EditModal, { OrderedProduct } from './EditModal';
import Names from '../../Names';
import Icons from '../../util/Icons';
import { StyledFooter, StyledDetails, ProductWithEdit, CenteredText, TargetWithEdit, EndText, IDText, StyledHeader } from './styles';
import { saveCreatedSale, saveEditedSale } from '../../../redux/actions/salesActions';
import useProducts from '../../../hooks/useProducts';

ReactModal.setAppElement("#root");

type TEditSale = {
  isOpen: boolean,
  close: () => void
}

type ViewTypes = "details" | "customer" | "products"

export default function EditSale({ isOpen, close }: TEditSale) {
  const current = useSelector((state: RootState) => state.sales.currentSale) as ISale
  const [products] = useProducts()
  const dispatch = useDispatch()

  const [customer, setCustomer] = useState()
  const [view, setView] = useState("details" as ViewTypes)

  const viewText = useMemo(() => {
    switch(view){
      case "details":
        return "Salg"
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
    let returnedSale: ISale = {
      saleID: current.saleID,
      customerID: Number(customer),
      dateOrdered: current.dateOrdered,
      dateSent: current.dateSent,
      ordered
    }
    if(current.isNew){
      dispatch(addChange({
        type: "NEW_SALE",
        id: returnedSale.saleID,
        section: "sales"
      }))
      dispatch(saveCreatedSale(returnedSale))
    } else {
      let isSaleChanged = isChanged(current, returnedSale)
      if(!isSaleChanged.isEqual){
        shouldLog("Changed loan content", isSaleChanged.changed)
        dispatch(addChange({
          type: "EDIT_SALE_INFO",
          id: returnedSale.saleID,
          section: "loans",
          changed: isSaleChanged.changed
        }))
        dispatch(saveEditedSale(returnedSale))
      }
    }
    close()
    setInit(false)
  }

  return (
    <EditModal
      isOpen={isOpen}
      label="Edit Sale"
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
        <IDText>ID: {current.saleID}</IDText>
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
          disabled={(customer === "new" || view === "customer" || ordered.length < 1)}
        >Lagre</button>
        <button onClick={() => {
          close()
          setInit(false)
        }}>Lukk</button>
      </StyledFooter>
    </EditModal>
  )
}