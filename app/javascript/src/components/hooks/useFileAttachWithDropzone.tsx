import useDropzoneUploader, { UseDropzoneUploaderParams, UseDropzoneUploaderReturn } from 'src/components/hooks/useDropzoneUploader'
import useFileAttach, { UseFileAttachParams, UseFileAttachReturn } from 'src/components/hooks/useFileAttach'

export type UseFileAttachWithDropzoneReturn =
	Omit<UseFileAttachReturn, 'currentCount' | 'handleAttachFiles'> & UseDropzoneUploaderReturn

type UseFileAttachWithDropzoneParams =
	UseFileAttachParams & Omit<UseDropzoneUploaderParams, 'currentCount' | 'onDropAccepted'>

function useFileAttachWithDropzone({
	attachableId,
	attachFileApi,
	deleteAttachmentApi,
	initialFiles,
	noClick = true,
	noKeyboard = true,
	onAttachFiles,
	onFileAttached,
	processingKey,
	...rest
}: UseFileAttachWithDropzoneParams): UseFileAttachWithDropzoneReturn {
	const {
		attachedFiles, currentCount, handleAttachFiles, handleDeleteAttachment, setAttachedFiles,
	} = useFileAttach({
		attachFileApi, attachableId, deleteAttachmentApi, initialFiles,
		onAttachFiles, onFileAttached, processingKey,
	})

	return {
		attachedFiles, handleDeleteAttachment, setAttachedFiles,
		...useDropzoneUploader({
			currentCount, noClick, noKeyboard, onDropAccepted: handleAttachFiles, ...rest,
		}),
	}
}

export default useFileAttachWithDropzone
