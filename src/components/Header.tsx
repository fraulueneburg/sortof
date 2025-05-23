import useListContext from '../hooks/useListContext'
import { nanoid } from 'nanoid'

import Link from './Link'
import Button from './Button'
import { HandIcon as IconHand } from '@phosphor-icons/react'
import { ArrowsClockwiseIcon as IconStartover } from '@phosphor-icons/react'

export default function Header() {
	const { step, setStep, setListsArr, setAllTasksArr } = useListContext()

	const startoverDescId = nanoid()

	const handleStartOver = () => {
		setListsArr([])
		setAllTasksArr([])
	}

	const handleStep = (navNum: number) => {
		setStep(navNum)
	}

	const checkCurrStep = (navNum: number) => {
		return step === navNum ? 'step' : undefined
	}

	return (
		<header id="page-header">
			<div className="logo">
				<Link title="sortOf" href="/" iconBefore={<IconHand />} />
			</div>
			<nav className="nav_main">
				<ol>
					<li>
						<Link title="Dump" onClick={() => handleStep(1)} ariaCurrent={checkCurrStep(1)} />
					</li>
					<li>
						<Link title="Sort" onClick={() => handleStep(2)} ariaCurrent={checkCurrStep(2)} />
					</li>
					<li>
						<Link title="Work" onClick={() => handleStep(3)} ariaCurrent={checkCurrStep(3)} />
					</li>
				</ol>
			</nav>
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
