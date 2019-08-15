import React from 'react'
import Names from '../Names';
import { Changes, IChangeValue, IOrderedProduct } from '../../redux/types';
import styled from 'styled-components';

const NEW = [
  "NEW_PRODUCT", "NEW_CATEGORY", "NEW_ORDER", "NEW_SUPPLIER",
  "NEW_SALE", "NEW_CUSTOMER", "NEW_LOAN"
]

const newText = {
  NEW_PRODUCT: "Nytt produkt",
  NEW_CATEGORY: "Ny kategori",
  NEW_ORDER: "Ny bestilling",
  NEW_SUPPLIER: "Ny leverandør",
  NEW_SALE: "Nytt salg",
  NEW_CUSTOMER: "Ny kunde",
  NEW_LOAN: "Nytt utlån",
}

const EDIT_INFO = [
  "EDIT_PRODUCT_INFO", "EDIT_CATEGORY_INFO", 
  "EDIT_ORDER_INFO", "EDIT_SUPPLIER_INFO", 
  "EDIT_SALE_INFO", "EDIT_CUSTOMER_INFO", 
  "EDIT_LOAN_INFO"
]

const EDIT_PRODUCT_AMOUNT = "EDIT_PRODUCT_AMOUNT"

const editText = {
  EDIT_PRODUCT_INFO: "Redigert produkt",
  EDIT_CATEGORY_INFO: "Redigert kategori",
  EDIT_ORDER_INFO: "Redigert bestilling",
  EDIT_SUPPLIER_INFO: "Redigert leverandør",
  EDIT_SALE_INFO: "Redigert salg",
  EDIT_CUSTOMER_INFO: "Redigert kunde",
  EDIT_LOAN_INFO: "Redigert utlån",
  EDIT_PRODUCT_AMOUNT: "Redigert produktantall"
}

const SENT_OR_RECEIVED = [
  "SENT_SALE", "SENT_LOAN", 
  "RECEIVED_ORDER", "RECEIVED_LOAN"
]

const sentOrReceivedText = {
  SENT_SALE: "Salg sendt",
  SENT_LOAN: "Utlån sendt",
  RECEIVED_ORDER: "Bestilling mottatt",
  RECEIVED_LOAN: "Utlån mottatt"
}

const DELETE = ["DELETE_ORDER", "DELETE_SALE", "DELETE_LOAN"]

const deleteText = {
  DELETE_ORDER: "Bestilling slettet",
  DELETE_SALE: "Salg slettet",
  DELETE_LOAN: "Utlån slettet"
}

const typeText = {
  ...newText,
  ...editText,
  ...sentOrReceivedText,
  ...deleteText
}

interface IProps {
  change: Changes
}

interface MainProps extends IProps {
  index: number
}

type ChangeComponent = React.FC<IProps>

const ReportChanges: React.FC<MainProps> = ({ change, index }) => {
  const [isOpen, setOpen] = React.useState(false)

  const reportContent = React.useMemo(() => {
    const { type } = change
    if(NEW.includes(type)) {
      return <New change={change}/>
    } else if(EDIT_INFO.includes(type)){
      return <Edit change={change}/>
    } else if(type === EDIT_PRODUCT_AMOUNT){
      return <EditProductAmount change={change}/>
    } else if(SENT_OR_RECEIVED.includes(type)) {
      return <SentOrReceived change={change}/>
    } else if(DELETE.includes(type)) {
      return <Delete change={change}/>
    } else {
      return <p>Error!</p>
    }
  }, [change])

  return (
    <ListItem>
      <ItemHeader onClick={() => setOpen(!isOpen)}>
        <p>{index}</p>
        <p style={{placeSelf: "start"}}>{typeText[change.type]}</p>
      </ItemHeader>
      {isOpen && <ItemContent>{reportContent}</ItemContent>}
    </ListItem>)
}

const ListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr;
  border: 2px solid #ccc;
  margin-bottom: 1em;
`

const ItemHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  place-items: center;
  background-color: #ddd
  :hover {
    cursor: pointer
  }
`

const ItemContent = styled.div`
  padding: 0 5em;
  background-color: #fff;
`

const TargetInfo: ChangeComponent = ({ change, children }) => {
  const { doShowName, nameSection } = useName(change)

  return(
    <StyledInfo>
      <p>ID: {change.id}</p>
      {doShowName && <p>
        Navn: {<Names target={nameSection} id={change.id}/>}
      </p>}
      {children && <div style={{ gridColumn: "3 / 4" }}>{children}</div>}
    </StyledInfo>
  )
}

const StyledInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  place-items: start;
`

const New: ChangeComponent = ({ change }) => {
  return(
    <TargetInfo change={change}/>
  )
}


const Edit: ChangeComponent = ({ change }) => {
  return(
    <>
      <TargetInfo change={change}/>
      {("changed" in change) && <div>
        {change.changed.map((changed) => 
          <EditedKey key={"edited_key_" + changed.key} changed={changed}/>
        )}
      </div>}
    </>
  )
}

//TODO:
//CHECK IF KEY IS ORDERED
//IF ORDERED, MAKE LIST SHOWING UPDATED PRODUCTS AND AMOUNTS

const EditedKey: React.FC<{changed: IChangeValue}> = ({changed}) => {
  let oldValue, newValue
  const keyText = editKeyToString[changed.key]
  const sectionWithName = shouldGetName(changed.key)

  if(Array.isArray(changed.oldValue) && Array.isArray(changed.newValue)){
    return(
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr"
      }}>
        <p>Før</p>
        <p>Etter</p>
        <div>
          {changed.oldValue.map((prod: IOrderedProduct, i) => 
            <OrderedChange key={"old_change_" + i} product={prod} nullText="..."/>  
          )}
        </div>
        <div>
          {changed.newValue.map((prod: IOrderedProduct, i) => 
            <OrderedChange key={"new_change_" + i} product={prod} nullText="..."/>
          )}
        </div>
      </div>
    )
  }

  if(sectionWithName){
    oldValue = <Names target={sectionWithName} id={changed.oldValue}/>
    newValue = <Names target={sectionWithName} id={changed.newValue}/>
  } else {
    oldValue = String(changed.oldValue)
    newValue = String(changed.newValue)    
  }

  return(
    <div>
      <p>{keyText}: {oldValue} > {newValue}</p>
    </div>
  )
}

const editKeyToString: {[key: string]: string} = {
  name: "Navn",
  categoryID: "Kategori",
  customerID: "Kunde",
  supplierID: "Leverandør",
  ordered: "Bestilt",
  active: "Aktiv",
  comments: "Kommentar"
}

const shouldGetName = (key: string) => {
  const keysWithNames = ["categoryID", "customerID", "supplierID", "productID"]
  const keySections: {[key: string]: string} = {
    categoryID: "categories",
    customerID: "customers",
    supplierID: "suppliers",
    productID: "products"
  }
  if(keysWithNames.includes(key)){
    return keySections[key]
  } else {
    return false
  }
}

interface IOrderedChange {
  product: IOrderedProduct
  nullText: string
}

const OrderedChange = ({ product, nullText }: IOrderedChange) => {
  if(product == null){
    return(
      <p>{nullText}</p>
    )
  } else {
    return(
      <p>{product.amount}x <Names target={"products"} id={product.productID}/></p>
    )
  }
}


const EditProductAmount: ChangeComponent = ({ change }) => {
  let oldValue, newValue, reason
  if("changed" in change){
    oldValue = change.changed[0].oldValue
    newValue = change.changed[0].newValue
  }
  if("reason" in change){
    reason = change.reason
  }

  return(
    <>
      <TargetInfo change={change}/>
      <p>Antall: {oldValue} > {newValue}</p>
      {reason && <p>Årsak: {reason}</p>}
    </>
  )
}

const SentOrReceived: ChangeComponent = ({ change }) => {
  return(
    <>
      <TargetInfo change={change}/>
    </>
  )
}

const Delete: ChangeComponent = ({ change }) => {
  return(
    <>
      <TargetInfo change={change}/>
    </>
  )
}

const useName = (change: Changes) => {
  const showName = React.useMemo(() => {
    let doShowName = false
    let nameSection = ""
    const newType = change.type.split("_")[1]

    switch(newType){
      case "PRODUCT":
        doShowName = true
        nameSection = "products"
        break;
      case "SUPPLIER":
        doShowName = true
        nameSection = "suppliers"
        break;
      case "CUSTOMER":
        doShowName = true
        nameSection = "customers"
        break;
      case "CATEGORY":
        doShowName = true
        nameSection = "categories"
        break;
      default:
        break;
    }

    return {
      doShowName,
      nameSection
    }
  }, [change])

  return showName
}

export default ReportChanges
