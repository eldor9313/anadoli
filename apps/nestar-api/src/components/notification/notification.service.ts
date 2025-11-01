import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notification } from '../../libs/dto/notification/notification';
import { CreateNotificationInput, NotificationInquiry } from '../../libs/dto/notification/notification.input';
import { UpdateNotificationInput } from '../../libs/dto/notification/notification.update';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { Message } from '../../libs/enums/common.enum';
import { Property } from '../../libs/dto/property/property';
import { Member } from '../../libs/dto/member/member';
import { T } from '../../libs/types/common';
import { PropertiesInquiry } from '../../libs/dto/property/property.input';
import { NoticesInquiry } from '../../libs/dto/notice/notice.input';

@Injectable()
export class NotificationService {
	constructor(
		@InjectModel('Notification') private readonly notificationModel: Model<Notification>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		@InjectModel('Property') private readonly propertyModel: Model<Property>,
	) {}

	private async ensureMember(id: ObjectId) {
		const member = await this.memberModel.findById(id).lean();
		if (!member) throw new NotFoundException(Message.NO_DATA_FOUND);
		return member;
	}

	private async incMemberNotifications(receiverId: ObjectId, delta: 1 | -1) {
		await this.memberModel.updateOne({ _id: receiverId }, { $inc: { memberNotifications: delta } }).exec();
	}

	public async createNotification(input: CreateNotificationInput, authorId: ObjectId): Promise<Notification> {
		try {
			await this.ensureMember(input.receiverId as any);

			const doc = await this.notificationModel.create({
				...input,
				authorId,
				notificationStatus: (input as any).notificationStatus ?? NotificationStatus.WAIT,
			});

			// counters
			await this.incMemberNotifications(input.receiverId as any, 1);

			return doc;
		} catch (err: any) {
			console.log('Error, NotificationService.createNotification:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async update(receiverId: ObjectId, input: UpdateNotificationInput): Promise<Notification> {
		const res = await this.notificationModel
			.findOneAndUpdate({ _id: input._id, receiverId }, { $set: input }, { new: true })
			.lean()
			.exec();

		if (!res) throw new NotFoundException(Message.UPDATE_FAILED);
		return res as Notification;
	}

	public async markRead(receiverId: ObjectId, id: ObjectId): Promise<Notification> {
		return this.update(receiverId, { _id: id, notificationStatus: NotificationStatus.READ });
	}

	public async markAllRead(receiverId: ObjectId): Promise<number> {
		const { modifiedCount } = await this.notificationModel
			.updateMany(
				{ receiverId, notificationStatus: NotificationStatus.WAIT },
				{ $set: { notificationStatus: NotificationStatus.READ } },
			)
			.exec();
		return modifiedCount;
	}

	public async removeNotification(_id: ObjectId): Promise<Notification> {
		const result = await this.notificationModel.findByIdAndDelete(_id).lean().exec();
		if (!result) throw new NotFoundException(Message.REMOVE_FAILED);

		// counterni kamaytiramiz
		await this.incMemberNotifications(result.receiverId as any, -1);

		return result as Notification;
	}

	public async myNotifications(
		receiverId: ObjectId,
		input: NotificationInquiry,
	): Promise<{ list: Notification[]; metaCounter: { total: number }[] }> {
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? -1 };

		const pipeline = [
			{ $match: { receiverId } },
			{ $sort: sort },
			{
				$facet: {
					list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
					metaCounter: [{ $count: 'total' }],
				},
			},
		];

		const result = await this.notificationModel.aggregate(pipeline).exec();
		return result[0] ?? { list: [], metaCounter: [{ total: 0 }] };
	}

	public async unreadCount(receiverId: ObjectId): Promise<number> {
		return this.notificationModel
			.countDocuments({
				receiverId,
				notificationStatus: NotificationStatus.WAIT,
			})
			.exec();
	}

	public async createWelcome(receiverId: ObjectId) {
		await this.ensureMember(receiverId);
		return this.createNotification(
			{
				notificationType: NotificationType.ALARM,
				notificationGroup: NotificationGroup.MEMBER,
				notificationTitle: 'Welcome to Cozypick',
				notificationDesc: 'Glad to have you here. Explore and enjoy!',
				receiverId,
			} as any,
			receiverId,
		);
	}

	public async createOnPropertyLike(propertyId: ObjectId, likerId: ObjectId) {
		const prop = await this.propertyModel.findById(propertyId).lean();
		if (!prop) throw new NotFoundException(Message.NO_DATA_FOUND);

		const ownerId = (prop as any).memberId;
		if (String(ownerId) === String(likerId)) return null;

		await this.ensureMember(likerId);
		await this.ensureMember(ownerId);

		return this.createNotification(
			{
				notificationType: NotificationType.LIKE,
				notificationGroup: NotificationGroup.PROPERTY,
				notificationTitle: 'Your property got a new like',
				notificationDesc: (prop as any).propertyTitle ?? 'Someone liked your listing.',
				receiverId: ownerId,
				propertyId,
			} as any,
			likerId,
		);
	}
	public async createOnMemberLike(targetMemberId: ObjectId, likerId: ObjectId) {
		const member = await this.memberModel.findById(targetMemberId).lean();
		if (!member) throw new NotFoundException(Message.NO_DATA_FOUND);

		const ownerId = member._id;
		if (String(ownerId) === String(likerId)) return null;

		await this.ensureMember(likerId);
		await this.ensureMember(ownerId);

		const existing = await this.notificationModel
			.findOne({
				notificationType: NotificationType.LIKE,
				notificationGroup: NotificationGroup.MEMBER,
				receiverId: ownerId,
				actorId: likerId,
			})
			.lean();
		if (existing) return existing;

		const desc = (member as any).memberNick
			? `${(member as any).memberNick} received a like `
			: 'Someone liked your profile.';

		return this.createNotification(
			{
				notificationType: NotificationType.LIKE,
				notificationGroup: NotificationGroup.MEMBER,
				notificationTitle: 'Liked you',
				notificationDesc: desc,
				receiverId: ownerId,
			} as any,
			likerId,
		);
	}

	public async createOnPropertyComment(propertyId: ObjectId, commenterId: ObjectId) {
		const prop = await this.propertyModel.findById(propertyId).lean();
		if (!prop) throw new NotFoundException(Message.NO_DATA_FOUND);

		const ownerId = (prop as any).memberId;
		if (String(ownerId) === String(commenterId)) return null;

		await this.ensureMember(commenterId);
		await this.ensureMember(ownerId);

		return this.createNotification(
			{
				notificationType: NotificationType.COMMENT,
				notificationGroup: NotificationGroup.PROPERTY,
				notificationTitle: 'Your property got a new comment',
				notificationDesc: (prop as any).propertyTitle ?? 'Someone commented on your listing.',
				receiverId: ownerId,
				propertyId,
			} as any,
			commenterId,
		);
	}

	public async createOnFollowSubscribe(followerId: ObjectId, followingId: ObjectId) {
		if (String(followerId) === String(followingId)) return null;

		const follower = await this.ensureMember(followerId);
		await this.ensureMember(followingId);

		const followerName =
			(follower as any).memberNick || (follower as any).memberFullName || (follower as any).email || 'Someone';

		return this.createNotification(
			{
				notificationType: NotificationType.FOLLOW,
				notificationGroup: NotificationGroup.MEMBER,
				notificationTitle: 'You have a new follower',
				notificationDesc: `${followerName} started following you.`,
				receiverId: followingId,
			} as any,
			followerId,
		);
	}
}
