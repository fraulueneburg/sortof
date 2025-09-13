import { XIcon as IconClose } from '@phosphor-icons/react'
import { Button } from '../components'

export function About() {
	return (
		<>
			<div className="content-header">
				<h1>About</h1>
				<a href="/" className="close-page">
					<span className="sr-only">close page</span>
					<IconClose size="3rem" />
				</a>
			</div>
			<p>
				Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
				magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
				gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
				elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos
				et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
				sit amet.
			</p>
		</>
	)
}
