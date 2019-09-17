import React, { useMemo, useState, useEffect } from 'react'
import { IOrderedProduct, RootState, IProduct } from '../../redux/types'
import { useSelector } from 'react-redux'
import { TDirections, SortingKey } from '../util/SectionHeader'
import styled from 'styled-components'
import useSortableList from '../../hooks/useSortableList'
import Names from '../Names'
import { sort } from '../../constants/util'
import Icons from '../util/Icons'

interface ISelectProduct {
  products: IProduct[]
  height?: string
  ignoreInactive?: boolean
  onSelect: (id: number) => void,
  selected: IOrderedProduct[]
}

const SelectProduct: React.FC<ISelectProduct> = ({ products, height = "55vh", ignoreInactive = false, onSelect, selected }) => {
  const [search, setSearch] = useState("")

  const list = useMemo(() => {
    let productList: IProduct[] = []
    if(ignoreInactive){
      productList = products
    } else {
      productList = products.filter(product => product.active)
    }
    if(Array.isArray(selected) && selected.length > 0){
      const selectedIDs = selected.map(sel => sel.productID)
      productList = productList.filter(product => !selectedIDs.includes(product.productID))
    }
    if(search.length > 0){
      productList = productList.filter(product => {
        let searchQuery = search.toLowerCase()
        let productName = product.name.toLowerCase()
        return (productName.includes(searchQuery))
      })
    }
    return productList
  }, [products, selected, search])

  const [sorting, setSorting] = useState([null, null] as any[])
  const { sortedList, setList, sortFunc } = useSortableList(list)
  const sortList = (dir: TDirections, index: number, func: Function) => sortFunc(setSorting)(dir, index, func, sorting)

  useEffect(() => {
    setList(list)
    /* eslint-disable-next-line */
  }, [list])

  return (
    <StyledWrapper height={height}>
      <SelectHeader setSearch={setSearch} sortList={sortList}/>
      <StyledList>
        {sortedList.map(prod => <Product key={"selectable_product_" + prod.productID} product={prod} onSelect={onSelect}/>)}
      </StyledList>
    </StyledWrapper>
  )
}

interface ISelectHeader {
  setSearch: (search: string) => void
  sortList: (dir: TDirections, index: number, func: Function) => void
}

const SelectHeader: React.FC<ISelectHeader> = ({ setSearch, sortList }) => {
  const categories = useSelector((state: RootState) => state.categories.categories)
  const [isSearching, setSearching] = useState(false)
  const [input, setInput] = useState("")

  const spanTwo = { gridColumn: "span 2", padding: "none" }
  const search = (str: string) => {
    setInput(str)
    setSearch(str)
  }

  if(isSearching){
    return(
      <StyledHeader>
        <SearchText>Søk</SearchText>
        <SearchInput type="text" value={input} onChange={e => search(e.target.value)}/>
        <SearchButton onClick={() => setSearching(false)}><Icons.Done/></SearchButton>
      </StyledHeader>
    )
  }

  return(
    <StyledHeader>
      <SortingKey style={spanTwo} onClick={dir => sortList(dir, 0, sort.byName(dir))}><Icons.FormatQuote/></SortingKey>
      <SortingKey style={spanTwo} onClick={dir => sortList(dir, 0, sort.byCategory(categories, dir))}><Icons.FolderOpen/></SortingKey>
      <SearchButton onClick={() => setSearching(true)}><Icons.Search/></SearchButton>
    </StyledHeader>
  )
}

interface ProductProps {
  product: IProduct,
  onSelect: (id: number) => void
}
const Product = ({product, onSelect}: ProductProps) => {
  const { productID, name, categoryID } = product
  return(
    <div style={{display: "grid", gridTemplateColumns: "40% 40% 20%"}}>
      <CenteredText>{name}</CenteredText>
      <CenteredText><Names target="categories" id={categoryID}/></CenteredText>
      <button onClick={(e) => {
        e.preventDefault()
        onSelect(productID)
      }}>Velg</button>
    </div>
  )
}

const StyledWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: 1fr 10fr;
  height: ${(props: { height: string }) => props.height}
`

const StyledHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  height: 5vh;
`

const SearchText = styled.p`
  margin: 0;
  place-self: center;
`

const CenteredText = styled.p`
  text-align: center;
`

const SearchButton = styled.button`
`

const SearchInput = styled.input`
  grid-column: span 3
`

const StyledList = styled.div`
  overflow-y: overlay;
  max-height: 50vh;
`

export default SelectProduct
