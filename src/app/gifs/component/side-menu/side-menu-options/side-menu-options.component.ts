import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GifService } from '../../../services/gif.service';

interface MenuOption {
  label: string;
  subLabel: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.component.html',
  styleUrl: './side-menu-options.component.css',
})
export class SideMenuOptionsComponent {
  gifService = inject(GifService);

  menuOptions: MenuOption[] = [
    {
      label: 'Trending',
      subLabel: 'gifs populares',
      route: '/dashboard/trending',
      icon: 'fa-solid fa-chart-line',
    },

    {
      label: 'Buscador',
      subLabel: 'Buscador de gifs',
      route: '/dashboard/search',
      icon: 'fa-solid fa-search',
    },
  ];
}
