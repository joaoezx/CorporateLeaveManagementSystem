import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeavePolicyDocument = LeavePolicy & Document;

@Schema()
export class LeavePolicy {
  @Prop({ required: true, default: 20 })
  annualLeaveDays: number;

  @Prop({ required: true, default: 5 })
  sickLeaveDays: number;
}

export const LeavePolicySchema = SchemaFactory.createForClass(LeavePolicy);
