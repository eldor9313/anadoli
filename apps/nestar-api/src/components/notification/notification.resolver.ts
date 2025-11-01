import { Resolver, Query, Mutation, Args, Int, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { NotificationService } from './notification.service';
import { Notification, Notifications } from '../../libs/dto/notification/notification';
import { UpdateNotificationInput } from '../../libs/dto/notification/notification.update';
import { PropertiesInquiry } from '../../libs/dto/property/property.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { NoticesInquiry } from '../../libs/dto/notice/notice.input';
import { NotificationInquiry } from '../../libs/dto/notification/notification.input';

@Resolver(() => Notification)
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@UseGuards(AuthGuard)
	@Query(() => Notifications)
	async myNotifications(
		@AuthMember('_id') meId: ObjectId,
		@Args('input') input: NotificationInquiry,
	): Promise<Notifications> {
		return (await this.notificationService.myNotifications(meId, input)) as any;
	}

	// Unread count badge
	@UseGuards(AuthGuard)
	@Query(() => Int)
	async unreadNotificationsCount(@AuthMember('_id') meId: ObjectId): Promise<number> {
		return this.notificationService.unreadCount(meId);
	}

	// Mark single notification as READ
	@UseGuards(AuthGuard)
	@Mutation(() => Notification)
	async markNotificationRead(@AuthMember('_id') meId: ObjectId, @Args('id') id: string): Promise<Notification> {
		return this.notificationService.markRead(meId, shapeIntoMongoObjectId(id));
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Int)
	async markAllNotificationsRead(@AuthMember('_id') meId: ObjectId): Promise<number> {
		return this.notificationService.markAllRead(meId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Notification)
	async removeNotification(@Args('id') id: string): Promise<Notification> {
		return this.notificationService.removeNotification(shapeIntoMongoObjectId(id));
	}

	// Create a welcome notification for current user (useful for testing)
	@UseGuards(AuthGuard)
	@Mutation(() => Notification)
	async createWelcomeNotification(@AuthMember('_id') meId: ObjectId): Promise<Notification> {
		return this.notificationService.createWelcome(meId);
	}
}
