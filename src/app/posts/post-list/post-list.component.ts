
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, ViewChild, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, scan, mergeMap, throttleTime } from 'rxjs/operators';
import { Post } from '../post';

import { PaginationService } from '../../core/pagination.service';
import { AuthService } from '../../core/auth.service';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

   

export class PostListComponent implements OnInit {

/*  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  batch = 20;
  theEnd = false;

  offset = new BehaviorSubject(null);
  infinite: Observable<any[]>;
*/
  posts: Observable<Post[]>;
  constructor(
      private route: ActivatedRoute,
      private db: AngularFirestore,
      public page: PaginationService,
      private postService: PostService,
      public auth: AuthService) {

  /*  const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap(n => this.getBatch(n)),
      scan((acc, batch) => {
        return { ...acc, ...batch };
      }, {})
    );

    this.infinite = batchMap.pipe(map(v => Object.values(v)));*/
  }

   ngOnInit() {
     /*const foo = this.route.snapshot.data.dataReload;
             console.log('dataReload');
             console.log(foo);*/

    // this.posts = this.postService.getPosts();
        console.log('PostListComponent:');
        console.log(this);
       // this.page.clearCache();
   //  this.page.reset();
     this.page.init('posts', 'published', { reverse: true, prepend: false });
        //console.log('PostListComponent (page):');
        //console.log(this.page);
  }

   scrollHandler(e) {
    if (e === 'bottom') {
              console.log('bottom');
      this.page.more();
    }
  }

  /* getBatch(offset) {
    console.log(offset);
    return this.db
      .collection('posts', ref =>
        ref
          .orderBy('title')
          .startAfter(offset)
          .limit(this.batch)
      )
      .snapshotChanges()
      .pipe(
        tap(arr => (arr.length ? null : (this.theEnd = true))),
        map(arr => {
          return arr.reduce((acc, cur) => {
            const id = cur.payload.doc.id;
            const data = cur.payload.doc.data();
            return { ...acc, [id]: data };
          }, {});
        })
      );
  }

  nextBatch(e, offset) {
    if (this.theEnd) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    console.log(`${end}, '>=', ${total}`);
    if (end === total) {
      this.offset.next(offset);
    }
  }

  trackByIdx(i) {
    return i;
  }*/

  delete(id: string) {
    this.postService.delete(id);
  }

}
