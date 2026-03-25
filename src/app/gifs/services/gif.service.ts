import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../pages/mappers/gif.mapper';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(false);
  private trendigPage = signal(0);

  searchHistory = signal<Record<string, Gif[]>>(this.loadHistoryFromStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  saveInStorage = effect(() => {
    const history = JSON.stringify(this.searchHistory());
    localStorage.setItem('HistoryGifs', history);
  });

  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }
    return groups; //[[g1, g2], [g3, g4], [g5, g6]] diseño masonry
  });

  constructor() {
    this.loadTrendingsGifs();
  }

  loadTrendingsGifs() {
    if (this.trendingGifsLoading()) return;
    this.trendingGifsLoading.set(true);

    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          offset: this.trendigPage() * 20,
        },
      })
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        this.trendingGifs.update((currentGifs) => [...currentGifs, ...gifs]);
        this.trendingGifsLoading.set(false);
        this.trendigPage.update((page) => page + 1);
      });
  }

  searchGifs(query: string) {
    return this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          q: query,
        },
      })
      .pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

        // Historial
        tap((items) => {
          this.searchHistory.update((history) => ({
            ...history,
            [query.toLowerCase()]: items,
          }));
        }),
      );
  }

  getHistoryGifs(query: string) {
    return this.searchHistory()[query.toLowerCase()] ?? [];
  }

  loadHistoryFromStorage() {
    const historyString = localStorage.getItem('HistoryGifs');
    if (historyString) {
      return JSON.parse(historyString);
    }
    return {};
  }
}
