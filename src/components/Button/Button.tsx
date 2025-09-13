import './button.scss'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

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
	const classNames = clsx(unstyled ? 'unstyled' : 'pill', size && `size-${size}`, className)

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
