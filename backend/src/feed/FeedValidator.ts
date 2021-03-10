import { isValidObjectId } from 'mongoose';
import { FormValidator } from 'src/FormValidator';
import { CreatePostDto } from './dtos/CreatePost.dto';

export class FeedValidator extends FormValidator {
  public static validate(dto: CreatePostDto): CreatePostDto {
    let { text } = dto;
    const { exerciseId, recipeId } = dto;

    text = this.checkString(
      text,
      'Bitte schreibe einen kurzen Text zu deinem Post',
      5,
    );

    if (exerciseId && !isValidObjectId(exerciseId)) {
      dto.exerciseId = undefined;
    }

    if (recipeId && !isValidObjectId(recipeId)) {
      dto.recipeId = undefined;
    }

    return {
      text: text,
      exerciseId: dto.exerciseId,
      recipeId: dto.exerciseId,
      thumbnail: dto.thumbnail,
      title: dto.title,
    };
  }
}
