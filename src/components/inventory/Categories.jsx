import React, {useState} from "react"
import {useSelector} from "react-redux"

import ReactModal from "react-modal"
ReactModal.setAppElement("#root")

export default ({ isOpen, close }) => {
  const categories = useSelector(state => state.categories.categories)
  const [isEditing, setEditing] = useState(false)

  return(
    <ReactModal
      isOpen={isOpen}
      contentLabel="Categories"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={close}
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
      <h3>Kategorier</h3>
      {isEditing
      ? <EditCategory setEdit={setEditing}/>
      : <CategoryList categories={categories} setEdit={setEditing}/>}
    </ReactModal>
  )
}

const CategoryList = ({ categories }) => {
  return categories.map((category, i)=> <Category category={category} key={i}/>)
}

const Category = ({ category }) => {
  return (
    <div>
      <p>{category.name}</p>
      <button onClick={() => {}}>Rediger</button>
    </div>
  )
}

const EditCategory = ({ category }) => {
  return null
}