import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Armor,
  Character,
} from '../models';
import {ArmorRepository} from '../repositories';

export class ArmorCharacterController {
  constructor(
    @repository(ArmorRepository)
    public armorRepository: ArmorRepository,
  ) { }

  @get('/armors/{id}/character', {
    responses: {
      '200': {
        description: 'Character belonging to Armor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Character)},
          },
        },
      },
    },
  })
  async getCharacter(
    @param.path.string('id') id: typeof Armor.prototype.id,
  ): Promise<Character> {
    return this.armorRepository.character(id);
  }
}
