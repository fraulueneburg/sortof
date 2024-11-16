import { useContext } from 'react'
import { ListContext } from '../context/List.context'

export default function Header() {
	const { allItemsArr, setAllItemsArr } = useContext(ListContext)

	const handleStartOver = () => {
		sessionStorage.setItem('todos', [])
		setAllItemsArr([])
	}

	return (
		<header>
			<div className="logo">👏 sortOf</div>
			<div style={{ display: 'flex' }}>
				{allItemsArr.length > 0 ? (
					<>
						<button onClick={handleStartOver}>Start Over</button>
						<button>Delete Items</button>
						<button>Export List</button>
					</>
				) : null}
				<nav>
					<input type="radio" id="auto-mode" name="color-mode" />
					<label htmlFor="auto-mode">Auto</label>
					<input type="radio" id="dark-mode" name="color-mode" />
					<label htmlFor="dark-mode">Dark Mode</label>
					<input type="radio" id="light-mode" name="color-mode" />
					<label htmlFor="light-mode">Light Mode</label>
					<input type="radio" id="sepia-mode" name="color-mode" />
					<label htmlFor="sepia-mode">Sepia</label>
				</nav>
			</div>
		</header>
	)
}
