import { ButtonProps } from '../types'

export default function Button({
	title,
	hideTitle,
	iconBefore,
	iconAfter,
	onClick,
	size,
	disabled,
	className,
	unstyled,
}: ButtonProps) {
	const classNames = `${unstyled ? 'unstyled' : 'pill'}${size ? ` size-${size}` : ''}${className ? ` ${className}` : ''}`

	return (
		<>
			<button className={classNames} aria-label={hideTitle ? title : undefined} onClick={onClick} disabled={disabled}>
				{iconBefore}
				{!hideTitle ? <span>{title}</span> : null}
				{iconAfter}
			</button>
		</>
	)
}
