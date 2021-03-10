export class CreatePostDto {
  title?: string;
  thumbnail?: string;
  text!: string;

  recipeId?: string;
  exerciseId?: string;
}
