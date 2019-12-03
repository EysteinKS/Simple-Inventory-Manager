import React, { useState, Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";

import ReactModal from "react-modal";
import { RootState, ICategory } from "../../redux/types";
ReactModal.setAppElement("#root");

type TClose = (event: React.MouseEvent | React.KeyboardEvent) => void;
type TBooleanState = Dispatch<SetStateAction<boolean>>;

export default function EditCategories({
  isOpen,
  close
}: {
  isOpen: boolean;
  close: TClose;
}) {
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const [isEditing, setEditing] = useState(false);

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Categories"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={close}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: "10"
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
      {isEditing ? (
        <EditCategory setEdit={setEditing} />
      ) : (
        <CategoryList categories={categories} />
      )}
    </ReactModal>
  );
}

interface ICategoryList {
  categories: ICategory[];
}

type TCategoryList = (categories: ICategory[]) => JSX.Element[];

const CategoryList = ({ categories }: ICategoryList) => {
  return (
    <>
      {categories.map((category, i) => (
        <Category category={category} key={i} />
      ))}
    </>
  );
};

const Category = ({ category }: { category: ICategory }) => {
  return (
    <div>
      <p>{category.name}</p>
      <button onClick={() => {}}>Rediger</button>
    </div>
  );
};

const EditCategory = ({ setEdit }: { setEdit: TBooleanState }) => {
  return null;
};
