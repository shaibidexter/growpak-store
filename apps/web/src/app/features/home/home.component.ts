import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);

  public crops = signal<any[]>([]);
  public categories = signal<any[]>([]);

  ngOnInit() {
    this.http.get<any>('http://localhost:5000/api/v1/cms/crops').subscribe({
      next: (res) => this.crops.set(res.data || []),
      error: () => {},
    });

    this.http.get<any>('http://localhost:5000/api/v1/cms/categories').subscribe({
      next: (res) => this.categories.set(res.data || []),
      error: () => {},
    });
  }
}
