import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Weapon,
  Character,
} from '../models';
import {WeaponRepository} from '../repositories';

export class WeaponCharacterController {
  constructor(
    @repository(WeaponRepository)
    public weaponRepository: WeaponRepository,
  ) { }

  @get('/weapons/{id}/character', {
    responses: {
      '200': {
        description: 'Character belonging to Weapon',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Character)},
          },
        },
      },
    },
  })
  async getCharacter(
    @param.path.string('id') id: typeof Weapon.prototype.id,
  ): Promise<Character> {
    return this.weaponRepository.character(id);
  }
}
