import './button.scss'
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import clsx from 'clsx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	title: string
	hideTitle?: boolean
	iconBefore?: ReactNode
	iconAfter?: ReactNode
	size?: 'sm' | 'md' | 'lg'
	unstyled?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ type = 'button', title, hideTitle, iconBefore, iconAfter, size, className, unstyled, ...rest }, ref) => {
		const classNames = clsx(unstyled ? 'unstyled' : 'pill', size && `size-${size}`, className)

		return (
			<button ref={ref} type={type} className={classNames} aria-label={rest['aria-label'] ?? title} {...rest}>
				{iconBefore}
				{!hideTitle && <span>{title}</span>}
				{iconAfter}
			</button>
		)
	}
)
