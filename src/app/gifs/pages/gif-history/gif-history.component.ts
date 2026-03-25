import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'gif-history',
  imports: [],
  templateUrl: './gif-history.component.html',
  styleUrl: './gif-history.component.css',
})
export default class GifHistoryComponent {
  query = toSignal(
    inject(ActivatedRoute).params.pipe(map(({ query }) => query)),
  );
}
