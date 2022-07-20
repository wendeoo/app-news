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

  public news: News = {};
  public sources: any[] = [
    'google-news-br',
    'blasting-news-br',
    'info-money',
    'CNN',
  ];

  public sourceIndex: number = Math.floor(Math.random() * this.sources.length);
  public sourceNameIndex: string = '';
  public articles: any;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.getNews();
  }

  public getNews(): void {
    this.newsService
      .getNews(this.sources[this.sourceIndex])
      .subscribe((response) => {
        this.news = response;
        this.articles = response.articles;
      });
  }

  public changeSource(): void {
    this.sourceIndex = (this.sourceIndex + 1) % this.sources.length;
    this.getNews();
  }

  public goTo(url: any): void {
    window.open(url, '_blank');
  }

  public goToTop(): void {
    window.scrollTo(0, 0);
  }
}
