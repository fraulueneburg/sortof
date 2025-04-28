import { createContext, useContext, useEffect, useState } from 'react'

const ModalContext = createContext({})
const useModal = () => useContext(ModalContext)

const ModalProvider = ({ children, ...props }) => {
	const isSSR = typeof window === 'undefined'
	const htmlTag = !isSSR && document.querySelector('html')
	const [isOpen, setIsOpen] = useState(false)
	const modalAnimationDuration = 400

	// Handle open
	const handleOpen = (event) => {
		event.preventDefault()
		if (htmlTag) {
			setIsOpen(true)
			htmlTag.classList.add('modal-is-open', 'modal-is-opening')
			setTimeout(() => {
				htmlTag.classList.remove('modal-is-opening')
			}, modalAnimationDuration)
		}
	}

	// Handle close
	const handleClose = (event) => {
		event.preventDefault()
		if (htmlTag) {
			htmlTag.classList.add('modal-is-closing')
			setTimeout(() => {
				setIsOpen(false)
				htmlTag.classList.remove('modal-is-open', 'modal-is-closing')
			}, modalAnimationDuration)
		}
	}

	// Handle escape key
	useEffect(() => {
		const handleEscape = (event) => {
			if (!isOpen) return
			if (event.key === 'Escape') {
				handleClose(event)
			}
		}
		window.addEventListener('keydown', handleEscape)
		return () => {
			window.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen])

	return (
		<ModalContext.Provider
			value={{
				isOpen,
				handleOpen,
				handleClose,
				...props,
			}}>
			{children}
		</ModalContext.Provider>
	)
}

export { ModalProvider, useModal }
