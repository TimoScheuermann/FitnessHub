import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  toJSON: {
    transform: (_doc: Achievement, ret: Achievement) => {
      return {
        achievedAt: ret.achievedAt,
        exerciseId: ret.exerciseId,
        exerciseTitle: ret.exerciseTitle,
      };
    },
  },
})
export class Achievement extends Document {
  @Prop()
  exerciseId: string;

  @Prop()
  exerciseTitle: string;

  @Prop()
  userId: string;

  @Prop()
  achievedAt: number[];
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
