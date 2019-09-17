import React, { useMemo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { RootState, ICategory, ICustomer, ISupplier, IChangeTypes } from '../../redux/types';
import useSortableList from '../../hooks/useSortableList';
import styled from 'styled-components';
import useSearch from '../../hooks/useSearch';
import { SortingKey, TDirections } from '../util/SectionHeader';
import Icons from '../util/Icons';
import { sort } from '../../constants/util';

import { saveCreatedCustomer } from '../../redux/actions/customersActions';
import { saveCreatedCategory } from '../../redux/actions/categoriesActions';
import { saveCreatedSupplier } from '../../redux/actions/suppliersActions';
import { addChange } from '../../redux/actions/reportsActions';

/**
 * Used by EditModals to select targets such as supplier, category and customer
 * Able to add new of each
 */

interface IProps {
  type: "categories" | "customers" | "suppliers"
  select: (id: number) => void
}

type TargetsType = ICategory[] | ICustomer[] | ISupplier[]
type ItemTypes = ICategory | ICustomer | ISupplier


const SelectTarget: React.FC<IProps> = ({type, select}) => {
  const targets = useSelector((state: RootState) => state[type][type]) as TargetsType

  const idKey = useMemo(() => {
    switch(type){
      case "categories":
        return "categoryID"
      case "customers":
        return "customerID"
      default:
        return "supplierID"
    }
  }, [type])

  //SEARCH & SORT
  const searchFilter = (item: ItemTypes, search: string) => item.name.includes(search)
  const [searched, setSearch, setSearchList] = useSearch(targets, searchFilter)

  useEffect(() => {
    setSearchList(targets)
    /* eslint-disable-next-line */
  }, [targets])

  const [sorting, setSorting] = useState([null, null] as any[])
  const { sortedList, setList, sortFunc } = useSortableList(searched)

  useEffect(() => {
    setList(searched)
    /* eslint-disable-next-line */
  }, [searched])

  const sortList = (dir: TDirections, index: number, func: Function) => sortFunc(setSorting)(dir, index, func, sorting)
  
  return (
    <StyledWrapper>
      <TargetHeader setSearch={setSearch} sortList={sortList} idKey={idKey}/>
      <ScrollableList>
        {sortedList.map((item) => <TargetItem key={"select_" + item.name} item={item} select={select}/>)}
        <AddItem targets={targets} type={type}/>
      </ScrollableList>
    </StyledWrapper>
  )
}

interface HeaderProps {
  setSearch: (search: string) => void
  sortList: (dir: TDirections, index: number, func: Function) => void
  idKey: string
}

const TargetHeader: React.FC<HeaderProps> = ({ setSearch, sortList, idKey }) => {
  const [isSearching, setSearching] = useState(false)
  const [input, setInput] = useState("")

  useEffect(() => {
    setSearch(input)
    /* eslint-disable-next-line */
  }, [input])

  if(isSearching){
    return(
      <StyledHeader>
        <CenteredText>Søk</CenteredText>
        <input type="text" value={input} onChange={e => setInput(e.target.value)}/>
        <SearchButton onClick={() => setSearching(false)}><Icons.Done/></SearchButton>
      </StyledHeader>
    )
  }

  return(
    <StyledHeader>
      <SortingKey onClick={dir => sortList(dir, 0, sort.by(idKey, dir))}>#</SortingKey>
      <SortingKey onClick={dir => sortList(dir, 1, sort.byName(dir))}><Icons.FormatQuote/></SortingKey>
      <SearchButton onClick={() => setSearching(true)}><Icons.Search/></SearchButton>
    </StyledHeader>
  )
}

interface ItemProps {
  item: ItemTypes
  select: (id: number) => void
}

const TargetItem: React.FC<ItemProps> = ({ item, select }) => {

  const ID = useMemo(() => {
    if((item as ICategory).categoryID){
      return (item as ICategory).categoryID
    } else if ((item as ICustomer).customerID){
      return (item as ICustomer).customerID
    } else if ((item as ISupplier).supplierID){
      return (item as ISupplier).supplierID
    } else {
      return 0
    }
  }, [item])

  const name = useMemo(() => {
    return item.name
  }, [item])

  return(
    <StyledTargetItem>
      <CenteredText>{ID}</CenteredText>
      <CenteredText>{name}</CenteredText>
      <button onClick={() => select(ID)}>Velg</button>
    </StyledTargetItem>
  )
}

interface AddItemProps {
  targets: TargetsType
  type: "categories" | "customers" | "suppliers"
}

const AddItem: React.FC<AddItemProps> = ({ targets, type }) => {
  const [doAdd, setAdd] = useState(false)
  const [name, setName] = useState("")
  const dispatch = useDispatch()

  const ID = targets.length + 1

  const { changeType, saveAction } = useMemo((): {changeType: IChangeTypes, saveAction: Function} => {
    switch(type){
      case "categories":
        return { changeType: "NEW_CATEGORY", saveAction: saveCreatedCategory }
      case "customers":
        return { changeType: "NEW_CUSTOMER", saveAction: saveCreatedCustomer }
      case "suppliers":
        return { changeType: "NEW_SUPPLIER", saveAction: saveCreatedSupplier }
      default:
        return { changeType: "NEW_CATEGORY", saveAction: (name: string) => {}}
    }}, [type])

  const save = () => {
    dispatch(addChange({
      type: changeType,
      id: ID,
      name,
      section: type
    }))
    dispatch(saveAction(name))
    setAdd(false)
    setName("")
  }

  if(doAdd){
    return(
      <AddWrapper>
        <CenteredText>{ID}</CenteredText>
        <AddInput type="text" value={name} onChange={e => setName(e.target.value)}/>
        <button onClick={save}><Icons.Save/></button>
        <button onClick={() => {
          setAdd(false)
          setName("")
        }}><Icons.Clear/></button>
      </AddWrapper>
    )
  }

  return(
    <AddButton onClick={() => setAdd(true)}>+</AddButton>
  )
}

const StyledWrapper = styled.div`
  background-color: #eee;
  border: 2px solid #ddd;
  border-radius: 15px;
`

const StyledHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  height: 60px;
  background-color: #eee;
  border-bottom: 1px solid #ddd;
  border-radius: 15px 15px 0 0;
`

const CenteredText = styled.p`
  text-align: center;
`

const SearchButton = styled.button`
  border-radius: 0 15px 0 0;
`

const StyledTargetItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  height: 50px;
  background-color: #f8f8f8;
  :nth-child(2n){
    background-color: #fff;
  }
`

const AddButton = styled.button`
  height: 50px;
  background-color: #fff;
  border-color: #ddd
`

const AddWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 10fr 1fr 1fr;
  background-color: #f3f3f3;
`

const AddInput = styled.input`
  height: 50px;
`

const ScrollableList = styled.div`
  overflow-y: overlay;
  height: 50vh;
  max-height: 50vh;
  border-bottom: 1px solid #ddd;
`

export default SelectTarget