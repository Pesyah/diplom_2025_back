import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { UserRoleModule } from '../userRole/userRole.module';
import { CoffeeAdditiveController } from './coffee-additive.controller';
import { CoffeeVolumeController } from './coffee-volume.controller';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { CoffeeAdditiveRelation } from './entities/coffee-additive-relation.entity';
import { CoffeeAdditive } from './entities/coffee-additive.entity';
import { CoffeeVolumeRelation } from './entities/coffee-volume-relation.entity';
import { CoffeeVolume } from './entities/coffee-volume.entity';
import { Coffee } from './entities/coffee.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Coffee,
            CoffeeAdditive,
            CoffeeAdditiveRelation,
            CoffeeVolume,
            CoffeeVolumeRelation,
            Users,
        ]),
        UserRoleModule,
    ],
    controllers: [
        CoffeeController,
        CoffeeVolumeController,
        CoffeeAdditiveController,
    ],
    providers: [CoffeeService],
})
export class CoffeeModule {}
