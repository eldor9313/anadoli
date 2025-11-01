import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import NotificationSchema from '../../schemas/Notification.model';
import PropertySchema from '../../schemas/Property.model'; // ← shu to‘g‘ri yo‘lmi? (pastga qarang)
import { MemberModule } from '../member/member.module';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { AuthModule } from '../auth/auth.module';
import MemberSchema from '../../schemas/Member.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
      { name: 'Property', schema: PropertySchema }, 
      { name: 'Member', schema: MemberSchema },   // ← SHU QATOR SHART
    ]),
    AuthModule
  ],
  providers: [NotificationService, NotificationResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
