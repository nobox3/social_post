import { useCallback, useContext, useState } from 'react'

import useOnArrayStateChange from 'src/components/hooks/useOnArrayStateChange'
import { ProcessingContext } from 'src/components/providers/ProcessingProvider'
import Attachment from 'src/core/types/Attachment'

export type DeleteAttachmentParams = Record<string, unknown> & {
	attachment_id?: number
}

export type UseFileAttachReturn = {
	attachedFiles: Attachment[]
	currentCount: number
	handleAttachFiles: (files: File[]) => Promise<void>
	handleDeleteAttachment: (params?: DeleteAttachmentParams) => Promise<void>
	setAttachedFiles: (files: Attachment[]) => void
}

export type UseFileAttachParams = {
	attachFileApi: (id: number, params: { file: File }) => Promise<{ attachment: Attachment }>
	attachableId: number | undefined
	deleteAttachmentApi: (attachableId: number, params?: DeleteAttachmentParams) => Promise<void>
	initialFiles: Attachment[]
	onAttachFiles?: (attachableId: number | undefined, files: File[]) => Promise<number | undefined>
	onFileAttached?: (attachedFile: Attachment) => void | Promise<void>
	processingKey: string
}

function useFileAttach({
	attachableId, attachFileApi, deleteAttachmentApi, initialFiles,
	onAttachFiles, onFileAttached, processingKey,
}: UseFileAttachParams): UseFileAttachReturn {
	const { handleProcessing } = useContext(ProcessingContext)
	const [uploadingCount, setUploadingCount] = useState<number>(0)
	const [attachedFiles, setAttachedFiles] = useOnArrayStateChange<Attachment>(initialFiles || [])

	const handleAttachFileApi = useCallback(
		async (id: number, file: File) => {
			try {
				const { attachment } = await handleProcessing(
					processingKey, () => attachFileApi(id, { file }),
				)

				setAttachedFiles((current) => [...current, attachment])
				await onFileAttached?.(attachment)

				return await Promise.resolve()
			} catch (error) {
				return await Promise.reject(error)
			} finally {
				setUploadingCount((current) => current - 1)
			}
		},
		[attachFileApi, handleProcessing, onFileAttached, processingKey, setAttachedFiles],
	)

	const handleAttachFiles = useCallback(async (files: File[]) => {
		const id = onAttachFiles ? await onAttachFiles(attachableId, files) : attachableId

		if (id) {
			setUploadingCount((current) => current + files.length)
			await Promise.allSettled(files.map((file) => handleAttachFileApi(id, file)))
		}
	}, [onAttachFiles, attachableId, handleAttachFileApi])

	const handleDeleteAttachment = useCallback(async (params?: DeleteAttachmentParams) => {
		if (!attachableId) {
			return
		}

		await handleProcessing(processingKey, () => deleteAttachmentApi(attachableId, params))

		const { attachment_id } = params ?? {}

		attachment_id && setAttachedFiles((current) => current.filter((a) => a.id !== attachment_id))
	}, [attachableId, deleteAttachmentApi, handleProcessing, processingKey, setAttachedFiles])

	return {
		attachedFiles, currentCount: attachedFiles.length + uploadingCount,
		handleAttachFiles, handleDeleteAttachment, setAttachedFiles,
	}
}

export default useFileAttach
