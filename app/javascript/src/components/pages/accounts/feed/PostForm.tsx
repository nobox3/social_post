import { Card, CardHeader, CardContent } from '@mui/material'
import { useContext, useCallback, useEffect, Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import DropzoneInnerForImage from 'src/components/atoms/DropzoneInnerForImage'
import useFileAttachWithDropzone from 'src/components/hooks/useFileAttachWithDropzone'
import { OnItemsChange } from 'src/components/hooks/useOnArrayStateChange'
import FormContainer from 'src/components/molecules/FormContainer'
import MessageInputForm, { getInitialValues, FormInputs, initFields } from 'src/components/organisms/MessageInputForm'
import { ProcessingContext } from 'src/components/providers/ProcessingProvider'
import Post from 'src/core/types/Post'
import { createPost, updatePost, attachFile, deleteAttachment } from 'src/services/postsService'

const PROCESSING_KEY = 'create_post'

type Props = {
	draftPost?: Post
	onPostsChange: OnItemsChange<Post>
	setTotalCount: Dispatch<SetStateAction<number>>
}

function PostForm({ draftPost, onPostsChange, setTotalCount }: Props) {
	const { t } = useTranslation()
	const { handleProcessing } = useContext(ProcessingContext)

	const useFormReturn = useForm<FormInputs>({
		defaultValues: getInitialValues(draftPost),
	})

	const { clearErrors, getValues, register, resetField, setFocus, setValue } = useFormReturn

	const createOrUpdatePost = useCallback(
		(draftId: number | undefined, params: { body: string, send?: boolean }) => {
			return draftId ? updatePost(draftId, params) : createPost(params)
		}, [],
	)

	const onAttachFiles = useCallback(
		async (attachableId: number | undefined) => {
			let id = attachableId

			if (!id) {
				const body = getValues('textareaBody')
				const { post } = await handleProcessing(PROCESSING_KEY, () => createPost({ body }))

				id = post?.id
				initFields(resetField, id ? { body, id } : undefined)
			}

			return id
		},
		[getValues, handleProcessing, resetField],
	)

	const useFileAttachWithDropzoneReturn = useFileAttachWithDropzone({
		attachFileApi: attachFile,
		attachableId: getValues('draftId'),
		deleteAttachmentApi: deleteAttachment,
		initialFiles: draftPost?.images ?? [],
		onAttachFiles,
		processingKey: PROCESSING_KEY,
	})

	const { getRootProps, setAttachedFiles } = useFileAttachWithDropzoneReturn

	// Initialize
	useEffect(() => {
		setAttachedFiles(draftPost?.images ?? [])
		initFields(resetField, draftPost)
		setFocus('textareaBody')
		clearErrors()
	}, [setFocus, clearErrors, setAttachedFiles, draftPost, resetField])

	return (
		<Card {...getRootProps()} sx={{ position: 'relative' }}>
			<DropzoneInnerForImage useDropzoneUploaderReturn={useFileAttachWithDropzoneReturn} />
			<CardHeader title={t('model.post')} />
			<CardContent>
				<FormContainer
					buttonProps={{ children: t('model.post') }}
					handleApi={({ draftId, textareaBody }) => {
						return createOrUpdatePost(draftId, { body: textareaBody, send: true })
					}}
					onSubmitSucceeded={({ post }) => {
						if (post) {
							onPostsChange((current) => [post, ...current])
							setTotalCount((current) => current + 1)
						}

						setAttachedFiles([])
						initFields(resetField)
						setValue('draftId', undefined)
					}}
					processingKey={PROCESSING_KEY}
					title=""
					useFormReturn={useFormReturn}
				>
					<MessageInputForm
						fieldLabel={t('model.attributes.post.body')}
						useFileAttachWithDropzoneReturn={useFileAttachWithDropzoneReturn}
						useFormReturn={useFormReturn}
					/>
					<input type="hidden" {...register('draftId')} />
				</FormContainer>
			</CardContent>
		</Card>
	)
}

export default PostForm
