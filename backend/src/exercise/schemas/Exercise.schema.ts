import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Exercise extends Document {}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
