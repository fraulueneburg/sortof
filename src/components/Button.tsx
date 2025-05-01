import { ReactNode } from 'react'

type ButtonProps = {
	title: string
	hideTitle?: boolean
	disabled?: boolean
	iconBefore?: ReactNode
	iconAfter?: ReactNode
	className?: string
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
	size?: 'sm' | 'md' | 'lg'
	unstyled?: boolean
	ariaHasPopup?: 'true' | 'false' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
	ariaControls?: string
	ariaExpanded?: boolean
}

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
	ariaControls,
	ariaHasPopup,
	ariaExpanded,
}: ButtonProps) {
	const classNames = `${unstyled ? 'unstyled' : 'pill'}${size ? ` size-${size}` : ''}${className ? ` ${className}` : ''}`

	return (
		<>
			<button
				aria-label={hideTitle ? title : undefined}
				className={classNames}
				disabled={disabled}
				aria-haspopup={ariaHasPopup}
				aria-controls={ariaControls}
				onClick={onClick}
				aria-expanded={ariaExpanded}>
				{iconBefore}
				{!hideTitle ? <span>{title}</span> : null}
				{iconAfter}
			</button>
		</>
	)
}
