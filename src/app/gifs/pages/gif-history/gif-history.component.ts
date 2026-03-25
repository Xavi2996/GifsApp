import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GifService } from '../../services/gif.service';
import { GifsListComponent } from '../../component/gifs-list/gifs-list.component';

@Component({
  selector: 'gif-history',
  imports: [GifsListComponent],
  templateUrl: './gif-history.component.html',
  styleUrl: './gif-history.component.css',
})
export default class GifHistoryComponent {
  gifService = inject(GifService);

  query = toSignal(
    inject(ActivatedRoute).params.pipe(map(({ query }) => query)),
  );

  gifsByKey = computed(() => {
    console.log(this.gifService.getHistoryGifs(this.query()));

    return this.gifService.getHistoryGifs(this.query());
  });
}
