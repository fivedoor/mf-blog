import { Injectable } from '@angular/core';
import { AngularFirestore,AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Post } from './post';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable()
export class PostService {
  postsCollection: AngularFirestoreCollection<Post>;
  postDoc: AngularFirestoreDocument<Post>;

private _data: BehaviorSubject<Post[]>;
public data: Observable<Post[]>;
latestEntry: any;

  constructor(private afs: AngularFirestore) {
    this.postsCollection = this.afs.collection('posts', ref =>
      ref.orderBy('published', 'desc')
    );
  }
// https://stackoverflow.com/questions/49536684/firestore-angularfire2-pagination-query-items-by-range-startafterlastvis
// https://firebase.google.com/docs/firestore/query-data/query-cursors
// You need to return the doc to get the current cursor.
  getCollection(ref, queryFn?): Observable<any[]> {
    return this.afs.collection(ref, queryFn).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        const doc = a.payload.doc;
        return { id, ...data, doc };
      });
    }));
  }
// In your first query you subscribe to the collection and save the latest entry
  getFirstPosts() {
    console.log('FUNC: getFirstPosts()');
    this._data = new BehaviorSubject([]);
    this.data = this._data.asObservable();

  const postsRef = this.getCollection('posts', ref => ref
    .orderBy('published', 'desc')
    .limit(15))
    .subscribe(data => {
      this.latestEntry = data[data.length - 1].doc;
      this._data.next(data);
    });
  }

   getMorePosts(limitNumber) {
      console.log('FUNC: getMorePosts(' + limitNumber + ')');
      const postsRef = this.getCollection('posts', ref => ref
      .orderBy('published', 'desc')
       // Now you can use the latestEntry to query with startAfter
      /*.startAfter(this.latestEntry)*/
      .limit(limitNumber))
      .subscribe(data => {
        if (data.length) {
          // And save it again for more queries
         // this.latestEntry = data[data.length - 1].doc;
          this._data.next(data);
        }
      });
  }


  getPosts() {
    return this.postsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Post;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
  }

  getPostData(id: string) {
    this.postDoc = this.afs.doc<Post>(`posts/${id}`);
    return this.postDoc.valueChanges();
  }

  getPost(id: string) {
    return this.afs.doc<Post>(`posts/${id}`);
  }

  create(data: Post) {
    this.postsCollection.add(data);
  }

  delete(id: string) {
    return this.getPost(id).delete();
  }

  update(id: string, formData) {
    return this.getPost(id).update(formData);
  }
}
