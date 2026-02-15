
export interface FileData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  downloadUrl: string;
  requiredAds: number;
  category?: string;
  isHot?: boolean;
  createdAt?: any;
}

export interface SliderData {
  imageUrl: string;
  linkUrl?: string;
  createdAt?: any;
}

export interface AdSettings {
  adSlot1?: string;
  adSlot2?: string;
  adSlot3?: string;
}

export interface GeneralSettings {
  timerDuration: number;
}

export type Language = 'en' | 'hi' | 'bn';

export interface TranslationSet {
  main_title: string;
  main_subtitle: string;
  search_placeholder: string;
  available_files: string;
  no_results_text: string;
  no_slides: string;
  slides_error: string;
  no_files_uploaded: string;
  files_error: string;
  unlock_button: string;
  download_now_button: string;
  toast_download_starting: string;
  toast_progress: string;
  toast_unlocked: string;
  toast_ad_error: string;
  loading_ad: string;
  verifying_button: string;
  category_all: string;
  progress_label: string;
}

declare global {
  interface Window {
    showAdexora: () => Promise<void>;
  }
}
