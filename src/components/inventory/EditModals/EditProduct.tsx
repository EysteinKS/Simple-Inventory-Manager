import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  saveCreatedProduct,
  saveEditedProduct
} from "../../../redux/actions/productsActions";
import { saveCreatedCategory } from "../../../redux/actions/categoriesActions";
import Icons from "../../util/Icons";
import { RootState, ICategory, IProduct } from "../../../redux/types";
import { addChange } from "../../../redux/actions/reportsActions";
import { isChanged, shouldLog } from "../../../constants/util";
import EditModal from "./EditModal";
import {
  ModalHeader,
  ModalTitle,
  ModalButton,
  ModalFooter,
  ModalContent,
  TitleWrapper
} from "../../../styles/modal";
import useAuthLocation from "../../../hooks/useAuthLocation";
import {
  InputWrapper,
  InputLabel,
  TextInput,
  SelectInput,
  OptionInput,
  CheckboxInput,
  TextareaInput,
  InputButton,
  InputWithButton,
  FakeInput
} from "../../../styles/form";
import {
  notifications,
  addNotification
} from "../../../redux/actions/notificationActions";

//TODO
//MAKE SURE PRODUCT CAN ONLY BE DEACTIVATED IF
//NO ORDERS OR SALES

type TEditProduct = {
  isOpen: boolean;
  close: () => void;
};

