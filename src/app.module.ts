import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContentModule } from './content/content.module';
import { CoursesModule } from './courses/courses.module';
import { LeadsModule } from './leads/leads.module';
import { UploadsModule } from './uploads/uploads.module';
import { LoggingModule, CorrelationIdMiddleware } from './common/logging';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggingModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    PrismaModule,
    ContentModule,
    CoursesModule,
    LeadsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply CorrelationIdMiddleware to all routes
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
