import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NoticeService } from './notice.service';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { CreateNoticeInput, NoticesInquiry } from '../../libs/dto/notice/notice.input';
import { ChangeNoticeStatusInput, UpdateNoticeInput } from '../../libs/dto/notice/notice.update';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
@Resolver(() => Notice)
export class NoticeResolver {
	constructor(private readonly noticeService: NoticeService) {}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	async createNotice(@Args('input') input: CreateNoticeInput): Promise<Notice> {
		return this.noticeService.createNotice(input /*, memberId*/);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	async updateNotice(@Args('input') input: UpdateNoticeInput): Promise<Notice> {
		return this.noticeService.updateNotice(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	async changeNoticeStatus(@Args('input') input: ChangeNoticeStatusInput): Promise<Notice> {
		return this.noticeService.changeNoticeStatus(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Boolean)
	async deleteNotice(@Args('_id') _id: string): Promise<boolean> {
		return this.noticeService.deleteNotice(_id);
	}

	@UseGuards(WithoutGuard)
	@Query(() => Notice)
	async getNotice(
		@Args('noticeId') noticeId: string,
		@AuthMember('_id') _memberId: ObjectId, // kept for parity/future use
	): Promise<Notice> {
		const targetId = shapeIntoMongoObjectId(noticeId);
		return this.noticeService.getNoticeById(targetId);
	}

	@UseGuards(WithoutGuard)
	@Query(() => Notices)
	async getNotices(
		@Args('input') input: NoticesInquiry,
		@AuthMember('_id') _memberId: ObjectId, // kept for parity/future use
	): Promise<Notices> {
		return this.noticeService.getNotices(input);
	}
}
