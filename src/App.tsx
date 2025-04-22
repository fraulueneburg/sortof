import './assets/styles.scss'
import { ListContextWrapper } from './context/List.context'

import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
	return (
		<>
			<ListContextWrapper>
				<Header />
				<main>
					<h1>What do you need to do today?</h1>
					<p>hello</p>
				</main>
				<Footer />
			</ListContextWrapper>
		</>
	)
}
