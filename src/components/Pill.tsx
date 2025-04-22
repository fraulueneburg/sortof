import { Children } from 'react'

export default function Pill(props) {
	const { children, title, link, status } = props

	const renderTitle = title ? <span className="title">{title}</span> : <></>

	const renderContent = link ? (
		<a href={link}>
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
