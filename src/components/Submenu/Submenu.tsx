import './submenu.scss'
import { useState, useId, ReactNode, useEffect, useRef } from 'react'
import { Button } from '../Button'
import { DotsThreeIcon as FallbackMenuIcon } from '@phosphor-icons/react'

type SubmenuProps = {
	children: ReactNode
	title: string
	hideTitle?: boolean
}

export function Submenu({ children, title, hideTitle }: SubmenuProps) {
	const [isOpen, setIsOpen] = useState(false)
	const menuId = useId()
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false)
			}
		}
		const handleClickOutside = (event: MouseEvent | FocusEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}
		const listeners = [
			{ target: window, type: 'keydown', handler: handleEscape },
			{ target: document, type: 'mousedown', handler: handleClickOutside },
			{ target: document, type: 'focusin', handler: handleClickOutside },
		]

		listeners.forEach(({ target, type, handler }) => target.addEventListener(type, handler as EventListener))

		return () => {
			listeners.forEach(({ target, type, handler }) => target.removeEventListener(type, handler as EventListener))
		}
	}, [isOpen])

	return (
		<>
			<div className="submenu" ref={ref}>
				<Button
					title={title}
					hideTitle={hideTitle}
					iconBefore={<FallbackMenuIcon />}
					aria-controls={menuId}
					aria-expanded={isOpen}
					onClick={() => setIsOpen((prev) => !prev)}
				/>
				{isOpen && (
					<div className="dropdown" id={menuId}>
						{children}
					</div>
				)}
			</div>
		</>
	)
}
