import { User } from '../../modules/user/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    await userRepository.insert({
      first_name: 'Admin',
      last_name: 'Core',
      email: 'admin@example.com',
      birth_date: new Date(),
      gender: 'male',
      password: hashedPassword,
      role: 'admin',
    });
  }
}
