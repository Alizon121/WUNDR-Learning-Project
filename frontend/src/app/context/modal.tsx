"use client"
import React, { createContext, useRef, useState, ReactNode, useContext, RefObject } from 'react'
import ReactDOM from "react-dom"

type ModalContextType = {
    modalRef: RefObject<HTMLDivElement | null>;
    modalContent: ReactNode | null;
    setModalContent: (content: ReactNode | null) => void;
    setOnModalClose: (callback: (() => void) | null) => void;
    closeModal: () => void;
}

type ModalProviderProps = {
    children: ReactNode
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)
ModalContext.displayName = "ModalContext"

export function ModalProvider({ children }: ModalProviderProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const [modalContent, setModalContent] = useState<ReactNode | null>(null)
    const [onModalClose, setOnModalClose] = useState<(() => void) | null>(null) //callback function for when modal is closing

    const closeModal = () => {
        setModalContent(null)

        if (typeof onModalClose === "function") {
            setModalContent(null)
            onModalClose()
        }
    }

    const contextValue: ModalContextType = {
        modalRef, //reference to modal div
        modalContent,
        setModalContent, //function to set the modal contnet
        setOnModalClose,
        closeModal
    }

    return (
        <>
            <ModalContext.Provider value={contextValue}>
                {children}
            </ModalContext.Provider>
            <div ref={modalRef}></div>
        </>
    )
}

export function Modal() {
    const context = useContext(ModalContext)
    if (!context) return null

    const { modalRef, modalContent, closeModal } = context

    if (!modalRef?.current || !modalContent) return null

    return ReactDOM.createPortal(
        <div id="modal">
            <div id='modal-background' onClick={closeModal} />
            <div id="modal-content">{modalContent}</div>
        </div>,
        modalRef.current
    )
}

export function useModal(): ModalContextType {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider")
    }
    return context
}
