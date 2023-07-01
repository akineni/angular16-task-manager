import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { 
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
  GoogleSigninButtonModule
 } from '@abacritt/angularx-social-login';
import { environment as env } from './../environments/environment';
import { PreLoaderComponent } from './components/pre-loader/pre-loader.component';
import { NgArrayPipesModule } from 'ngx-pipes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { TaskEditorComponent } from './components/task-editor/task-editor.component';
import { TaskViewerComponent } from './components/task-viewer/task-viewer.component';
import { AuthComponent } from './components/auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    PreLoaderComponent,
    TaskEditorComponent,
    TaskViewerComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    NgArrayPipesModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              env.GOOGLE_PROVIDER_ID, { oneTapEnabled: false }
              /*oneTapEnabled: Disable popup mode.
                Popup is showing even when user is loggedIn on app level and causing
                abnormal behaviour on signOut.
                
                Could find a way to disable it when user is logged in (if possible)
              */
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(env.FACEBOOK_PROVIDER_ID)
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }