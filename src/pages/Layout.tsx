import { ToDoContextWrapper } from '../context/List.context'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { IconContext } from '@phosphor-icons/react'

export default function Layout() {
	return (
		<>
			<IconContext.Provider
				value={{
					'aria-hidden': 'true',
					weight: 'bold',
					size: 24,
				}}>
				<ToDoContextWrapper>
					<Header />
					<main>
						<Outlet />
					</main>
					<Footer />
				</ToDoContextWrapper>
			</IconContext.Provider>
		</>
	)
}
