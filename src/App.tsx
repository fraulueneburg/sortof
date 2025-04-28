import './assets/styles.scss'
import { Routes, Route } from 'react-router-dom'

import Layout from './pages/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Settings from './pages/Settings'

export default function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="/" element={<Home />}></Route>
					<Route path="/about" element={<About />}></Route>
					<Route path="/settings" element={<Settings />}></Route>
				</Route>
			</Routes>
		</>
	)
}
