export default function Pill(props) {
	const { children, title, link, status, hideTitle } = props
	const isExternalLink = link.includes('http')

	const renderTitle = title && !hideTitle ? <span className="title">{title}</span> : <></>

	const renderContent = link ? (
		<a href={link} target={isExternalLink ? '_blank' : '_self'} title={hideTitle ? title : ''}>
			{children}
			{renderTitle}
		</a>
	) : (
		<>
			<span>
				{children}
				{renderTitle}
			</span>
		</>
	)

	return (
		<>
			<div className={'pill' + (status ? ` ${status}` : '')}>{renderContent}</div>
		</>
	)
}
