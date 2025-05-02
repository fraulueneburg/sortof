import { useState } from 'react'
import useListContext from '../hooks/useListContext'

import Link from './Link'
import Button from './Button'
import { Hand as IconHand } from '@phosphor-icons/react'
import { ArrowsClockwise as IconStartover } from '@phosphor-icons/react'

export default function Header() {
	const [startOver, setStartOver] = useState(false)
	const { step, setStep } = useListContext()

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
								onClick={() => setStartOver(true)}
								iconBefore={<IconStartover />}
							/>
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
