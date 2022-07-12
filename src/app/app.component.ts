import { NewsService } from './services/news.service';
import { Component, OnInit } from '@angular/core';
import { News } from './interfaces/news';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'app-news';

  public news?: News;
  public sources: string[] = [
    'google-news-br',
    'blasting-news-br',
    'globo',
    'info-money',
  ];
  public sourceIndex: number = 1;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.getNews();
  }

  public getNews(): void {
    this.newsService
      .getNews(this.sources[this.sourceIndex])
      .subscribe((response) => {
        this.news = response;
        console.log(this.news);
      });
  }
}
