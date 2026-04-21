import { XIcon as IconClose } from '@phosphor-icons/react'

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
			<div className="content">
				<p>
					So, last time I counted, there was about 947.536.842 to do apps out there. There’s apps to organize your 4-hour
					workweek, your 12-week year, your 5-year-plan and the 365-day feeding schedule for your talking parrot. But among
					all of that, I have always missed one thing: An app to organize the now.
				</p>
				<p>
					You know, those days when you come home at 6pm and the dog needs walking, your hair is greasy, you have to prepare
					both dinner and a cake for tomorrows’s birthday and on top of that you ran out of sugar, toothpaste and parrot poop
					remover (yes, that’s a thing), your favourite houseplant needs emergency repotting and also you should really
					vacuum the floors. And that’s just ____
				</p>
				<p>
					So if you have 748 todos and trouble priorotizing, sortOf is here to help. Just dump all your todos on the page,
					then drag and drop them into lists. sortOf is lightweight and easy: No signup or login needed. Everything is stored
					neatly in your browser.
				</p>
				<p>
					This app was created with blood, sweat and React by <a href="https://github.com/fraulueneburg/">fraulueneburg</a>.
					Read all about the nerdy details over on{' '}
					<a href="https://github.com/fraulueneburg/sortof">the project’s github page</a>.
				</p>
			</div>
		</>
	)
}
