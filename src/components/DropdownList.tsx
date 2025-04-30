import { useState } from 'react'

export default function DropdownList() {
	const [isExpanded, setIsExpanded] = useState(false)

	return (
		<>
			<div className="dropdown-list">
				<button
					type="button"
					className="toggle-color"
					aria-controls=""
					aria-expanded={isExpanded}
					onClick={() => setIsExpanded((prev) => !prev)}>
					<div className="color-option" style={{ color: 'var(--purple)' }}></div>
				</button>
				<ul>
					<li>purple</li>
					<li>green</li>
					<li>yellow</li>
					<li>blue</li>
				</ul>
			</div>
		</>
	)
}
