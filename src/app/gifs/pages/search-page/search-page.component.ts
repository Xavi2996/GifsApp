import { Component } from '@angular/core';
import { GifsListComponent } from '../../component/gifs-list/gifs-list.component';

@Component({
  selector: 'app-search-page',
  imports: [GifsListComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css',
})
export default class SearchPageComponent {
  onSearch(query: string) {
    console.log(query);
  }
}
