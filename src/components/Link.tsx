import { ReactNode, MouseEvent } from 'react'

type SharedProps = {
	title: string
	hideTitle?: boolean
	iconBefore?: ReactNode
	iconAfter?: ReactNode
	target?: string
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

export default function Link({
	title,
	hideTitle,
	iconBefore,
	iconAfter,
	target,
	ariaCurrent,
	className,
	size,
	href,
	onClick,
}: LinkProps) {
	const classNames = `pill${size ? ` size-${size}` : ''}${className ? ` ${className}` : ''}`

	return (
		<>
			<div className={classNames} aria-label={hideTitle ? title : undefined}>
				<a href={href || '#	'} target={target} aria-current={ariaCurrent} onClick={onClick}>
					{iconBefore}
					{!hideTitle ? <span>{title}</span> : null}
					{iconAfter}
				</a>
			</div>
		</>
	)
}
