import { Http } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: Http) {}

  public getNews(customSource: string): Observable<any> {
    return this.http.get('v2/top-headlines', {
      params: {
        apiKey: environment.apiKey,
        sources: customSource,
      },
    });
  }
}
