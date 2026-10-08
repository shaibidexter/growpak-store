import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-black text-gray-900 mb-6">تمام مصنوعات (All Products)</h1>
      <div class="bg-white border border-gray-200 rounded-2xl p-8 text-center">
        <p class="text-gray-500 mb-4">Catalog browser initialized. Select a crop from the home page or header to view crop-specific inputs.</p>
        <a routerLink="/" class="px-5 py-2.5 bg-primary-700 text-white rounded-xl font-bold text-sm">
          فصل کے مطابق انتخاب کریں (Shop by Crop)
        </a>
      </div>
    </div>
  `,
})
export class ShopComponent {}
