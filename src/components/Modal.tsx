import { useModal } from '../context/Modal.context'
import { X as IconClose } from '@phosphor-icons/react'

export default function Modal(props) {
	const { onCancel, onConfirm, modalClassName, description, image, alt, buttonLabel, buttonClass } = props
	const { isOpen, handleClose } = useModal()

	const handleClickOverlay = (event) => {
		if (event.target === event.currentTarget) {
			handleClose(event)
			onCancel && onCancel(event)
		}
	}

	return (
		<dialog onClick={handleClickOverlay} open={props.isOpen || isOpen} className={modalClassName}>
			<article>
				<header>
					<button
						aria-label="close"
						rel="prev"
						className="btn-close"
						onClick={(e) => {
							onCancel && onCancel(e)
							handleClose(e)
						}}>
						<IconClose />
					</button>
				</header>
				{(description || image) && (
					<section>
						{image && <img src={image} alt={alt} />}
						{description}
					</section>
				)}
				{buttonLabel ? (
					<footer>
						<button
							className={buttonClass}
							onClick={(e) => {
								onConfirm(e)
								handleClose(e)
							}}>
							{buttonLabel}
						</button>
					</footer>
				) : null}
			</article>
		</dialog>
	)
}
