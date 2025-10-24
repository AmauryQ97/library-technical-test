import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BookModule } from "./book/book.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get<number>("DB_PORT", 5432),
        username: configService.get("DB_USERNAME", "postgres"),
        password: configService.get("DB_PASSWORD", "postgres"),
        database: configService.get("DB_NAME", "library_db"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
        synchronize: false,
        logging: configService.get("NODE_ENV") === "development",
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),
    BookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
