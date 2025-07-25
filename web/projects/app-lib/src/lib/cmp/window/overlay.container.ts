import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable()
export class AppOverlayContainer extends OverlayContainer {

    _createContainer(): void {
        const container = document.createElement('div');
        container.classList.add('app-overlay-container');
        document.querySelector('body').appendChild(container);
        this._containerElement = container;
    }
}