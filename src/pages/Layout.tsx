import { ListContextWrapper } from '../context/List.context'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Layout() {
	return (
		<>
			<ListContextWrapper>
				<Header />
				<main>
					<Outlet />
				</main>
				<Footer />
			</ListContextWrapper>
		</>
	)
}
