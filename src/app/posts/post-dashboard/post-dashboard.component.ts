import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
// https://stackoverflow.com/questions/53480280/angular-fire-angularfirestorage-getdownloadurl
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../core/auth.service';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.css']
})
export class PostDashboardComponent implements OnInit {
  content: string;
  image: string;
  title: string;

  saving = 'Create Post';

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(
    private auth: AuthService,
    private postService: PostService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {}

  createPost() {
    const postData = {
      author: this.auth.authState.displayName || this.auth.authState.email,
      authorId: this.auth.currentUserId,
      content: this.content,
      image: this.image || null,
      published: new Date(),
      title: this.title
    };
    this.postService.create(postData);
    this.title = '';
    this.content = '';
    this.image = '';

    this.saving = 'Post Created!';
    setTimeout(() => (this.saving = 'Create Post'), 3000);
  }

/*  uploadImage(event) {
    const file = event.target.files[0];
    const path = `posts/${file.name}`;
    if (file.type.split('/')[0] !== 'image') {
      return alert('only image files');
    } else {
      const task = this.storage.upload(path, file);
      this.downloadURL = task.downloadURL();
      // https://stackoverflow.com/questions/50658836/angular-6-project-task-downloadurl-missing
      this.uploadPercent = task.percentageChanges();
      console.log('Image Uploaded!');
      this.downloadURL.subscribe(url => (this.image = url));
    }
  }*/
  // https://stackoverflow.com/questions/50541836/property-downloadurl-does-not-exist-on-type-angularfireuploadtask/50663965#50663965
  // https://stackoverflow.com/questions/38671444/user-does-not-have-permission-to-access-this-object-firebase-storage-android
   uploadImage(event) {
    const file = event.target.files[0];
    const path = `posts/${file.name}`;
   // const fileRef = this.storage.ref(path);
    if (file.type.split('/')[0] !== 'image') {
      return alert('only image files');
    } else {
      const task = this.storage.upload(path, file);
      const ref = this.storage.ref(path);
      this.uploadPercent = task.percentageChanges();
      console.log('Image Uploaded!');
      task.snapshotChanges().pipe(
         finalize(() => {
           this.downloadURL = ref.getDownloadURL();
           this.downloadURL.subscribe(url => (this.image = url));
         })
      )
      .subscribe();
    }
  }

 /* uploadImage(event) {
    const file = event.target.files[0];
    const filePath = `posts/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    if (file.type.split('/')[0] !== 'image') {
      return alert('Sólo archivos de imagen!!!');
    } else {
      const task = this.storage.upload(filePath, file);
      this.uploadPercent = task.percentageChanges();
      task.snapshotChanges()
        .pipe(
          finalize(() => fileRef.getDownloadURL()
            .subscribe(profileUrl => {
              this.image = profileUrl
              console.log('La URL es: ' + profileUrl);     
            })
          )
        )
        .subscribe();
      console.log('Image subida a Firestore');
    }
  }*/
}
