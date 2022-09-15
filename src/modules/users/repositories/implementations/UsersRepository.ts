import { getRepository, ILike, Like, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    const user = await this.repository
      .createQueryBuilder("users")
      .innerJoinAndSelect("users.games", "games")
      .where("users.id = :id", { id: user_id })
      .getOne();
      
    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.find({
      order: {
        first_name: "ASC"
      }
    }); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const user = await this.repository.find({
      where: {
        first_name: ILike(`%${first_name}%`),
        last_name: ILike(`%${last_name}%`),
      },
    }); // Complete usando raw query
    return user;
  }
}
