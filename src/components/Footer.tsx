import Pill from './Pill'
import { ArrowUpRight as IconExternalLink } from '@phosphor-icons/react'

export default function Footer() {
	return (
		<>
			<footer>
				<nav>
					<ul>
						<li>
							<Pill title="About" link="/about" />
						</li>
						<li>
							<Pill title="Github" link="https://github.com/fraulueneburg/sortof" aria-label="sdfkl">
								<IconExternalLink weight="bold" aria-hidden="true" />
							</Pill>
						</li>
					</ul>
				</nav>
			</footer>
		</>
	)
}
