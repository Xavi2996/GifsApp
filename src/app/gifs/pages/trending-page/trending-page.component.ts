import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { GifsListComponent } from '../../component/gifs-list/gifs-list.component';
import { GifService } from '../../services/gif.service';
import { ScrollStateService } from '../../shared/services/scroll-state.service';

@Component({
  selector: 'app-trending-page',
  imports: [GifsListComponent],
  templateUrl: './trending-page.component.html',
  styleUrl: './trending-page.component.css',
})
export default class TrendingPageComponent implements AfterViewInit {
  gifServices = inject(GifService);
  scrollStateService = inject(ScrollStateService);

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;

    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

  onScroll(event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;

    const scrollTop = scrollDiv.scrollTop; // Distancia desde la parte superior del div hasta el punto actual de scroll
    const clientHeight = scrollDiv.clientHeight; // Altura visible del div
    const scrollHeight = scrollDiv.scrollHeight; // Altura total del contenido del div

    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight; // Verificar si estamos cerca del fondo (con un margen de 10px)

    this.scrollStateService.trendingScrollState.set(scrollTop);

    if (isAtBottom) {
      this.gifServices.loadTrendingsGifs();
    }
  }
}
