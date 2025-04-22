import { useContext } from 'react'
import { ListContext } from '../context/List.context'
import { Hand as IconHand } from '@phosphor-icons/react'
import Pill from './Pill'
import MenuColorMode from './MenuColorMode'

export default function Header() {
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
						<Pill title="Dump" status="active" />
					</li>
					<li>
						<Pill title="Sort" />
					</li>
					<li>
						<Pill title="Work" />
					</li>
				</ul>
			</nav>
			<aside>
				<nav>
					<ul>
						<li>
							<Pill title="Settings" />
						</li>
					</ul>
				</nav>
			</aside>
		</header>
	)
}
