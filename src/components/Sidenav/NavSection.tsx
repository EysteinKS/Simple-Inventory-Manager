import React from 'react'
import { SectionItem, SectionIcon, SectionName } from './styles'
import { ISection } from './Sidenav'
import useLocation from '../../hooks/useLocation'
import { navigate } from '@reach/router'

interface IProps {
  section: ISection;
  close: () => void;
}

const NavSection: React.FC<IProps> = ({ section, close }) => {
  const { location } = useLocation()

  const current = React.useMemo(() => {
    return (location.pathname === section.linkTo)
  }, [location, section.linkTo])

  const onClick = () => {
    if(!current){
      navigate(section.linkTo)
      close()
    }
  }
  
  return (
    <SectionItem current={current} onClick={onClick}>
      <SectionIcon>{section.icon}</SectionIcon>
      <SectionName>{section.name}</SectionName>
    </SectionItem>
  )
}

export default NavSection