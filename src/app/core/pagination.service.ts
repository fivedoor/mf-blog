import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/scan';
//import 'rxjs/add/operator/take';
import { map, tap, take, scan } from 'rxjs/operators';

// https://angularfirebase.com/lessons/infinite-scroll-firestore-angular/
// https://www.academind.com/learn/javascript/rxjs-6-what-changed/
// https://www.learnrxjs.io/operators/filtering/take.html
interface QueryConfig {
    id?: string,
  path: string, //  path to collection
  field: string, // field to orderBy
  limit: number, // limit per query
  reverse: boolean, // reverse order?
  prepend: boolean // prepend to source?
}

@Injectable()
export class PaginationService {

  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query: QueryConfig;

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();


  constructor(private afs: AngularFirestore) { }

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  init(path: string, field: string, opts?: any) {
        console.log('FUNC: init()');

    this.query/*: QueryConfig */= {
      path,
      field,
      limit: 6,
      reverse: false,
      prepend: false,
      ...opts
    };
       // console.log(this.query.path);
    //this.data = null;

    const first = this.afs.collection(this.query.path, ref => {
      return ref
              .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
              .limit(this.query.limit);
    });
            console.log('first pre mapAndUpdate:');
            console.log(first);
    this.mapAndUpdate(first);

    // Create the observable array for consumption in components
    this.data = this._data.asObservable().pipe(
        scan( (acc, val) => {
          // ? then : is if...else shorthand
          return this.query.prepend ? val.concat(acc) : acc.concat(val);
        }));
            console.log('this.data');
            console.log(this.data);
           

  }


  // Retrieves additional data from firestore
  more() {
    console.log('FUNC: more()');
    const cursor = this.getCursor();

    const more = this.afs.collection(this.query.path, ref => {
      return ref
              .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
              .limit(this.query.limit)
              .startAfter(cursor);
    });
    this.mapAndUpdate(more);
  }


  // Determines the doc snapshot to paginate query
  private getCursor() {
            console.log('FUNC: getCursor()');
    const current = this._data.value;
    if (current.length) {
      return this.query.prepend ? current[0].doc : current[current.length - 1].doc
    }
    return null;
  }


  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {
   console.log('FUNC: mapAndUpdate()');
   console.log('this._done:');
   console.log(this._done);
   console.log('this._loading:');
   console.log(this._loading);

       if (this._done.value || this._loading.value) { return; }

    // loading
    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges().pipe(
      tap(arr => {
        let values = arr.map(snap => {
          const data = snap.payload.doc.data();
          const doc = snap.payload.doc;
          const id = snap.payload.doc.id;
              console.log('id snap');
              console.log(id);
          return { ...data, id, doc };
        });

        // If prepending, reverse the batch order
        values = this.query.prepend ? values.reverse() : values;

        // update source with new values, done loading
        this._data.next(values);
        this._loading.next(false);

        // no more values, mark done
        if (!values.length) {
          this._done.next(true);
        }
    }),
    take(1))
    .subscribe();

  }

  clearCache() {
    this.data = null;
  }

  // Reset the page
  reset() {
       console.log('FUNC: reset()');
    this._data.next([]);
    this._done.next(false);
  }
}
