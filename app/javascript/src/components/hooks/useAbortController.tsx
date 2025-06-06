import { useCallback, useState, useRef } from 'react'

function useAbortController() {
	const [abortController, setAbortController] = useState<AbortController | null>(null)
	const processIdRef = useRef<number>(0)

	const triggerAbort = useCallback((controller: AbortController | null = null) => {
		setAbortController((current) => {
			current?.abort()

			return controller
		})
	}, [])

	const handleWithAbortSignal = useCallback(
		async <T,>(handleProcessing: (signal: AbortSignal) => Promise<T> | null | undefined) => {
			const controller = new AbortController()

			triggerAbort(controller)
			processIdRef.current += 1
			const processId = processIdRef.current

			try {
				const result = await handleProcessing(controller.signal)

				if (processId === processIdRef.current) {
					processIdRef.current = 0
					setAbortController(null)

					return result
				}

				return null
			} catch {
				return null
			}
		},
		[triggerAbort],
	)

	return { handleWithAbortSignal, isLoading: !!abortController, setAbortController, triggerAbort }
}

export default useAbortController
