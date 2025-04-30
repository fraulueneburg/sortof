import { ReactNode } from 'react'

export type TaskData = {
	_id: string
	title: string
	checked: boolean
	list: string
}

export type ListData = {
	_id: string
	title: string
	color: string
}

export type LinkProps = {
	title: string
	hideTitle?: boolean
	iconBefore?: ReactNode
	iconAfter?: ReactNode
	href: string
	target?: string
	onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
	ariaCurrent?: 'page' | 'step'
}

export type ButtonProps = {
	title: string
	hideTitle?: boolean
	disabled?: boolean
	iconBefore?: ReactNode
	iconAfter?: ReactNode
	className?: string
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
	size?: 'sm' | 'md' | 'lg'
	unstyled?: boolean
}

export type DropdownProps = {
	isOpen: boolean
	toggleButton: ReactNode
}
