import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
// Services
import { AuthService } from './core/auth.service';
import { PaginationService } from './core/pagination.service';
import { PostService } from './posts/post.service';
// Components
import { AppComponent } from './app.component';
// import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { PostsModule } from './posts/posts.module';
// Directives
import { ScrollableDirective } from './scrollable.directive';



@NgModule({
  declarations: [
    AppComponent,
    ScrollableDirective
   // LoadingSpinnerComponent
  ],
  imports: [
   // ScrollDispatchModule,
   // ScrollingModule,
    BrowserModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase, 'my-app-name'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    PostsModule,
    AppRoutingModule //https://stackoverflow.com/questions/48991372/angular-error-uncaught-in-promise-at-webpackasynccontext-eval-at-src
],
  providers: [AuthService, PostService, PaginationService],
  bootstrap: [AppComponent],
   schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AppModule { }
