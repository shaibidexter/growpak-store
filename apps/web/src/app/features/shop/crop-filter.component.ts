import { Component, input, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crop-filter',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Crop Header Banner -->
      <div class="bg-gradient-to-r from-primary-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-md">
        <div class="flex items-center gap-4 mb-3">
          <div class="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl">
            🌾
          </div>
          <div>
            <span class="text-xs font-bold text-primary-200 uppercase tracking-wider">Crop-Specific Agri Solutions</span>
            <h1 class="text-2xl sm:text-4xl font-black capitalize">{{ slug() }} فارمنگ گائیڈ اور پراڈکٹس</h1>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-primary-100 max-w-2xl">
          View certified seeds, fertilizers, insecticides, herbicides, and fungicides tailored specifically for {{ slug() }} cultivation in Pakistan.
        </p>
      </div>

      <!-- Crop-specific Tab Filter -->
      <div class="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-6">
        @for (tab of cropTabs; track tab.key) {
          <button
            (click)="activeTab.set(tab.key)"
            [class.bg-primary-700]="activeTab() === tab.key"
            [class.text-white]="activeTab() === tab.key"
            [class.bg-white]="activeTab() !== tab.key"
            [class.text-gray-700]="activeTab() !== tab.key"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-gray-200 shadow-sm transition-all hover:border-primary-400">
            {{ tab.labelUr }} ({{ tab.labelEn }})
          </button>
        }
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div class="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-4xl text-gray-400">
            🌱
          </div>
          <div>
            <span class="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full uppercase">
              {{ slug() }} Special
            </span>
            <h3 class="font-extrabold text-gray-900 text-base mt-1">Super Basmati Certified Seeds</h3>
            <p class="text-xs text-gray-500">Pack size: 20 kg | High Germination</p>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <span class="text-xs text-gray-400 block">قیمت:</span>
              <span class="font-black text-primary-800 text-lg">Rs. 4,800</span>
            </div>
            <a
              href="https://wa.me/+923260409887?text=Interested%20in%20Super%20Basmati%20Seeds"
              target="_blank"
              class="px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-bold transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CropFilterComponent {
  slug = input.required<string>();
  activeTab = signal<string>('all');

  cropTabs = [
    { key: 'all', labelEn: 'All Inputs', labelUr: 'تمام پراڈکٹس' },
    { key: 'seeds', labelEn: 'Seeds', labelUr: 'بیج' },
    { key: 'fertilizers', labelEn: 'Fertilizers', labelUr: 'کھادیں' },
    { key: 'insecticides', labelEn: 'Insecticides', labelUr: 'کیڑے مار ادویات' },
    { key: 'herbicides', labelEn: 'Herbicides', labelUr: 'جڑی بوٹی مار ادویات' },
    { key: 'fungicides', labelEn: 'Fungicides', labelUr: 'پھپھوندی کش' },
  ];
}
