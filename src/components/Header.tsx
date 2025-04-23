import { useContext } from 'react'
import { ListContext } from '../context/List.context'
import { Hand as IconHand } from '@phosphor-icons/react'
import { ArrowsClockwise as IconStartover } from '@phosphor-icons/react'
import Pill from './Pill'

export default function Header() {
	const { allItemsArr, setAllItemsArr } = useContext(ListContext)

	const handleStartOver = () => {
		sessionStorage.setItem('todos', [])
		setAllItemsArr([])
	}

	return (
		<header>
			<div className="logo">
				<Pill title="sortOf" link="/">
					<IconHand weight="bold" />
				</Pill>
			</div>
			<nav className="nav_main">
				<ul>
					<li>
						<Pill title="Dump" link="/" status="active" />
					</li>
					<li>
						<Pill title="Sort" link="/sort" />
					</li>
					<li>
						<Pill title="Work" link="/work" />
					</li>
				</ul>
			</nav>
			<aside>
				<nav>
					<ul>
						<li>
							<Pill title="Start over" hideTitle="true" link="">
								<button className="button-icon-only" onClick={handleStartOver}>
									<IconStartover weight="bold" />
								</button>
							</Pill>
						</li>
						<li>
							<Pill title="Settings" link="/settings" />
						</li>
					</ul>
				</nav>
			</aside>
		</header>
	)
}
