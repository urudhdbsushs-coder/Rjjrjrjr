
import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { db } from './firebase';
import { 
  FileData, 
  SliderData, 
  AdSettings, 
  GeneralSettings, 
  Language 
} from './types';
import { translations } from './translations';
import Toast from './components/Toast';
import AdSlot from './components/AdSlot';
import ImageSlider from './components/ImageSlider';
import LanguageModal from './components/LanguageModal';
import FileCard from './components/FileCard';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [sliders, setSliders] = useState<SliderData[]>([]);
  const [adSettings, setAdSettings] = useState<AdSettings>({});
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({ timerDuration: 10 });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('userLanguage') as Language;
    if (saved && ['en', 'hi', 'bn'].includes(saved)) {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    if (!lang) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const adDoc = await getDoc(doc(db, "settings", "ads"));
        if (adDoc.exists()) setAdSettings(adDoc.data());

        const genDoc = await getDoc(doc(db, "settings", "general"));
        if (genDoc.exists()) setGeneralSettings(prev => ({ ...prev, ...genDoc.data() }));

        const sliderQuery = query(collection(db, "sliders"), orderBy("createdAt", "desc"));
        const sliderSnap = await getDocs(sliderQuery);
        setSliders(sliderSnap.docs.map(d => d.data() as SliderData));

        const fileQuery = query(collection(db, "files"), orderBy("createdAt", "desc"));
        const fileSnap = await getDocs(fileQuery);
        setFiles(fileSnap.docs.map(d => ({ id: d.id, ...d.data() } as FileData)));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [lang]);

  const t = lang ? translations[lang] : translations.en;

  const categories = useMemo(() => {
    const base = ['All'];
    const dynamic = Array.from(new Set(files.map(f => f.category).filter(Boolean)));
    return [...base, ...dynamic];
  }, [files]);

  const filteredFiles = useMemo(() => {
    let result = files;
    if (activeCategory !== 'All') {
      result = result.filter(f => f.category === activeCategory);
    }
    const queryStr = searchQuery.toLowerCase();
    return result.filter(f => 
      f.title.toLowerCase().includes(queryStr) || 
      f.description.toLowerCase().includes(queryStr)
    );
  }, [files, searchQuery, activeCategory]);

  const handleLanguageSelect = (selectedLang: Language) => {
    setLang(selectedLang);
    localStorage.setItem('userLanguage', selectedLang);
  };

  if (!lang) {
    return <LanguageModal onSelect={handleLanguageSelect} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sticky Premium Navbar */}
      <nav className="glass-nav sticky top-0 z-[60] py-4">
        <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 transition-transform group-hover:rotate-6">
                <i className="fas fa-bolt text-lg" />
            </div>
            <div className="flex flex-col">
                <span className="brand-font text-2xl font-black text-slate-900 leading-none">{t.main_title}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Premium Assets</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
                {['en', 'hi', 'bn'].map((l) => (
                    <button 
                        key={l}
                        onClick={() => handleLanguageSelect(l as Language)}
                        className={`px-5 py-2 rounded-xl text-[11px] font-extrabold uppercase transition-all ${lang === l ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        {l}
                    </button>
                ))}
             </div>
             <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
             <button className="hidden sm:block text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                Community
             </button>
             <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
                Support Us
             </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-6 max-w-7xl pt-16">
        {/* Hero Section */}
        <section className="mb-20 text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
            Unlock Premium <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Digital Resources</span>
          </h2>
          <p className="text-slate-500 mb-12 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            {t.main_subtitle}
          </p>
          
          <div className="max-w-2xl mx-auto relative group">
             <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <i className="fas fa-search text-lg" />
             </div>
             <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search_placeholder} 
                className="w-full py-6 pl-16 pr-8 rounded-[2.5rem] bg-white border-2 border-slate-100 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all shadow-2xl shadow-slate-200/50 text-slate-700 font-medium text-lg"
              />
          </div>
        </section>

        {/* Ad Slot 1 */}
        <AdSlot adCode={adSettings.adSlot1} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm" />

        {/* Featured Slider */}
        <div className="mb-20">
            <ImageSlider slides={sliders} />
        </div>

        {/* Discovery & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-3 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-4 shrink-0">Explore:</span>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat || 'All')}
                        className={`category-pill shrink-0 px-8 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                            activeCategory === (cat || 'All') 
                                ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 scale-105 active' 
                                : 'bg-white text-slate-500 border border-slate-200'
                        }`}
                    >
                        {cat === 'All' ? t.category_all : cat}
                    </button>
                ))}
            </div>
            
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <i className="fas fa-sort-amount-down"></i>
                <span>Sorted By Latest</span>
            </div>
        </div>

        {/* Ad Slot 2 */}
        <AdSlot adCode={adSettings.adSlot2} className="mb-12" />

        {/* Content Feed */}
        <section className="pb-24">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {t.available_files}
            </h3>
            <div className="h-px flex-grow bg-slate-200"></div>
            <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase">
                {filteredFiles.length} Found
            </span>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
                    <div className="aspect-video skeleton rounded-3xl mb-6" />
                    <div className="h-5 w-3/4 skeleton rounded-xl mb-4" />
                    <div className="h-3 w-full skeleton rounded-xl mb-2" />
                    <div className="h-3 w-1/2 skeleton rounded-xl mb-10" />
                    <div className="h-14 w-full skeleton rounded-2xl" />
                </div>
              ))}
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {filteredFiles.map(file => (
                <FileCard 
                  key={file.id} 
                  file={file} 
                  lang={lang} 
                  timerDuration={generalSettings.timerDuration}
                  onToast={setToastMessage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <i className="fas fa-cloud-moon text-5xl text-slate-200" />
              </div>
              <p className="text-2xl font-black text-slate-800 mb-3">{t.no_results_text}</p>
              <p className="text-slate-400 mb-10 font-medium">Try broadening your search or switching categories.</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Luxury Footer */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12 mt-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <AdSlot adCode={adSettings.adSlot3} className="mb-24 rounded-3xl" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-20 border-b border-slate-50">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                        <i className="fas fa-layer-group text-lg" />
                    </div>
                    <span className="brand-font text-3xl font-black text-slate-900 tracking-tighter">{t.main_title}</span>
                </div>
                <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-md font-medium">
                    The ultimate destination for premium digital assets. Supported by the community, powered by you.
                </p>
                <div className="flex gap-4">
                    {['facebook', 'twitter', 'instagram', 'youtube', 'telegram'].map(icon => (
                        <a key={icon} href="#" className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1">
                            <i className={`fab fa-${icon} text-lg`} />
                        </a>
                    ))}
                </div>
            </div>
            
            <div>
                <h4 className="font-black text-slate-900 mb-8 uppercase text-xs tracking-[0.2em]">Platform</h4>
                <ul className="text-slate-500 space-y-5 font-bold text-sm">
                    <li className="hover:text-indigo-600 cursor-pointer transition-colors">Resources</li>
                    <li className="hover:text-indigo-600 cursor-pointer transition-colors">Developer API</li>
                    <li className="hover:text-indigo-600 cursor-pointer transition-colors">Support Center</li>
                    <li><a href="admin.html" className="text-indigo-600 hover:text-indigo-800 transition-colors">Admin Portal</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-black text-slate-900 mb-8 uppercase text-xs tracking-[0.2em]">Quick Access</h4>
                <div className="flex flex-col gap-3">
                    {['en', 'hi', 'bn'].map((l) => (
                        <button 
                            key={l}
                            onClick={() => handleLanguageSelect(l as Language)}
                            className={`flex justify-between items-center px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase transition-all border ${lang === l ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'}`}
                        >
                            {l === 'en' ? 'English' : l === 'hi' ? 'Hindi' : 'Bengali'}
                            {lang === l && <i className="fas fa-check-circle text-xs" />}
                        </button>
                    ))}
                </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8 mt-12">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
                &copy; {new Date().getFullYear()} {t.main_title} • Digital Excellence
              </p>
              <div className="flex gap-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="hover:text-slate-900 cursor-pointer transition-colors">Privacy Policy</span>
                  <span className="hover:text-slate-900 cursor-pointer transition-colors">Terms of Service</span>
              </div>
          </div>
        </div>
      </footer>

      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
};

export default App;
