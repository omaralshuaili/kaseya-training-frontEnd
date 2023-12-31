import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, concat, from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { openDB } from 'idb';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache: Map<HttpRequest<any>, HttpResponse<any>> = new Map();

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const key = `${req.method}:${req.urlWithParams}:${JSON.stringify(req.body)}`;
    if (req.method === 'GET') {
      // Handle GET requests as before
    } else if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      return next.handle(req).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            this.clearCache(); // Clear the entire cache after a mutation request
          }
        })
      );
    }
    else {
      // Let other types of requests pass through
      return next.handle(req);
    }
  
    


    return from(this.getCachedResponse(key)).pipe(
      switchMap(cachedResponse => {
        if (cachedResponse) {
          return of(new HttpResponse({ body: cachedResponse }));
        } else {
          return next.handle(req).pipe(
            tap(stateEvent => {
              if (stateEvent instanceof HttpResponse) {
                this.cacheResponse(key, stateEvent.body);
              }
            })
          );
        }
      })
    );
  }
  private dbPromise = this.openDatabase();
  private openDatabase() {
    return openDB('httpCache', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('httpCache')) {
          db.createObjectStore('httpCache');
        }
      },
    });
  }
  async cacheResponse(key: string, body: any) {
    const db = await this.dbPromise;
    await db.put('httpCache', body, key);
  }

  async getCachedResponse(key: string): Promise<any | undefined> {
    const db = await this.dbPromise;
    return await db.get('httpCache', key);
  }
  async clearCache(): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('httpCache', 'readwrite');
    await tx.objectStore('httpCache').clear();
    await tx.oncomplete;
  }
}
