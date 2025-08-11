import './button.scss'
import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	title: string
	hideTitle?: boolean
	iconBefore?: ReactNode
	iconAfter?: ReactNode
	size?: 'sm' | 'md' | 'lg'
	unstyled?: boolean
}

export function Button({
	type = 'button',
	title,
	hideTitle,
	iconBefore,
	iconAfter,
	size,
	className,
	unstyled,
	...rest
}: ButtonProps) {
	const classNames = `${unstyled ? 'unstyled' : 'pill'}${size ? ` size-${size}` : ''}${className ? ` ${className}` : ''}`

	return (
		<>
			<button type={type} className={classNames} aria-label={rest['aria-label'] ?? title} {...rest}>
				{iconBefore}
				{!hideTitle && <span>{title}</span>}
				{iconAfter}
			</button>
		</>
	)
}
