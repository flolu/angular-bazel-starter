import {HttpClientModule} from '@angular/common/http'
import {APP_INITIALIZER, NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Store} from '@ngrx/store'
import {first, skipWhile} from 'rxjs/operators'

import {AuthActions, AuthSelectors} from '@client/store'

import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {NavigationComopnent} from './navigation.component'
import {PushNotificationService} from './push-notification.service'
import {ServiceWorkerService} from './service-worker.service'

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule.withServerTransition({appId: 'fullstack-bazel'}),
    AppRoutingModule,
  ],
  declarations: [AppComponent, NavigationComopnent],
  providers: [
    ServiceWorkerService,
    PushNotificationService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [Store],
      useFactory: (store: Store) => {
        return () => {
          store.dispatch(AuthActions.tryToAuthenticate())
          return store
            .select(AuthSelectors.isInitialized)
            .pipe(
              skipWhile(initialized => !initialized),
              first(),
            )
            .toPromise()
        }
      },
    },
  ],
})
export class AppBaseModule {}
