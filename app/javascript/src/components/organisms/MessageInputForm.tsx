import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import { TextField, TextFieldProps, IconButton, Stack, Input } from '@mui/material'
import { useState, FocusEvent, useCallback } from 'react'
import { UseFormResetField, UseFormReturn, RegisterOptions, UseFormRegisterReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormItem from 'src/components/atoms/FormItem'
import useEmojiPicker from 'src/components/hooks/useEmojiPicker'
import { UseFileAttachWithDropzoneReturn } from 'src/components/hooks/useFileAttachWithDropzone'
import useReactHookFormValidations from 'src/components/hooks/useReactHookFormValidations'
import ImageList from 'src/components/molecules/ImageList'
import { MAX_TEXTAREA_COUNT } from 'src/static/constants'

const INPUT_FORM_NAMES = ['draftId', 'textareaBody'] as const

type FormInputChanged = {
	body: string
	id: number
}

export const getInitialValues = (changed?: FormInputChanged): FormInputs => {
	if (changed) {
		const { body, id } = changed

		return { draftId: id ?? undefined, textareaBody: body ?? '' }
	}

	return { draftId: undefined, textareaBody: '' }
}

export const initFields = (
	resetField: UseFormResetField<FormInputs>,
	changed?: FormInputChanged,
) => {
	const formInputValues = getInitialValues(changed)

	INPUT_FORM_NAMES.forEach((key) => {
		resetField(key, { defaultValue: formInputValues[key] })
	})
}

export type FormInputs = {
	draftId?: number
	textareaBody: string
}

type Props = Omit<TextFieldProps, keyof Omit<UseFormRegisterReturn, 'ref'>> & {
	fieldLabel: string
	maxLength?: number
	textareaBodyRegisterOptions?: RegisterOptions<Pick<FormInputs, 'textareaBody'>>
	useFileAttachWithDropzoneReturn?: UseFileAttachWithDropzoneReturn
	useFormReturn: UseFormReturn<FormInputs>
}

function MessageInputForm({
	fieldLabel,
	maxLength = MAX_TEXTAREA_COUNT,
	maxRows = 15,
	minRows = 1,
	sx,
	textareaBodyRegisterOptions,
	useFileAttachWithDropzoneReturn,
	useFormReturn,
	...props
}: Props) {
	const { t } = useTranslation()
	const [textCursorPosition, setTextCursorPosition] = useState<number>(0)
	// const [isFocusedTextarea, setIsFocusedTextarea] = useState<boolean>(false)

	const {
		attachedFiles, getInputProps, handleDeleteAttachment,
	} = useFileAttachWithDropzoneReturn ?? {}

	const isImageAttached = !!attachedFiles && attachedFiles.length > 0
	const { formState: { defaultValues }, getValues, register, setFocus, setValue } = useFormReturn

	const { emojiButton, emojiPicker } = useEmojiPicker({
		currentTextareaValue: getValues('textareaBody'),
		onEmojiSelected: useCallback(
			(newTextareaValue: string) => {
				setValue('textareaBody', newTextareaValue)
				setFocus('textareaBody')
			},
			[setFocus, setValue],
		),
		textCursorPosition,
	})

	const registerOptionsFromHook = useReactHookFormValidations<Pick<FormInputs, 'textareaBody'>>({
		maxLength, targetOptions: textareaBodyRegisterOptions,
	})

	const { name, onBlur, ref, ...registerReturnRest } = register('textareaBody', {
		...registerOptionsFromHook,
		validate: (value) => {
			return (
				isImageAttached
				|| value.trim().length > 0
				|| t('common_errors.please_input_field', { field: fieldLabel })
			)
		},
	})

	return (
		<Stack>
			<FormItem name={name} required useFormReturn={useFormReturn}>
				<TextField
					defaultValue={defaultValues?.textareaBody}
					fullWidth
					inputRef={ref}
					maxRows={maxRows}
					minRows={minRows}
					multiline
					name={name}
					onBlur={async (e: FocusEvent<HTMLTextAreaElement>) => {
						setTextCursorPosition(e.currentTarget.selectionStart)
						await onBlur?.(e)
					}}
					placeholder={t('post.placeholder')}
					sx={{ '& fieldset': { border: 'none' }, ...sx }}
					{...registerReturnRest}
					{...props}
				/>
			</FormItem>
			{attachedFiles && attachedFiles.length > 0 && (
				<ImageList handleDeleteImage={handleDeleteAttachment} images={attachedFiles} />
			)}
			<Stack direction="row" spacing={1}>
				<IconButton component="label">
					<Input inputProps={getInputProps?.()} />
					<AddPhotoAlternateOutlinedIcon />
				</IconButton>
				{emojiButton}
			</Stack>
			{emojiPicker}
		</Stack>
	)
}

export default MessageInputForm
