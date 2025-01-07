import { Pipe, PipeTransform } from '@angular/core';

import { ApiService, IUser,IDepartment } from './api.service';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(users: IUser[]): IUser[] {
    if (!users) {
        return [];
    }
    return users.filter(user => 
        ['admin', 'vigile', 'employe'].includes(user.role)
    );
}
}


