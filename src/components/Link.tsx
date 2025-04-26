import { LinkProps } from '../types'

export default function Link({ title, hideTitle, iconBefore, iconAfter, href, target, ariaCurrent, onClick }: LinkProps) {
	return (
		<>
			<div className="pill" aria-label={hideTitle ? title : undefined}>
				<a href={href} target={target} aria-current={ariaCurrent} onClick={onClick}>
					{iconBefore}
					{!hideTitle ? <span>{title}</span> : null}
					{iconAfter}
				</a>
			</div>
		</>
	)
}
