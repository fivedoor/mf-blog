import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostDashboardComponent } from './post-dashboard/post-dashboard.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostListComponent } from './post-list/post-list.component';
import { SharedModule } from '../shared/shared.module';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes: Routes = [
  { path: 'blog', component: PostListComponent },
  { path: 'blog/:id', component: PostDetailComponent },
  { path: 'dashboard', component: PostDashboardComponent },
];

@NgModule({
  declarations: [
  		PostDashboardComponent, 
  		PostDetailComponent, 
  		PostListComponent
  	],
    imports: [
    	SharedModule,
    	RouterModule.forChild(routes),
    	InfiniteScrollModule


    	]


})
export class PostsModule { }
