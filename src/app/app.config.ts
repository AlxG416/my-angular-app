import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';

const ngZorroConfig: NzConfig = {
  message: { nzTop: 100 },
  notification: { nzTop: 100 },
  theme: { primaryColor: '#1890ff' }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideNzConfig(ngZorroConfig),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
