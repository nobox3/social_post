import { TOptions } from 'i18next'
import { useCallback, useContext, useState, useMemo, DragEvent } from 'react'
import {
	useDropzone, FileRejection, ErrorCode as DropzoneErrorCode,
	DropzoneOptions, DropzoneState, DropEvent, Accept,
} from 'react-dropzone'
import { useTranslation } from 'react-i18next'

import { FlashMessageContext } from 'src/components/providers/FlashMessageProvider'
import {
	MAX_IMAGE_FILE_SIZE, MAX_IMAGE_FILE_SIZE_MB, MAX_IMAGES_COUNT, MAX_IMAGE_DIMENSION_SIZE,
	ACCEPTED_IMAGE_TYPES, STR_ACCEPTED_IMAGE_TYPES,
} from 'src/static/constants'

const USE_DROPZONE_ACCEPT = ACCEPTED_IMAGE_TYPES.reduce<Accept>((acc, type) => {
	acc[type] = [] as const

	return acc
}, {})

type ErrorCode = Exclude<`${DropzoneErrorCode}`, 'file-too-small'> | 'too-large-dimension'

const I18N_PARAMS_BY_ERROR_CODE: Record<
	ErrorCode, { defaultOptions: TOptions, key: string }
> = {
	'file-invalid-type': {
		defaultOptions: { type: STR_ACCEPTED_IMAGE_TYPES },
		key: 'common_errors.invalid_file',
	},
	'file-too-large': {
		defaultOptions: { size: MAX_IMAGE_FILE_SIZE_MB },
		key: 'common_errors.too_large_file',
	},
	'too-large-dimension': {
		defaultOptions: { count: MAX_IMAGE_DIMENSION_SIZE },
		key: 'common_errors.too_large_size',
	},
	'too-many-files': {
		defaultOptions: {},
		key: 'common_errors.too_many',
	},
} as const

type ValidateImageDimensionSizeResults = {
	accepted: File[]
	rejected: FileRejection[]
}

function validateImageDimensionSize(file: File, results: ValidateImageDimensionSizeResults) {
	return new Promise<{ file: File, img: HTMLImageElement }>((resolve, reject) => {
		const img = new Image()

		img.onload = () => {
			const { naturalHeight, naturalWidth } = img

			if (naturalWidth > MAX_IMAGE_DIMENSION_SIZE || naturalHeight > MAX_IMAGE_DIMENSION_SIZE) {
				const error = new Error(`Image size must be ${MAX_IMAGE_DIMENSION_SIZE}px or less`)

				results.rejected.push({
					errors: [{ code: 'too-large-dimension', message: error.message }],
					file,
				})
				reject(error)
			} else {
				results.accepted.push(file)
				resolve({ file, img })
			}
		}

		img.src = URL.createObjectURL(file)
	})
}

export type UseDropzoneUploaderReturn = {
	dropzoneActive: boolean
	errorMessage: string
	remainingCount: number
} & Pick<DropzoneState, 'getInputProps' | 'getRootProps' | 'isDragActive'>

export type UseDropzoneUploaderParams = {
	currentCount: number
	onDropAccepted?: (files: File[], e: DropEvent) => void | Promise<void>
} & Pick<DropzoneOptions, 'maxFiles' | 'noClick' | 'noKeyboard'>

function useDropzoneUploader({
	currentCount,
	maxFiles = MAX_IMAGES_COUNT,
	noClick,
	noKeyboard,
	onDropAccepted,
}: UseDropzoneUploaderParams): UseDropzoneUploaderReturn {
	const { t } = useTranslation()
	const addFlashMessages = useContext(FlashMessageContext)
	const [isOverMaxFiles, setIsOverMaxFiles] = useState<boolean>(false)
	const remainingCount = maxFiles - currentCount

	const i18nErrorMessage = useCallback(
		(code: ErrorCode) => {
			const params = I18N_PARAMS_BY_ERROR_CODE[code]

			if (!params) {
				return t('common_errors.unknown')
			}

			const { defaultOptions, key } = params
			const tOptions = code === 'too-many-files' ? { count: maxFiles, item: t('generic.image') } : {}

			return t(key, { ...defaultOptions, ...tOptions })
		},
		[maxFiles, t],
	)

	const onDropRejected = useCallback(
		(fileRejections: FileRejection[], _e: DropEvent) => {
			const errorCodes: ErrorCode[] = []

			fileRejections.forEach((rejection) => {
				rejection.errors.forEach((error) => {
					const code = error.code as ErrorCode
					errorCodes.push(code)
				})
			})

			new Set(errorCodes).forEach((code) => {
				addFlashMessages({ text: i18nErrorMessage(code), type: 'error' })
			})

			setIsOverMaxFiles(false)
		},
		[addFlashMessages, i18nErrorMessage],
	)

	const handleOnDropAccepted = useCallback(
		async (files: File[], e: DropEvent) => {
			if (remainingCount < 1) {
				onDropRejected([{ errors: [{ code: 'too-many-files', message: '' }], file: files[0] }], e)
				return
			}

			const results: ValidateImageDimensionSizeResults = { accepted: [], rejected: [] }
			await Promise.allSettled(files.map((image) => validateImageDimensionSize(image, results)))

			const { accepted, rejected } = results
			rejected.length > 0 && onDropRejected(rejected, e)
			accepted.length > 0 && await onDropAccepted?.(accepted, e)
		},
		[onDropAccepted, onDropRejected, remainingCount],
	)

	const { getInputProps, getRootProps, isDragActive, isDragReject } = useDropzone({
		accept: USE_DROPZONE_ACCEPT,
		maxFiles: remainingCount,
		maxSize: MAX_IMAGE_FILE_SIZE,
		minSize: 0,
		noClick,
		noKeyboard,
		onDragEnter: (e: DragEvent) => {
			setIsOverMaxFiles(e.dataTransfer.items.length > remainingCount)
		},
		onDragLeave: () => setIsOverMaxFiles(false),
		onDropAccepted: (files: File[], e: DropEvent) => {
			void handleOnDropAccepted(files, e)
		},
		onDropRejected,
	})

	const errorMessage = useMemo(() => {
		if (!isDragActive) {
			return ''
		}

		if (remainingCount < 1 || isOverMaxFiles) {
			return i18nErrorMessage('too-many-files')
		}

		if (isDragReject) {
			return i18nErrorMessage('file-invalid-type')
		}

		return ''
	}, [i18nErrorMessage, isDragActive, isDragReject, isOverMaxFiles, remainingCount])

	return {
		dropzoneActive: isDragActive && !errorMessage,
		errorMessage, getInputProps, getRootProps, isDragActive, remainingCount,
	}
}

export default useDropzoneUploader
