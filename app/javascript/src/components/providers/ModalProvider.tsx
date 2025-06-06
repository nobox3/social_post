import { useMemo, createContext, ReactNode } from 'react'

import useModal from 'src/components/providers/useModal'

type ModalProviderValue = Omit<ReturnType<typeof useModal>, 'modalComponent'>

export const ModalContext = createContext<ModalProviderValue>({
	closeModal: () => {},
	showModal: () => {},
})

type Props = {
	children: ReactNode
}

function ModalProvider({ children }: Props) {
	const { closeModal, modalComponent, showModal } = useModal()

	const providerValue = useMemo<ModalProviderValue>(() => {
		return { closeModal, showModal }
	}, [closeModal, showModal])

	return (
		<>
			{modalComponent}
			<ModalContext.Provider value={providerValue}>{children}</ModalContext.Provider>
		</>
	)
}

export default ModalProvider
