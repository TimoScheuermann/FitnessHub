import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ExerciseModule } from './exercise/exercise.module';
import { FriendsModule } from './friends/friends.module';
import { InboxModule } from './inbox/inbox.module';
import { PromoteModule } from './management/promote/promote.module';
import { StatisticsModule } from './management/statistics/statistics.module';
import { NutritionplanModule } from './nutritionplan/nutritionplan.module';
import { RecipeModule } from './recipe/recipe.module';
import { TgbotModule } from './tgbot/tgbot.module';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: `mongodb+srv://${configService.get(
            'MONGO_USER',
          )}:${configService.get('MONGO_PW')}@${configService.get(
            'MONGO_DB',
          )}/${configService.get('MONGO_TABLE')}?retryWrites=true&w=majority`,
        };
      },
    }),
    UserModule,
    AuthModule,
    TgbotModule,
    RecipeModule,
    NutritionplanModule,
    FriendsModule,
    StatisticsModule,
    PromoteModule,
    ExerciseModule,
    InboxModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
