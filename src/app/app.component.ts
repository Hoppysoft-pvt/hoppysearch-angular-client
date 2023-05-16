import {
  Component,
  Injectable,
} from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
@Injectable({
  providedIn: 'root',
})
export class AppComponent {
  title = 'angular-search-page';
  
  props = {
    indexId: 'jq0c0b',
    apiKey: 'hs_2d1vkth26fpt4ngw',
    iconURL: 'image',
    targetURL: 'url',
    primaryText: 'title',
    secondaryText: 'description',
    onTypeSearch: true,
  };
}
