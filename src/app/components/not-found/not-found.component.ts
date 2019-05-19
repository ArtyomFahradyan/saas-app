import { Component } from '@angular/core';

@Component({
  selector: 'not-found',
  template: `
    <div>
      <h1>404: {{'pageMissing' | translate}}</h1>
    </div>
  `
})
export class NotFoundComponent {}
