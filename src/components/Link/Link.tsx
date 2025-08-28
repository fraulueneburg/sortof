import { MouseEvent, ReactNode } from 'react'

type SharedProps = {
	title: string
	hideTitle?: boolean
	iconBefore?: ReactNode
	iconAfter?: ReactNode
	target?: string
	ariaLabel?: string
	ariaCurrent?: 'page' | 'step'
	className?: string
	size?: 'sm' | 'md' | 'lg'
}

type WithHref = {
	href: string
	onClick?: never
}

type WithOnClick = {
	onClick: (event: MouseEvent<HTMLAnchorElement>) => void
	href?: never
}

type LinkProps = SharedProps & (WithHref | WithOnClick)

export function Link({
	title,
	hideTitle,
	iconBefore,
	iconAfter,
	target,
	ariaCurrent,
	ariaLabel,
	className,
	size,
	href,
	onClick,
}: LinkProps) {
	const classNames = `pill${size ? ` size-${size}` : ''}${className ? ` ${className}` : ''}`

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		if (onClick) {
			event.preventDefault()
			onClick(event)
		}
	}

	return (
		<>
			<div className={classNames} aria-label={hideTitle ? title : undefined}>
				<a
					href={href || '#'}
					target={target}
					aria-current={ariaCurrent}
					aria-label={ariaLabel}
					onClick={onClick ? handleClick : undefined}>
					{iconBefore}
					{!hideTitle && <span>{title}</span>}
					{iconAfter}
				</a>
			</div>
		</>
	)
}
