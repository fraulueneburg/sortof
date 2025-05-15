import { ReactNode } from 'react'

type ButtonProps = {
	title: string
	hideTitle?: boolean
	disabled?: boolean
	iconBefore?: ReactNode
	iconAfter?: ReactNode
	className?: string
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	size?: 'sm' | 'md' | 'lg'
	unstyled?: boolean
	ariaHasPopup?: 'true' | 'false' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
	ariaControls?: string
	ariaDescribedBy?: string
	ariaExpanded?: boolean
	ariaLabel?: string
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
	ariaDescribedBy,
	ariaLabel,
}: ButtonProps) {
	const classNames = `${unstyled ? 'unstyled' : 'pill'}${size ? ` size-${size}` : ''}${className ? ` ${className}` : ''}`

	return (
		<>
			<button
				className={classNames}
				disabled={disabled}
				onClick={onClick}
				aria-controls={ariaControls}
				aria-describedby={ariaDescribedBy}
				aria-expanded={ariaExpanded}
				aria-haspopup={ariaHasPopup}
				aria-label={ariaLabel ? ariaLabel : title}>
				{iconBefore}
				{!hideTitle ? <span>{title}</span> : null}
				{iconAfter}
			</button>
		</>
	)
}
