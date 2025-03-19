import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LeaveRequest } from '@leave-requests/schema/leave-request.entity';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true, enum: ['Employee', 'Manager', 'HR Admin'] })
  role: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'LeaveRequest' }],
  })
  leaveRequests: LeaveRequest[];
}

export const UserSchema = SchemaFactory.createForClass(User);
