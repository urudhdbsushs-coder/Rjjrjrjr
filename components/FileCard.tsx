
import React, { useState, useEffect } from 'react';
import { FileData, Language } from '../types';
import { translations } from '../translations';

interface FileCardProps {
  file: FileData;
  lang: Language;
  timerDuration: number;
  onToast: (msg: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, lang, timerDuration, onToast }) => {
  const [adCount, setAdCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const t = translations[lang];

  useEffect(() => {
    const saved = localStorage.getItem(`adCount_${file.id}`);
    if (saved) setAdCount(parseInt(saved));
  }, [file.id]);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const isUnlocked = adCount >= file.requiredAds;
  const progressPercent = Math.min(100, (adCount / file.requiredAds) * 100);

  const handleAction = async () => {
    if (isProcessing || countdown > 0) return;

    if (isUnlocked) {
      onToast(t.toast_download_starting);
      window.open(file.downloadUrl, '_blank');
      return;
    }

    setIsProcessing(true);
    try {
      if (typeof window.showAdexora === 'function') {
        await window.showAdexora();
        
        const newCount = adCount + 1;
        setAdCount(newCount);
        localStorage.setItem(`adCount_${file.id}`, newCount.toString());

        if (newCount >= file.requiredAds) {
          onToast(t.toast_unlocked);
        } else {
          onToast(t.toast_progress.replace('{adCount}', newCount.toString()).replace('{requiredCount}', file.requiredAds.toString()));
          setCountdown(timerDuration);
        }
      } else {
        throw new Error("Ad SDK not loaded");
      }
    } catch (err) {
      onToast(t.toast_ad_error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="premium-card group relative bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col h-full shadow-sm">
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img 
          src={file.thumbnailUrl || `https://images.unsplash.com/photo-1618401471353-b98aade1555a?q=80&w=400&h=225&auto=format&fit=crop`} 
          alt={file.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x225/f1f5f9/64748b?text=File+Preview'; }}
        />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {file.isHot && (
                <span className="px-2.5 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-rose-500/20 animate-pulse-soft">
                    Hot
                </span>
            )}
            <span className="px-2.5 py-1 bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-medium rounded-lg">
                {file.category || 'Asset'}
            </span>
        </div>
        
        {/* Play/Unlock Overlay */}
        {!isUnlocked && (
            <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30">
                    <i className="fas fa-lock-open text-sm" />
                 </div>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
            <h3 className="text-lg font-bold text-slate-900 mb-1.5 leading-tight group-hover:text-indigo-600 transition-colors truncate" title={file.title}>
                {file.title}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 h-8">
                {file.description}
            </p>
        </div>

        {/* Progress System */}
        <div className="mt-5 mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.progress_label}</span>
            <span className="text-xs font-bold text-slate-700">{adCount} / {file.requiredAds}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 rounded-full ${isUnlocked ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.2)]'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleAction}
          disabled={isProcessing || countdown > 0}
          className={`group/btn relative w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden active:scale-[0.98] disabled:opacity-80 ${
            isUnlocked 
              ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20" 
              : "bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-600/10"
          }`}
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : countdown > 0 ? (
            <span className="flex items-center gap-2">
                <i className="fas fa-clock text-xs opacity-70" />
                {t.verifying_button.replace('{countdown}', countdown.toString())}
            </span>
          ) : isUnlocked ? (
            <><i className="fas fa-download text-xs" /> {t.download_now_button}</>
          ) : (
            <><i className="fas fa-bolt text-xs text-yellow-400" /> {t.unlock_button.replace('{adCount}', adCount.toString()).replace('{requiredCount}', file.requiredAds.toString())}</>
          )}
          
          {/* Subtle Flash Effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover/btn:animate-[shimmer-load_2s_infinite]" />
        </button>
      </div>
    </div>
  );
};

export default FileCard;
