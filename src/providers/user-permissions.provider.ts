import {
  PermissionKey,
  UserPermissionsFn,
  RequiredPermissions,
} from '../authorization';
import {intersection} from 'lodash';
import {Provider} from '@loopback/context';

export class UserPermissionsProvider implements Provider<UserPermissionsFn> {
  constructor() {}

  value(): UserPermissionsFn {
    return (userPermissions, requiredPermissions) =>
      this.action(userPermissions, requiredPermissions);
  }

  action(
    userPermissions: PermissionKey[],
    requiredPermissions: RequiredPermissions,
  ): boolean {
    return intersection(userPermissions, requiredPermissions.required).length
      === requiredPermissions.required.length;
  }
}