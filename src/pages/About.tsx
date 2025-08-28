import { XIcon as IconClose } from '@phosphor-icons/react'
import { Button } from '../components'

export function About() {
	return (
		<>
			<h1>About</h1>
			<Button
				className="btn-icon-only"
				title="close page"
				hideTitle={true}
				iconBefore={<IconClose size="3rem" />}
				unstyled={true}
			/>
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
