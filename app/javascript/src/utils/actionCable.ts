import { createConsumer, Consumer, Subscription, Mixin, ChannelNameWithParams } from '@rails/actioncable'

const cable = createConsumer()

export type ActionCableChannel = Subscription<Consumer> & Mixin

export function createSubscription(
	channel: ChannelNameWithParams,
	mixin: Mixin = {},
): ActionCableChannel {
	return cable.subscriptions.create<Mixin>(channel, { ...mixin })
}
