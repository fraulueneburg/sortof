import { X as IconClose } from '@phosphor-icons/react'

export default function About() {
	return (
		<>
			<h1>About</h1>
			<a className="btn-icon-only" href="/" aria-label="close page">
				<IconClose size="3rem" />
			</a>
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
