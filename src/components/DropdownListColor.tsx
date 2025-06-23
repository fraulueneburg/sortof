import { useEffect, useMemo, useRef, useState } from 'react'
import { useId } from 'react'
import { colors } from '../constants/colors'

type DropdownListProps = {
	selected: string
	onColorChange: (color: string) => void
}

export default function DropdownListColor({ selected, onColorChange }: DropdownListProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [selectedColor, setSelectedColor] = useState(selected)

	const ref = useRef<HTMLDivElement>(null)
	const uniqueId = useId()

	const colorsArr = useMemo(() => colors, [])

	const handleColorChange = (newColor: string) => {
		onColorChange(newColor)
		setIsExpanded(false)
		setSelectedColor(newColor)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, color: string) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			handleColorChange(color)
		}
	}

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsExpanded(false)
			}
		}
		const handleClickOutside = (event: MouseEvent | FocusEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsExpanded(false)
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
	}, [isExpanded])

	useEffect(() => {
		setSelectedColor(selected)
	}, [selected])

	return (
		<>
			<div className="dropdown-list" ref={ref}>
				<button
					type="button"
					className="toggle-color"
					aria-controls={`color-listbox-${uniqueId}`}
					aria-haspopup="listbox"
					aria-expanded={isExpanded}
					onClick={() => setIsExpanded((prev) => !prev)}>
					<span className="sr-only">select color</span>
					<div className="color-option" style={{ color: `var(--${selectedColor})` }}></div>
				</button>
				{isExpanded && (
					<ul
						id={`color-listbox-${uniqueId}`}
						className="color-list"
						role="listbox"
						tabIndex={-1}
						aria-activedescendant={selectedColor}>
						{colorsArr.map((color) => (
							<li
								key={color.name}
								id={color.name}
								className="color-option"
								style={{ color: `var(--${color.name})` }}
								role="option"
								aria-selected={selectedColor === color.name}
								onClick={() => handleColorChange(color.name)}
								onKeyDown={(e) => handleKeyDown(e, color.name)}
								tabIndex={0}>
								<span className="sr-only">{color.name}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	)
}
