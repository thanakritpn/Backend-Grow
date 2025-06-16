import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { FindModule } from './find/find.module';
import { MomentModule } from './moment/moment.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { ProfileModule } from './profile/profile.module';
import { ExchangeModule } from './exchange/exchange.module';
import { TalkModule } from './talk/talk.module';


@Module({
  imports: [ PrismaModule,FindModule,MomentModule,AuthModule,PostsModule,ProfileModule,ExchangeModule,TalkModule],
})
export class AppModule {}
