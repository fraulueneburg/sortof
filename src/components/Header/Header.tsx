import { useId } from 'react'

import { ArrowsClockwiseIcon as IconStartover, HandIcon as IconHand } from '@phosphor-icons/react'

import useToDoContext from '../../hooks/useToDoContext'
import { getInitialToDoData } from '../../utils/getInitialToDoData'

import { Button, Link, Modal } from '../../components'

import useSettingsContext from '../../hooks/useSettingsContext'

export function Header() {
	const { defaultListId, setToDoData, setTaskCount } = useToDoContext()

	const { settings, setSettings } = useSettingsContext()

	const startoverDescId = useId()
	const handleStartOver = () => {
		localStorage.removeItem('to-do-data')
		setToDoData(getInitialToDoData(defaultListId))
		setTaskCount(0)
	}

	const handleSettings = () => {
		console.log(settings)
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
							<Modal
								trigger={
									<Button
										title="Start over"
										hideTitle={true}
										aria-describedby={startoverDescId}
										iconBefore={<IconStartover />}
									/>
								}
								title={'Delete all tasks and start over?'}
								submitText={'Yes, start over'}
								submitAction={handleStartOver}
								cancelText={'No, thank you'}
							/>

							<p className="sr-only" id={startoverDescId}>
								This deletes all tasks and lists
							</p>
						</li>
						<li>
							<Modal
								trigger={<Button title="Settings" onClick={() => {}} />}
								title={'Settings'}
								submitText={'save settings'}
								submitAction={handleSettings}>
								<label>
									<input type="checkbox" />
									grey out completed tasks
								</label>
							</Modal>
						</li>
					</ul>
				</nav>
			</aside>
		</header>
	)
}
