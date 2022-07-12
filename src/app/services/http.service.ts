import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { Observable, BehaviorSubject, Subscription, map, of } from 'rxjs';

import {
  realTimeUpdateDelay,
  environment,
} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Http {
  private newRequisitionUrl: boolean[];

  private stopAutoUpdateValue: boolean[];

  private repeatSubscription: Subscription[];

  private repeatObservables: Observable<any[]>[];

  private repeatSubjects: BehaviorSubject<any[]>[];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.repeatSubjects = [];
    this.repeatObservables = [];
    this.newRequisitionUrl = [];
    this.repeatSubscription = [];
    this.stopAutoUpdateValue = [];
  }

  /**
   * Função de requisição HTTP Get
   *
   * @param {{}} url URL ser acessada
   * @param {{}} TypeGet Tipo do objeto a ser retornado Ex.: Usuário
   * @param {{}} cache se pode armazenar cache de requisição a ser acessada
   *
   *
   */

  public get<T>(url: any, options?: any): Observable<any> {
    const _url: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.api + url
    );
    const _securityUrl: any = this.sanitizer.sanitize(5, _url);

    if (!localStorage.getItem('devMode'))
      return this.http.get<T>(_securityUrl, options);

    if (localStorage.getItem(environment.api + url))
      return of(JSON.parse(localStorage.getItem(environment.api + url)!));
    else
      return this.http.get<T>(_securityUrl, options).pipe(
        map((res: any) => {
          localStorage.setItem(environment.api + url, JSON.stringify(res));
          return res;
        })
      );
  }

  public getExternal<T>(url: any): Observable<T> {
    const _safeResourceUrl: SafeResourceUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(url);
    const _safeUrl: any = this.sanitizer.sanitize(5, _safeResourceUrl);
    return this.http.get<T>(_safeUrl);
  }

  public postExternal<T>(url: any, body: any): Observable<T> {
    const _safeResourceUrl: SafeResourceUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(url);
    const _safeUrl: any = this.sanitizer.sanitize(5, +_safeResourceUrl);
    return this.http.post<T>(_safeUrl, body);
  }

  public getText<T>(url: string, options?: any): Observable<any> {
    const _safeResourceUrl: SafeResourceUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(environment.api + url);
    const _safeUrl: any = this.sanitizer.sanitize(5, _safeResourceUrl);

    let obj: any = {};
    if (options) {
      obj = options;
      obj.responseType = 'text' as 'json';
    } else obj = { responseType: 'text' as 'json' };

    return this.http.get<T>(_safeUrl, obj);
  }

  public getBlob<T>(url: string, options?: any): Observable<any> {
    const _safeResourceUrl: SafeResourceUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(environment.api + url);
    const _safeUrl: any = this.sanitizer.sanitize(5, _safeResourceUrl);
    let obj: any = {};
    if (options) {
      obj = options;
      obj.responseType = 'blob';
    } else obj = { responseType: 'blob' };
    return this.http.get<T>(_safeUrl, obj);
  }

  /**
   * Função de requisição HTTP post
   *
   * @param {{}} url URL ser acessada
   * @param {{}} params Parâmetros HTTP
   * @param {{}} data Objeto a ser enviado
   * @param {{}} SendType Tipo do objeto a ser enviado Ex.: AuthLogin
   * @param {{}} ReturnType Tipo do objeto a ser retornado Ex.: AuthReturn
   *
   */

  public post<SendType, ReturnType>(
    url: string,
    data: SendType,
    params?: HttpParams,
    returnText?: boolean
  ): Observable<ReturnType> {
    let _responseType = returnText ? ('text' as 'json') : 'json';

    const _safeResourceUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      environment.api + url
    );
    const _safeUrl: any = this.sanitizer.sanitize(4, _safeResourceUrl);

    if (
      !localStorage.getItem('devMode') ||
      (!url.includes('/list') &&
        !url.includes('/title') &&
        !url.includes('/main'))
    )
      return this.http.post<ReturnType>(_safeUrl, data, {
        responseType: _responseType,
        params,
      });

    if (localStorage.getItem(environment.api + url + JSON.stringify(data)))
      return of(
        JSON.parse(
          localStorage.getItem(environment.api + url + JSON.stringify(data))!
        )
      );
    else
      return this.http
        .post<ReturnType>(_safeUrl, data, {
          responseType: _responseType,
          params,
        })
        .pipe(
          map((res: any) => {
            localStorage.setItem(
              environment.api + url + JSON.stringify(data),
              JSON.stringify(res)
            );
            return res;
          })
        );
  }

  /**
   * Função de requisição HTTP patch
   *
   * @param {{}} url URL ser acessada
   * @param {{}} params Parâmetros HTTP
   * @param {{}} data Objeto a ser enviado
   * @param {{}} SendType Tipo do objeto a ser enviado Ex.: AuthLogin
   * @param {{}} ReturnType Tipo do objeto a ser retornado Ex.: AuthReturn
   *
   */

  public patch<SendType, ReturnType>(
    url: string,
    data: SendType,
    params?: HttpParams,
    returnText?: boolean
  ): Observable<ReturnType> {
    let _responseType = returnText ? ('text' as 'json') : 'json';

    const _safeResourceUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      environment.api + url
    );
    const _safeUrl: any = this.sanitizer.sanitize(4, _safeResourceUrl);
    return this.http.patch<ReturnType>(_safeUrl, data, {
      responseType: _responseType,
      params,
    });
  }

  /**
   * Função de requisição HTTP Put
   *
   * @param {{}} url URL ser acessada
   * @param {{}} SendType Tipo do objeto a ser enviado Ex.: Usuário
   *
   */

  public put<SendType, ReturnType>(
    url: string,
    data?: SendType,
    options?: any
  ): Observable<any> {
    const _safeResourceUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      environment.api + url
    );
    const _safeUrl: any = this.sanitizer.sanitize(4, _safeResourceUrl);
    return this.http.put<ReturnType>(_safeUrl, data, options);
  }

  /**
   * Função de requisição HTTP Delete
   *
   * @param {{}} url URL ser acessada
   *
   */

  public delete(url: string): Observable<any> {
    const _safeResourceUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      environment.api + url
    );
    const _safeUrl: any = this.sanitizer.sanitize(4, _safeResourceUrl);
    return this.http.delete<any>(_safeUrl);
  }

  public getRepeated<T>(url: any, update?: boolean): Observable<any> {
    if (this.newRequisitionUrl[url] === undefined)
      this.newRequisitionUrl[url] = true;
    if (this.stopAutoUpdateValue[url] === undefined)
      this.stopAutoUpdateValue[url] = false;

    if (!this.repeatObservables[url] || update || this.newRequisitionUrl[url]) {
      this.newRequisitionUrl[url] = false;
      if (!this.repeatSubjects[url])
        this.repeatSubjects[url] = new BehaviorSubject<T[]>([]);

      this.repeatObservables[url] = new Observable(() => {
        if (
          this.repeatSubscription[url] &&
          !this.repeatSubscription[url].closed
        )
          this.repeatSubscription[url].unsubscribe();

        this.repeatSubscription[url] = this.get<T[]>(url).subscribe(
          (values) => {
            this.repeatSubjects[url].next(values);

            if (this.stopAutoUpdateValue[url] === false)
              setTimeout(
                () => this.getRepeated(url, true),
                realTimeUpdateDelay
              );
            else {
              this.newRequisitionUrl[url] = true;
              this.stopAutoUpdateValue[url] = false;
            }
          }
        );
      });

      this.repeatObservables[url].subscribe();
    }

    return this.repeatSubjects[url];
  }

  public initCache(url: any): void {
    if (!this.repeatObservables[url]) {
      if (!this.repeatSubjects[url])
        this.repeatSubjects[url] = new BehaviorSubject<any[]>(undefined!);
      this.repeatObservables[url] = new Observable(() => {
        this.get(url).subscribe((values) => {
          this.repeatSubjects[url].next(values);
        });
      });
      this.repeatObservables[url].subscribe();
    }
  }

  public stopAutoUpdate(): void {
    Object.keys(this.stopAutoUpdateValue).forEach((key: any) => {
      this.stopAutoUpdateValue[key] = true;
    });
  }

  public cancelRepeatsRequests(url: any) {
    Object.keys(this.repeatSubscription)
      .filter((key) => key.includes(url))
      .forEach((key: any) => {
        this.repeatSubscription[key].unsubscribe();
        setTimeout(() => this.getRepeated(key, true), realTimeUpdateDelay);
      });
  }

  public clearCache() {
    this.repeatSubjects = [];
  }

  /**
   * Função de requisição HTTP dinâmica
   *
   * @param {string} method Qual metodo :  'Get' | 'Post' | 'Put' | 'Delete'.
   * @param {string} route rota ser acessada.
   * @param {{}} data Objeto a ser enviado caso precise.
   *
   */

  public execute<TType>(
    method: any,
    route: string,
    data?: any
  ): Observable<TType | boolean> {
    method.toUpperCase();
    switch (method) {
      case 'GET':
        return this.get<TType>('/' + route);
      case 'POST':
        return this.post('/' + route, data);
      case 'PUT':
        return this.put('/' + route, data);
      case 'DELETE':
        return this.delete('/' + route);
      default:
        return undefined!;
    }
  }
}
