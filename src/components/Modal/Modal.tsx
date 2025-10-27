import './modal.scss'
import { Button } from '../Button/Button'
import { XIcon as IconClose } from '@phosphor-icons/react'
import { useState } from 'react'

type ModalProps = {
	open: boolean
	title?: string
	description: string
	submitText: string
	submitAction: (event: ButtonEvent) => void
	cancelText?: string
	cancelAction?: (event: ButtonEvent) => void
}

export default function Modal({ open, title, description, submitText, submitAction, cancelText, cancelAction }: ModalProps) {
	const [isOpen, setIsOpen] = useState(open)

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
					<Button title={submitText} onClick={() => console.log('foo')} />
					{cancelText && <Button title={cancelText} onClick={handleClose} />}
				</div>
			</dialog>
		</>
	)
}
