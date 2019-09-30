import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { PostService } from '../post.service';
import { Post } from '../post';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  limitNumber = 20;

  posts: Observable<Post[]>;
  constructor(private postService: PostService, public auth: AuthService) {}

  ngOnInit() {
    this.postService.getFirstPosts();
    this.posts = this.postService.data;
    console.log('this.posts:', this.posts);
  }

  delete(id: string) {
    this.postService.delete(id);
  }

 onScrollDown() {
    console.log('FUNC: onScrollDown()');
    console.log('this.limitNumber', this.limitNumber);
    this.limitNumber+= 3;
    console.log('this.limitNumber (after iteration)', this.limitNumber);
   // this.postService.getLimitedPosts(this.limitNumber);
    this.postService.getMorePosts(this.limitNumber);
    console.log('this.posts:', this.posts);

  }
}
