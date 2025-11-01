import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { ObjectId } from 'mongoose';
import { Direction } from '../../enums/common.enum';
import { IsIn, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { availableCommentSorts } from '../../config';

@InputType()
export class CreateNoticeInput {
	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@Field(() => String)
	noticeTitle: string;

	@Field(() => String)
	noticeContent: string;

	@Field(() => String)
	memberId: ObjectId;
}

@InputType()
export class NoticeSearchInput {
	@Field(() => NoticeCategory, { nullable: true })
	noticeCategory?: NoticeCategory;

	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;

	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@Field({ nullable: true })
	text?: string;
}

@InputType()
export class NoticesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableCommentSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@Field(() => NoticeSearchInput, { nullable: true })
	search?: NoticeSearchInput;
}
