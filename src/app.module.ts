import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from 'config';
import { OrganizationModule } from './modules/organization/organization.module';
import { KeyModule } from './modules/key/key.module';
import { SessionModule } from './modules/session/session.module';
import { ManagerModule } from './modules/manager/manager.module';
import { AdminMiddleware } from './middlewares/Admin.middleware';
import { KeyMiddleware } from './middlewares/Key.middleware';
import { ManagerQueryMiddleware } from './middlewares/ManagerQuery.middleware';
import { ManagerCreateMiddleware } from './middlewares/ManagerCreate.middleware';
@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(DatabaseConfig),
        OrganizationModule,
        KeyModule,
        SessionModule,
        ManagerModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AdminMiddleware).forRoutes('organization'),
            consumer.apply(KeyMiddleware).forRoutes('key/generate'),
            consumer
                .apply(AdminMiddleware)
                .exclude('manager/findByOrganization', 'manager/create')
                .forRoutes('manager'),
            consumer
                .apply(ManagerQueryMiddleware)
                .forRoutes('manager/findByOrganization'),
            consumer.apply(ManagerCreateMiddleware).forRoutes('manager/create'),
            consumer
                .apply(AdminMiddleware)
                .exclude('session/findByOrganization', 'session/create')
                .forRoutes('session'),
            consumer
                .apply(ManagerQueryMiddleware)
                .forRoutes('session/findByOrganization'),
            consumer.apply(ManagerCreateMiddleware).forRoutes('session/create');
    }
}
