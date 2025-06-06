import { useEffect } from 'react'

function useReloadPageOnPopState() {
	useEffect(() => {
		const handlePopState = (_e: PopStateEvent) => {
			window.location.reload()
		}

		window.addEventListener('popstate', handlePopState)

		return () => {
			window.removeEventListener('popstate', handlePopState)
		}
	}, [])
}

export default useReloadPageOnPopState
