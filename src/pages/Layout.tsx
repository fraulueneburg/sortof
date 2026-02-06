import { Outlet } from 'react-router-dom'
import { IconContext } from '@phosphor-icons/react'
import { ToDoContextWrapper, SettingsContextWrapper } from '../context/'
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
				<SettingsContextWrapper>
					<ToDoContextWrapper>
						<Header />
						<main>
							<Outlet />
						</main>
						<Footer />
					</ToDoContextWrapper>
				</SettingsContextWrapper>
			</IconContext.Provider>
		</>
	)
}
