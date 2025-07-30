import { useId } from 'react'
import useToDoContext from '../hooks/useToDoContext'
import { getInitialToDoData } from '../utils/getInitialToDoData'

import Link from './Link'
import Button from './Button'
import { HandIcon as IconHand } from '@phosphor-icons/react'
import { ArrowsClockwiseIcon as IconStartover } from '@phosphor-icons/react'

export default function Header() {
	const { defaultListId, setToDoData, setTaskCount } = useToDoContext()

	const startoverDescId = useId()
	const handleStartOver = () => {
		sessionStorage.removeItem('to-do-data')
		setToDoData(getInitialToDoData(defaultListId))
		setTaskCount(0)
	}

	return (
		<header id="page-header">
			<div className="logo">
				<Link title="sortOf" href="/" iconBefore={<IconHand />} />
			</div>
			<aside>
				<nav>
					<ul>
						<li>
							<Button
								title="Start over"
								hideTitle={true}
								ariaDescribedBy={startoverDescId}
								onClick={handleStartOver}
								iconBefore={<IconStartover />}
							/>
							<p className="sr-only" id={startoverDescId}>
								This deletes all tasks and lists
							</p>
						</li>
						<li>
							<Button title="Settings" onClick={() => {}} />
						</li>
					</ul>
				</nav>
			</aside>
		</header>
	)
}
