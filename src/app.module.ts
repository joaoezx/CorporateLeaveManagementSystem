import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeaveRequestsModule } from './leave-requests/leave-requests.module';
import { LeavePoliciesModule } from './leave-policies/leave-policies.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    LeaveRequestsModule,
    LeavePoliciesModule,
    NotificationsModule,
    ReportsModule,
    MongooseModule.forRoot(
      'mongodb://joaofreitas:<db_password>@cluster0-shard-00-00.qoe5s.mongodb.net:27017,cluster0-shard-00-01.qoe5s.mongodb.net:27017,cluster0-shard-00-02.qoe5s.mongodb.net:27017/?replicaSet=atlas-ggtkmb-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