export default function EditProduct({ isOpen, close }: TEditProduct) {
  const current = useSelector(
    (state: RootState) => state.products.currentProduct
  ) as IProduct;
  const products = useSelector((state: RootState) => state.products.products);
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const dispatch = useDispatch();

  const { color, secondary } = useAuthLocation();

  const [name, setName] = useState(current.name);
  const [category, setCategory] = useState(
    current.categoryID || (0 as string | number)
  );
  const [amount, setAmount] = useState(current.amount);
  const [active, setActive] = useState(current.active);
  const [comments, setComments] = useState(current.comments);

  const [editAmount, setEditAmount] = useState(false);
  const [editReason, setEditReason] = useState("");
  const [newAmount, setNewAmount] = useState(current.amount);

  useEffect(() => {
    setComments(current.comments);
    // eslint-disable-next-line
  }, [isOpen]);

  const [init, setInit] = useState(false);
  if (isOpen && !init) {
    setName(current.name);
    if (categories.length > 0) {
      setCategory(current.categoryID);
    } else {
      setCategory("new");
    }
    setAmount(current.amount);
    setActive(current.active);
    setInit(true);
  }

  const [newCategory, toggleNewCategory] = useState(false);

  useEffect(() => {
    if (category === "new") {
      toggleNewCategory(true);
    } else if (categories.length) {
      toggleNewCategory(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, toggleNewCategory]);

  let returnedProduct = {
    active: active || false,
    amount: Number(amount) || 0,
    categoryID: Number(category),
    comments: comments || "",
    name: name,
    productID: current.productID
  } as IProduct;

  const isNew = current.productID > products.length;

  const savingDisabled = useMemo(() => {
    return name.length <= 0 || category === "new";
  }, [name, category]);

  const save = () => {
    if (isNew) {
      dispatch(
        addChange({
          type: "NEW_PRODUCT",
          name: returnedProduct.name,
          id: returnedProduct.productID,
          section: "products"
        })
      );
      dispatch(saveCreatedProduct(returnedProduct));
      dispatch(addNotification(notifications.addedChange()));
      close();
      setInit(false);
    } else {
      let productInStore =
        products[
          products.findIndex(i => i.productID === returnedProduct.productID)
        ];
      let isProductChanged = isChanged(productInStore, returnedProduct);
      if (!isProductChanged.isEqual) {
        shouldLog("Changed product info", isProductChanged.changed);
        dispatch(
          addChange({
            type: "EDIT_PRODUCT_INFO",
            name: returnedProduct.name,
            id: returnedProduct.productID,
            section: "products",
            changed: isProductChanged.changed
          })
        );
        dispatch(saveEditedProduct(returnedProduct));
        dispatch(addNotification(notifications.addedChange()));
      }
      close();
      setInit(false);
    }
  };

  const saveNewAmount = () => {
    dispatch(
      addChange({
        type: "EDIT_PRODUCT_AMOUNT",
        name: returnedProduct.name,
        reason: editReason,
        id: returnedProduct.productID,
        section: "products",
        changed: [
          {
            key: "amount",
            oldValue: amount,
            newValue: Number(newAmount)
          }
        ]
      })
    );
    dispatch(
      saveEditedProduct({ ...returnedProduct, amount: Number(newAmount) })
    );
    setAmount(newAmount);
    setEditAmount(false);
    close();
    setInit(false);
  };

  return (
    <EditModal
      isOpen={isOpen}
      label="Edit Product"
      onClose={() => {
        close();
        setInit(false);
      }}
    >
      <ModalHeader bckColor={color} padBottom="7px">
        <TitleWrapper>
          <ModalTitle>
            <Icons.Products /> Produkt #{current.productID}
          </ModalTitle>
        </TitleWrapper>
        <ModalButton
          onClick={() => {
            close();
            setInit(false);
          }}
        >
          <Icons.Close />
        </ModalButton>
      </ModalHeader>
      <ModalContent>
        <InputWrapper>
          <InputLabel>
            <Icons.Name /> Navn
          </InputLabel>
          <TextInput
            type="text"
            name="name"
            placeholder="Navn"
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </InputWrapper>
        <InputWrapper>
          <InputLabel>
            <Icons.FolderOpen /> Kategori
          </InputLabel>
          {newCategory ? (
            <AddCategory
              visible={category === "new"}
              categories={categories}
              close={ID => {
                setCategory(ID);
                toggleNewCategory(false);
              }}
            />
          ) : (
            <SelectInput
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(category => (
                <OptionInput
                  key={"category_menu_" + category.categoryID}
                  value={category.categoryID}
                >
                  {category.name}
                </OptionInput>
              ))}
              <OptionInput value="new">---Ny Kategori---</OptionInput>
            </SelectInput>
          )}
        </InputWrapper>
        <InputWrapper>
          <InputLabel>
            <Icons.Products /> På lager
          </InputLabel>
          {isNew ? (
            <TextInput
              type="tel"
              name="amount"
              value={amount}
              onChange={event =>
                !isNaN(event.target.value as any)
                  ? setAmount(Number(event.target.value.replace(/\s/g, "")))
                  : null
              }
            />
          ) : editAmount ? (
            <>
              <InputWithButton>
                <TextInput
                  type="tel"
                  name="amount"
                  required
                  value={newAmount}
                  onChange={event =>
                    !isNaN(event.target.value as any)
                      ? setNewAmount(
                          Number(event.target.value.replace(/\s/g, ""))
                        )
                      : null
                  }
                />
                <InputButton
                  bckColor="#eaeaea"
                  onClick={() => {
                    setNewAmount(amount);
                    setEditAmount(false);
                  }}
                >
                  <Icons.Close />
                </InputButton>
              </InputWithButton>
              <InputLabel>
                <Icons.Comment /> Årsak
              </InputLabel>
              <InputWithButton>
                <TextInput
                  name="reason"
                  value={editReason}
                  onChange={e => setEditReason(e.target.value)}
                />
                <InputButton
                  bckColor="#eaeaea"
                  disabled={newAmount === amount || editReason.length < 1}
                  onClick={saveNewAmount}
                >
                  <Icons.Save />
                </InputButton>
              </InputWithButton>
            </>
          ) : (
            <FakeInput
              onClick={() => {
                setEditAmount(true);
              }}
            >
              {amount}
              <Icons.Edit />
            </FakeInput>
          )}
        </InputWrapper>
        <InputWrapper inputHeight="60px">
          <InputLabel>
            <Icons.Comment /> Kommentar
          </InputLabel>
          <TextareaInput
            cols={30}
            rows={3}
            name="comments"
            value={comments}
            onChange={e => setComments(e.target.value)}
          />
        </InputWrapper>
        <InputWrapper>
          <InputLabel>
            <Icons.Visibility /> Aktiv
          </InputLabel>
          <CheckboxInput
            type="checkbox"
            name="active"
            checked={active}
            onChange={() => setActive(!active)}
          />
        </InputWrapper>
      </ModalContent>
      <ModalFooter bckColor={secondary}>
        <ModalButton onClick={save} disabled={savingDisabled}>
          <Icons.Save />
        </ModalButton>
      </ModalFooter>
    </EditModal>
  );
}

type TAddCategory = {
  visible: boolean;
  close: (id: number) => void;
  categories: ICategory[];
};

const AddCategory = ({ visible, close, categories }: TAddCategory) => {
  const [name, setName] = useState("");
  const [ID, setID] = useState();
  const dispatch = useDispatch();
  const save = useCallback(
    event => {
      event.preventDefault();
      dispatch(
        addChange({
          type: "NEW_CATEGORY",
          id: ID,
          name,
          section: "categories"
        })
      );
      dispatch(saveCreatedCategory(name));
      close(ID);
    },
    [dispatch, name, close, ID]
  );
  useEffect(() => {
    if (visible) {
      setID(categories.length + 1);
    } else if (!visible) {
    }
  }, [visible, setID, categories]);

  return (
    <InputWithButton columns="4fr 1fr 1fr">
      <TextInput
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Navn"
      />
      <InputButton onClick={e => save(e)} bckColor="#eaeaea">
        <Icons.Save />
      </InputButton>
      <InputButton onClick={() => close(0)} bckColor="#eaeaea">
        <Icons.Close />
      </InputButton>
    </InputWithButton>
  );
};
