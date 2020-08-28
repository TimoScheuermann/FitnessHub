import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { TrainingplanModule } from './trainingplan/trainingplan.module';
import { UserModule } from './user/user.module';
import { TgbotModule } from './tgbot/tgbot.module';
import { RecipeModule } from './recipe/recipe.module';
import { NutritionplanService } from './nutritionplan/nutritionplan.service';
import { NutritionplanModule } from './nutritionplan/nutritionplan.module';
import { FriendsModule } from './friends/friends.module';
import { StatisticsModule } from './management/statistics/statistics.module';
import { PromoteModule } from './management/promote/promote.module';

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
    TrainingplanModule,
    TgbotModule,
    RecipeModule,
    NutritionplanModule,
    FriendsModule,
    StatisticsModule,
    PromoteModule,
  ],
  controllers: [AppController],
  providers: [NutritionplanService],
})
export class AppModule {}
