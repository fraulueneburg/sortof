import { useState, useContext } from 'react'
import { ListContext } from '../context/List.context'
import { Sun as IconLightMode, LampPendant as IconSepiaMode, MoonStars as IconDarkMode } from '@phosphor-icons/react'

export default function MenuColorMode() {
	const { colorMode, setColorMode } = useContext(ListContext)
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const menuItems = [
		{ name: 'Light', id: 'light-mode', icon: <IconLightMode /> },
		{ name: 'Dark', id: 'dark-mode', icon: <IconDarkMode /> },
		{ name: 'Sepia', id: 'sepia-mode', icon: <IconSepiaMode /> },
	]

	const activeIcon = menuItems.find((obj) => obj.id === colorMode)?.icon

	const handleSelect = (event, item) => {
		const { id } = item
		const closingKeys = new Set(['Enter', ' ', 'Escape'])
		setColorMode(id)
		localStorage.setItem('colorMode', id)
		document.documentElement.classList.value = [...document.documentElement.classList]
			.filter((className) => !className.endsWith('-mode'))
			.concat(id)
			.join(' ')
		setIsMenuOpen(!closingKeys.has(event.key))
	}

	return (
		<>
			<div className="menu-wrapper">
				<button
					className="toggle-menu"
					type="button"
					onClick={() => setIsMenuOpen((prev) => !prev)}
					aria-haspopup="menu"
					aria-expanded={isMenuOpen}
					aria-controls="menu-color-mode">
					{activeIcon}
					<span className="sr-only">Color Mode: {colorMode}</span>
				</button>
				<ul role="menu" id="menu-color-mode" aria-label="Color Mode">
					{menuItems.map((item) => (
						<li key={item.id}>
							<input
								type="radio"
								id={item.id}
								name="color-mode"
								checked={item.id === colorMode}
								onChange={(event) => handleSelect(event, item)}
							/>
							<label htmlFor={item.id}>
								{item.icon}
								{item.name}
							</label>
						</li>
					))}
				</ul>
			</div>
		</>
	)
}
