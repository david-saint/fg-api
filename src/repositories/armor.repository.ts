import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Armor, ArmorRelations, Character} from '../models';
import {TestDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CharacterRepository} from './character.repository';

export class ArmorRepository extends DefaultCrudRepository<
  Armor,
  typeof Armor.prototype.id,
  ArmorRelations
> {

  public readonly character: BelongsToAccessor<Character, typeof Armor.prototype.id>;

  constructor(
    @inject('datasources.test') dataSource: TestDataSource, @repository.getter('CharacterRepository') protected characterRepositoryGetter: Getter<CharacterRepository>,
  ) {
    super(Armor, dataSource);
    this.character = this.createBelongsToAccessorFor('character', characterRepositoryGetter,);
  }
}
