import { ButtonProps } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import ButtonWithProcessing from 'src/components/atoms/ButtonWithProcessing'
import User from 'src/core/types/User'
import { followUser, unfollowUser } from 'src/services/relationshipsService'

type Props = ButtonProps & {
	user: User
}

function ToggleFollowButton({ user, ...props }: Props) {
	const { t } = useTranslation()
	const [relationshipId, setRelationshipId] = useState<number | null>(user.relationship_id ?? null)
	const { id } = user
	const processingKey = `toggle_follow_${id}`

	return relationshipId
		? (
			<ButtonWithProcessing
				handleInProcessing={() => unfollowUser(relationshipId)}
				onClick={() => setRelationshipId(null)}
				processingKey={processingKey}
				variant="contained"
				{...props}
			>
				{t('user.unfollow')}
			</ButtonWithProcessing>
		)
		: (
			<ButtonWithProcessing
				handleInProcessing={() => followUser({ followed_id: id })}
				onClick={(e, data) => data && setRelationshipId(data.relationship_id)}
				processingKey={processingKey}
				variant="outlined"
				{...props}
			>
				{t('user.follow')}
			</ButtonWithProcessing>
		)
}

export default ToggleFollowButton
