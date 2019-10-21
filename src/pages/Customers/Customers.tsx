import React from 'react'
import EditModal from '../../components/inventory/EditModals/EditModal'

interface IProps {
  isOpen: boolean
  close: () => void
}

const Customers: React.FC<IProps> = ({ isOpen, close }) => {
  return (
    <EditModal
      isOpen={isOpen}
      label="Customers"
      onClose={close}
    >
      
    </EditModal>
  )
}

export default Customers