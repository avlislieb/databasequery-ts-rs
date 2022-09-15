import { getRepository, ILike, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository.find({
      where: {
        title: ILike(`%${param}%`)
      }
    })
    return await this.repository
      .createQueryBuilder()
      .where("title like '%:title%'", {title: param})
      .getMany();
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const result = await this.repository
    .createQueryBuilder()
    .select("COUNT(id)", 'count')
    .getRawOne(); // Complete usando raw query

    return [result];
  }

  async findUsersByGameId(id: string): Promise<User[] | undefined> {
    const [result] = await this.repository
      .createQueryBuilder("games")
      .innerJoinAndSelect("games.users", "users")
      .where("games.id = :id", { id })
      .getMany();

    const { users } = result;
    return users;
      // Complete usando query builder
  }
}
