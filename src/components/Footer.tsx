import Link from './Link'
import { ArrowUpRight as IconExternalLink } from '@phosphor-icons/react'

export default function Footer() {
	return (
		<>
			<footer>
				<nav>
					<ul>
						<li>
							<Link title="About" href="/about" />
						</li>
						<li>
							<Link
								title="Github"
								href="https://github.com/fraulueneburg/sortof"
								iconAfter={<IconExternalLink />}
								target="_blank"
							/>
						</li>
					</ul>
				</nav>
			</footer>
		</>
	)
}
