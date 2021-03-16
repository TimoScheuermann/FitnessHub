import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AchievementModule } from './achievement/achievement.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChartsModule } from './charts/charts.module';
import { ExerciseModule } from './exercise/exercise.module';
import { FeedModule } from './feed/feed.module';
import { FHSocket } from './FHSocket';
import { FriendsModule } from './friends/friends.module';
import { HealthModule } from './health/health.module';
import { PromoteModule } from './management/promote/promote.module';
import { StatisticsModule } from './management/statistics/statistics.module';
import { VariablesModule } from './management/variables/variables.module';
import { MessageModule } from './message/message.module';
import { NetlifyModule } from './netlify/netlify.module';
import { NutritionplanModule } from './nutritionplan/nutritionplan.module';
import { RecipeModule } from './recipe/recipe.module';
import { SettingModule } from './setting/setting.module';
import { TgbotModule } from './tgbot/tgbot.module';
import { TrainingplanModule } from './trainingplan/trainingplan.module';
import { UserModule } from './user/user.module';
import { WorkoutModule } from './workout/workout.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    /**
     * connect to database
     */
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
    HealthModule,
    MessageModule,
    FHSocket,
    NetlifyModule,
    WorkoutModule,
    ChartsModule,
    TrainingplanModule,
    VariablesModule,
    SettingModule,
    AchievementModule,
    FeedModule,
  ],
  controllers: [AppController],
  providers: [FHSocket, AppService],
})
export class AppModule {}
