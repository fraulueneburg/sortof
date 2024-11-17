import { useState, useContext } from 'react'
import { ListContext } from '../context/List.context'
import {
	Sun as IconLightMode,
	SunHorizon as IconSepiaMode,
	MoonStars as IconDarkMode,
	CloudMoon as IconAutoMode,
} from '@phosphor-icons/react'

export default function MenuColorMode() {
	const { colorMode, setColorMode } = useContext(ListContext)
	const [colorMenuActive, setColorMenuActive] = useState(false)

	const colorMenuItems = [
		{ name: 'Auto', id: 'auto-mode', icon: <IconAutoMode /> },
		{ name: 'Dark', id: 'dark-mode', icon: <IconDarkMode /> },
		{ name: 'Light', id: 'light-mode', icon: <IconLightMode /> },
		{ name: 'Sepia', id: 'sepia-mode', icon: <IconSepiaMode /> },
	]

	const activeColorModeIcon = colorMenuItems.find((obj) => obj.name === colorMode)?.icon

	return (
		<>
			<div className="menu-wrapper">
				<button
					className="toggle-menu"
					type="button"
					onClick={() => setColorMenuActive((prev) => !prev)}
					aria-haspopup="menu"
					aria-expanded={colorMenuActive}
					aria-controls="menu-color-mode"
					tabindex="0">
					{activeColorModeIcon}
					<span className="sr-only">Color Mode: {colorMode}</span>
					{}
				</button>
				<ul role="menu" id="menu-color-mode" aria-label="Color Mode" tabindex="-1">
					{colorMenuItems.map((item) => (
						<li>
							<input
								type="radio"
								id={item.id}
								name="color-mode"
								checked={item.name === colorMode}
								onClick={() => setColorMode(item.name)}
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
