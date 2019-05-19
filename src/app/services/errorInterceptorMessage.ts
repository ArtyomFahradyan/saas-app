import { Injectable } from '@angular/core';

@Injectable()
export class ErrorMessage {
    message = '';
    messages = [];
    show = false;
}
