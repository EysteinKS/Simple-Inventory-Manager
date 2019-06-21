import React, {useState, useEffect, useCallback} from "react"
import { useSelector, useDispatch } from "react-redux"
import { saveCreatedProduct, saveEditedProduct } from "../redux/actions/productsActions"
import { saveCreatedCategory } from "../redux/actions/categoriesActions"
import ReactModal from "react-modal"
import Collapse from "@material-ui/core/Collapse"
import Icons from "./Icons"
ReactModal.setAppElement("#root");

//TODO
//MAKE SURE PRODUCT CAN ONLY BE DEACTIVATED IF
//NO ORDERS OR SALES

export default function EditProduct({ isOpen, close }) {
  const current = useSelector(state => state.products.currentProduct);
  const products = useSelector(state => state.products.products);
  const categories = useSelector(state => state.categories.categories)
  const dispatch = useDispatch();

  const [name, setName] = useState(current.name);
  const [category, setCategory] = useState(current.categoryID);
  const [amount, setAmount] = useState(current.amount);
  const [active, setActive] = useState(current.active);
  const [comments, setComments] = useState(current.comments)

  useEffect(() => {
    setComments(current.comments)
    // eslint-disable-next-line
  }, [isOpen])

  const [init, setInit] = useState(false);
  if (isOpen && !init) {
    //console.log(current);
    setName(current.name);
    setCategory(current.categoryID);
    setAmount(current.amount);
    setActive(current.active);
    setInit(true);
  }

  const [newCategory, toggleNewCategory] = useState(false)

/*   useEffect(() => {
    console.log(categories)
    if(!categories.length){
      console.log("Setting toggleNewCategory(true)")
      toggleNewCategory(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]) */
  
  useEffect(() => {
    if(category === "new"){
      //console.log("Creating new category!")
      toggleNewCategory(true)
    } else if (categories.length){
      console.log("Setting toggleNewCategory(false)")
      toggleNewCategory(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, toggleNewCategory])

  let returnedProduct = {
    productID: current.productID,
    name: name,
    categoryID: Number(category),
    active: active,
    amount: Number(amount),
    comments: comments
  };

  const save = () => {
    //console.log("Current ID: ", current.productID);
    //console.log("Products length: ", products.length);
    if (current.productID > products.length) {
      dispatch(saveCreatedProduct(returnedProduct));
      close();
      setInit(false);
    } else {
      //console.log("Saving product: ", returnedProduct);
      dispatch(saveEditedProduct(returnedProduct));
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
          top: "20vh",
          left: "5vw",
          right: "5vw",
          bottom: "10vh"
        }
      }}
    >
      <p>ID: {current.productID}</p>
      <form style={{
        display: "grid",
        gridTemplateColumns: "50% 50%",
        justifyContent: "center"
      }}>
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
          {categories.map((category, key)=> <option key={key} value={category.categoryID}>{category.name}</option>)}
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
        <label htmlFor="amount">På lager</label>
        <input
          type="tel"
          name="amount"
          value={amount}
          onChange={event => 
            (!isNaN(event.target.value)) 
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
      <button onClick={save}>Lagre</button>
      <button
        onClick={() => {
          close();
          setInit(false);
        }}
      >
        Lukk
      </button>
    </ReactModal>
  );
};

const AddCategory = ({ visible, close, categories }) => {
  const [name, setName] = useState("")
  const [ID, setID] = useState() 
  const dispatch = useDispatch()
  const save = useCallback(
    (event) => {
      event.preventDefault()
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