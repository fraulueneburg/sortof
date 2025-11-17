import './modal.scss'
import { Button } from '../Button/Button'
import { XIcon as IconClose } from '@phosphor-icons/react'
import { useState } from 'react'

type ModalProps = {
	open: boolean
	title: string
	submitText: string
	submitAction: () => void
	cancelText?: string
}

export function Modal({ open, title, submitText, submitAction, cancelText = 'Cancel' }: ModalProps) {

	const handleClose = () => setIsOpen(false)

	return (
		<>
			<dialog open={isOpen}>
				<Button
					className="btn-cancel"
					title="close"
					hideTitle={true}
					iconBefore={<IconClose />}
					onClick={() => handleClose()}
				/>
			<h3 className="modal-title">{title}</h3>

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
		</>
	)
}
