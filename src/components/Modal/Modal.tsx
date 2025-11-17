import './modal.scss'
import { Button } from '../Button/Button'
import { XIcon as IconClose } from '@phosphor-icons/react'
import { useState } from 'react'

type ModalProps = {
	open: boolean
	title?: string
	description: string
	submitText: string
	submitAction: () => void
	cancelText?: string
}

export function Modal({ open, title, description, submitText, submitAction, cancelText = 'Cancel' }: ModalProps) {

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
				{title && <h3>{title}</h3>}
				{description && <p>{description}</p>}

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
