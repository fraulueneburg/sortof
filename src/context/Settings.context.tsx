import { createContext, ReactNode, useEffect, useState } from 'react'

interface Settings {
	dimCompletedTasks: boolean
}

interface SettingsContextType {
	settings: Settings
	setSettings: React.Dispatch<React.SetStateAction<Settings>>
}

const DEFAULT_SETTINGS: Settings = {
	dimCompletedTasks: true,
}

const STORAGE_KEY = 'sortof-settings'

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const SettingsContextWrapper = ({ children }: { children: ReactNode }) => {
	const [settings, setSettings] = useState<Settings>(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			return stored ? JSON.parse(stored) : DEFAULT_SETTINGS
		} catch {
			return DEFAULT_SETTINGS
		}
	})

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
		} catch (error) {
			console.warn('Failed to save settings:', error)
		}
	}, [settings])

	return <SettingsContext.Provider value={{ settings, setSettings }}>{children}</SettingsContext.Provider>
}

export { SettingsContext, SettingsContextWrapper }
