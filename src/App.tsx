import './assets/scss/styles.scss'
import { Route, Routes } from 'react-router-dom'
import { Layout, Home, About } from './pages'

export default function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="/" element={<Home />}></Route>
					<Route path="/about" element={<About />}></Route>
				</Route>
			</Routes>
		</>
	)
}
