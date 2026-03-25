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
  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>(this.loadHistoryFromStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  saveInStorage = effect(() => {
    const history = JSON.stringify(this.searchHistory());
    localStorage.setItem('HistoryGifs', history);
  });

  constructor() {
    this.loadTrendingsGifs();
  }

  loadTrendingsGifs() {
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
        },
      })
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        console.log(gifs);
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
