import React, { useEffect, useState } from "react";
import Login from "./Login";
import { ReactComponent as X } from "../styles/icon/modal/close.svg";
import { Modal, ModalBackground, ModalCloseButton } from "../styles/style";

const ModalOpen = ({
  viewModal
}) => {
  
  // const [isModalOpen , setIsModalOpen]= useState(false)

  // const viewModal = () => {
  //   setIsModalOpen((prev) => !prev)
  // }

const [modalContent, setModalContent] = useState();
  
useEffect(() => {
  setModalContent(<Login setModalContent={setModalContent}/>)
    // document.body.style.cssText = `position: fixed; top: 0px`
  return () => {
    const scrollY = document.body.style.top
    document.body.style.cssText = `position: ""; top: "";`
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
  }
}, [])

  return (

      <ModalBackground>
            <Modal>
                <ModalCloseButton onClick={viewModal}>
                    <X  style={{ right: "0" }} />
                </ModalCloseButton>
              {modalContent}
            </Modal>
        </ModalBackground>

  );
};


export default ModalOpen;
