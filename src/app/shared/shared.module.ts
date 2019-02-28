import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    RouterModule

  ],
  exports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    NavbarComponent,
    RouterModule
  ]
})
export class SharedModule { }
