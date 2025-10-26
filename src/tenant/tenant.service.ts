import { Injectable, Scope } from '@nestjs/common';
import { Partner } from '@prisma/client';

//1. Shared service - singleton DEFAULT
//2. Scoped service - per request REQUEST
//3. Transient service - new instance every time TRANSIENT

@Injectable({
  scope: Scope.REQUEST,
})
export class TenantService {
  private tenant: Partner;

  setTenant(tenant: Partner) {
    this.tenant = tenant;
  }

  getTenant(): Partner {
    return this.tenant;
  }
}
