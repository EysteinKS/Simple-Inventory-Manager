import React, {useState, useEffect, useCallback, useMemo} from "react"
import { useSelector, useDispatch } from "react-redux"
import { saveCreatedProduct, saveEditedProduct } from "../../redux/actions/productsActions"
import { saveCreatedCategory } from "../../redux/actions/categoriesActions"
import ReactModal from "react-modal"
import Collapse from "@material-ui/core/Collapse"
import Icons from "../util/Icons"
import { RootState, ICategory, IProduct } from "../../redux/types";
import { addChange } from "../../redux/actions/reportsActions";
import { isChanged, shouldLog } from "../../constants/util";
ReactModal.setAppElement("#root");

//TODO
//MAKE SURE PRODUCT CAN ONLY BE DEACTIVATED IF
//NO ORDERS OR SALES

type TEditProduct = {
  isOpen: boolean,
  close: () => void
}

export default function EditProduct({ isOpen, close }: TEditProduct) {
  const current = useSelector((state: RootState) => state.products.currentProduct);
  const products = useSelector((state: RootState) => state.products.products);
  const categories = useSelector((state: RootState) => state.categories.categories)
  const dispatch = useDispatch();

  const [name, setName] = useState(current.name);
  const [category, setCategory] = useState(current.categoryID);
  const [amount, setAmount] = useState(current.amount);
  const [active, setActive] = useState(current.active);
  const [comments, setComments] = useState(current.comments)

  const [editAmount, setEditAmount] = useState(false)
  const [prevAmount, setPrevAmount] = useState(0)

  useEffect(() => {
    setComments(current.comments)
    // eslint-disable-next-line
  }, [isOpen])

  const [init, setInit] = useState(false);
  if (isOpen && !init) {
    setName(current.name);
    setCategory(current.categoryID);
    setAmount(current.amount);
    setActive(current.active);
    setInit(true);
  }

  const [newCategory, toggleNewCategory] = useState(false)
  
  useEffect(() => {
    if(category === "new"){
      toggleNewCategory(true)
    } else if (categories.length){
      toggleNewCategory(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, toggleNewCategory])

  let returnedProduct = {
    active: active || false,
    amount: Number(amount) || 0,
    categoryID: Number(category),
    comments: comments || "",
    name: name,
    productID: current.productID,
  } as IProduct

  const product = useMemo(() => 
    products[products.findIndex(i => i.productID === returnedProduct.productID)]
  , [products, returnedProduct])

  const isNew = (current.productID > products.length)

  const save = () => {
    if (isNew) {
      dispatch(addChange({
        type: "NEW_PRODUCT",
        name: returnedProduct.name,
        id: returnedProduct.productID,
        section: "products"
      }))
      dispatch(saveCreatedProduct(returnedProduct));
      close();
      setInit(false);
    } else {
      let productInStore = products[products.findIndex(i => i.productID === returnedProduct.productID)]
      let isProductChanged = isChanged(productInStore, returnedProduct)
      if(!isProductChanged.isEqual){
        shouldLog("Changed product info", isProductChanged.changed)
        dispatch(addChange({
          type: "EDIT_PRODUCT_INFO",
          name: returnedProduct.name,
          id: returnedProduct.productID,
          section: "products",
          changed: isProductChanged.changed
        }))
        dispatch(saveEditedProduct(returnedProduct));
      }
      close();
      setInit(false);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Edit Product"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={() => {
        close();
        setInit(false);
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
      <p style={{ padding: "10px" }}>ID: {current.productID}</p>
      <form style={{
        display: "grid",
        gridTemplateColumns: "50% 50%",
        justifyContent: "center",
        maxHeight: "60vh",
        padding: "1em"
      }} onSubmit={e => e.preventDefault()}>
        <label htmlFor="name">Navn</label>
        <input
          type="text"
          name="name"
          placeholder="Navn"
          value={name}
          onChange={event => setName(event.target.value)}
        />
        <label htmlFor="category">Kategori</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}>
          {categories.map((category)=> <option key={"category_menu_" + category.categoryID} value={category.categoryID}>{category.name}</option>)}
          <option value="new">...</option>
        </select>
        <Collapse in={newCategory} style={{
          gridColumn: "2/3"
        }}>{newCategory
          ? <AddCategory 
              visible={(category === "new")}
              categories={categories}  
              close={(ID) => {
                setCategory(ID)
                toggleNewCategory(false)
              }} 
            />
          : null}
          </Collapse>
        {isNew && <label htmlFor="amount">På lager</label>}
        {!isNew && <div style={{display: "grid", gridTemplateColumns: "80% 20%"}}>
          <label htmlFor="amount">På lager</label>
          <button onClick={() => {
              setPrevAmount(amount)
              setEditAmount(true)
          }}>Endre</button>
        </div>}
        <input
          type="tel"
          name="amount"
          value={amount}
          disabled={!isNew}
          onChange={event => 
            (!isNaN(event.target.value as any)) 
            ? setAmount(event.target.value.replace(/\s/g,''))
            : null
          }/>
        <label htmlFor="comments">Kommentar</label>
        <textarea name="comments" value={comments} onChange={e => setComments(e.target.value)}/>
        <label htmlFor="active">Aktiv</label>
        <input
          type="checkbox"
          name="active"
          checked={active}
          onChange={() => setActive(!active)}
        />
      </form>
      <div style={{ display: "grid", gridTemplateColumns: "60% 20% 20%" }}>
        <div/>
        <button onClick={save}>Lagre</button>
        <button
          onClick={() => {
            close();
            setInit(false);
          }}
        >
          Lukk
        </button>
      </div>
      {editAmount && <EditProductAmount 
        isOpen={editAmount}
        close={() => setEditAmount(false)}
        saveAndClose={() => {
          setEditAmount(false)
          close()
          setInit(false)
        }}
        prevAmount={prevAmount}
        product={product}
        returnedProduct={returnedProduct}
      />}
    </ReactModal>
  );
};

type TAddCategory = {
  visible: boolean,
  close: (id: number) => void,
  categories: ICategory[]
}

const AddCategory = ({ visible, close, categories }: TAddCategory) => {
  const [name, setName] = useState("")
  const [ID, setID] = useState() 
  const dispatch = useDispatch()
  const save = useCallback(
    (event) => {
      event.preventDefault()
      dispatch(addChange({
        type: "NEW_CATEGORY",
        id: ID,
        name,
        section: "categories"
      }))
      dispatch(saveCreatedCategory(name))
      close(ID)
    },
    [dispatch, name, close, ID],
  )
  useEffect(() => {
    if(visible){
      setID(categories.length + 1)
    } else if (!visible) {

    }
  }, [visible, setID, categories])

  return(
    <div style={{
      gridColumn: "2 / 3",
      marginTop: "5px",
      marginBottom: "20px",
      display: "flex",
      flexWrap: "nowrap",
      justifyContent: "center"
    }}>
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
        <Icons.NewFolder/>
      </button>
    </div>
  )
}

interface IAmountProps {
  isOpen: boolean
  close: () => void
  saveAndClose: () => void
  prevAmount: number
  product: IProduct
  returnedProduct: IProduct
}

const EditProductAmount: React.FC<IAmountProps> = ({ isOpen, close, saveAndClose, prevAmount, product, returnedProduct }) => {
  const [newAmount, setNewAmount] = useState(prevAmount)
  const [reason, setReason] = useState("")
  const dispatch = useDispatch()

  const save = () => {
    dispatch(addChange({
      type: "EDIT_PRODUCT_AMOUNT",
      name: returnedProduct.name,
      reason,
      id: returnedProduct.productID,
      section: "products",
      changed: [{
        key: "amount",
        oldValue: product.amount,
        newValue: Number(newAmount)
      }]
    }))
    dispatch(saveEditedProduct({...returnedProduct, amount: Number(newAmount)}))
    saveAndClose()
  }

  return(
    <ReactModal
        isOpen={isOpen}
        contentLabel="Edit product amount"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        onRequestClose={close}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)"
          },
          content: {
            top: "30vh",
            left: "20vw",
            right: "20vw",
            height: "40vh",
            padding: "1em",
            display: "grid",
            gridTemplateRows: "20% 60% 20%"
          }
        }}
        >
          <h3>Endre antall på lager</h3>
          <form style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr"
          }}>
            <label htmlFor="amount">På lager</label>
            <input name="amount" type="tel" value={newAmount} onChange={e => setNewAmount(Number(e.target.value))}/>
            <label htmlFor="reason">Årsak</label>
            <textarea name="reason" value={reason} onChange={e => setReason(e.target.value)}/>
          </form>
          <div style={{
            display: "grid",
            gridTemplateColumns: "60% 20% 20%"
          }}>
            <div/>
            <button 
              onClick={save}
              disabled={(prevAmount === newAmount) || (prevAmount === newAmount && reason.length < 1) || reason.length < 1}  
            >Lagre</button>
            <button onClick={close}>
              Lukk
            </button>
          </div>
        </ReactModal>
  )
}