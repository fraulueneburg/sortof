import { useContext } from 'react'
import { ListContext } from '../context/List.context'
import { Export as IconExport, Trash as IconDelete, ArrowsClockwise as IconStartOver } from '@phosphor-icons/react'
import MenuColorMode from './MenuColorMode'

export default function Header() {
	const { allItemsArr, setAllItemsArr, deleteMode, setDeleteMode } = useContext(ListContext)

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
						<button onClick={handleStartOver}>
							<IconStartOver />
							<span className="sr-only">Start Over</span>
						</button>
						<button type="button" role="switch" aria-checked={deleteMode} onClick={() => setDeleteMode((prev) => !prev)}>
							<IconDelete />
							<span className="sr-only">Delete Mode</span>
						</button>
						<button>
							<IconExport />
							<span className="sr-only">Export List</span>
						</button>
					</>
				) : null}
				<MenuColorMode />
			</div>
		</header>
	)
}
