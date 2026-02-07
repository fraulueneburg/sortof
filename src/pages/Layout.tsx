import { Outlet } from 'react-router-dom'
import { IconContext } from '@phosphor-icons/react'
import { ToDoProvider, SettingsProvider } from '../context/'
import { Header, Footer } from '../components'

export function Layout() {
	return (
		<>
			<IconContext.Provider
				value={{
					'aria-hidden': 'true',
					weight: 'bold',
					size: 24,
				}}>
				<SettingsProvider>
					<ToDoProvider>
						<Header />
						<main>
							<Outlet />
						</main>
						<Footer />
					</ToDoProvider>
				</SettingsProvider>
			</IconContext.Provider>
		</>
	)
}
