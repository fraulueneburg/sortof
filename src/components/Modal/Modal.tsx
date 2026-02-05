import './modal.scss'
import { Button } from '../Button/Button'
import { XIcon as IconClose } from '@phosphor-icons/react'
import { useEffect, useRef, useState, cloneElement, ReactElement, ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
	trigger: ReactElement<{ onClick?: () => void }>
	title: string
	children?: ReactNode
	submitText: string
	submitAction: () => void
	cancelText?: string
}

export function Modal({ trigger, title, children, submitText, submitAction, cancelText = 'Cancel' }: ModalProps) {
	const [isOpen, setIsOpen] = useState(false)
	const dialogRef = useRef<HTMLDialogElement>(null)
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const triggerRef = useRef<HTMLElement | null>(null)

	const handleOpen = () => {
		triggerRef.current = document.activeElement as HTMLElement
		setIsOpen(true)
	}

	const handleClose = () => {
		setIsOpen(false)
		triggerRef.current?.focus()
	}

	// focus trap
	useEffect(() => {
		if (!isOpen || !dialogRef.current) return

		const dialog = dialogRef.current
		dialog.showModal()

		document.body.style.overflow = 'hidden'
		closeButtonRef.current?.focus()

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault()
				handleClose()
			}

			if (e.key === 'Tab') {
				const focusable = dialog.querySelectorAll<HTMLElement>(
					"button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
				)
				const first = focusable[0]
				const last = focusable[focusable.length - 1]

				if (e.shiftKey && document.activeElement === first) {
					last.focus()
					e.preventDefault()
				} else if (!e.shiftKey && document.activeElement === last) {
					first.focus()
					e.preventDefault()
				}
			}
		}

		dialog.addEventListener('keydown', handleKeyDown)
		return () => {
			dialog.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = ''
			dialog.close()
		}
	}, [isOpen])

	// clone trigger so it opens modal
	const triggerWithHandler = cloneElement(trigger, {
		onClick: handleOpen,
	})

	const modalContent = isOpen ? (
		<dialog ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" className="modal">
			<Button
				ref={closeButtonRef}
				className="btn-cancel"
				title="Close"
				hideTitle={true}
				iconBefore={<IconClose />}
				onClick={handleClose}
			/>

			<h3 className="modal-title">{title}</h3>

			{children && <div className="modal-content">{children}</div>}

			<div className="btn-group">
				<Button
					title={submitText}
					onClick={() => {
						submitAction()
						handleClose()
					}}
				/>

				{cancelText && <Button title={cancelText} onClick={handleClose} />}
			</div>
		</dialog>
	) : null

	return (
		<>
			{triggerWithHandler}
			{createPortal(modalContent, document.body)}
		</>
	)
}
