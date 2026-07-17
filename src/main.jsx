import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, BookOpen, Check, CheckCircle2, ChevronRight, Circle, Heart, Home, RotateCcw, Sunrise } from 'lucide-react';
import { allBooks, TOTAL_CHAPTERS } from './bibleData';
import './styles.css';

const STORAGE_KEY = 'kcw-bible-progress-en-v1';
const BASE_URL = import.meta.env.BASE_URL;
const VALID_PROGRESS_KEYS = new Set(
  allBooks.flatMap((book) => Array.from({ length: book.chapters }, (_, index) => `${book.name}-${index + 1}`)),
);

function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return new Set(Array.isArray(saved) ? saved.filter((key) => VALID_PROGRESS_KEYS.has(key)) : []);
  } catch {
    return new Set();
  }
}

function Header() {
  return <header className="site-header">
    <img src={`${BASE_URL}church-logo.jpg`} alt="Korean Church of Westchester" />
    <span>Family Bible Reading</span>
  </header>;
}

function ProgressRing({ completed }) {
  const percent = Math.round((completed / TOTAL_CHAPTERS) * 100);
  return <div className="progress-ring" style={{ '--progress': `${percent * 3.6}deg` }} aria-label={`Overall progress: ${percent}%`}>
    <div className="progress-inner"><small>Overall Progress</small><strong>{percent}<em>%</em></strong><span>{completed.toLocaleString()} / {TOTAL_CHAPTERS.toLocaleString()} chapters</span></div>
  </div>;
}

function BookRow({ book, done, onSelect }) {
  const percent = Math.round((done / book.chapters) * 100);
  const isComplete = done === book.chapters;
  return <button type="button" className="book-row" onClick={onSelect}>
    <span className={isComplete ? 'book-status complete' : 'book-status'}>{isComplete ? <CheckCircle2 /> : <Circle />}</span>
    <div className="book-row-copy"><strong>{book.name}</strong><span>{isComplete ? 'Reading complete' : `${done} of ${book.chapters} chapters read`}</span></div>
    <div className="mini-track"><span style={{ width: `${percent}%` }} /></div>
    <ChevronRight size={20} aria-hidden="true" />
  </button>;
}

function ChapterGrid({ book, completed, toggleChapter, toggleBook }) {
  const done = Array.from({ length: book.chapters }, (_, i) => i + 1).filter((chapter) => completed.has(`${book.name}-${chapter}`)).length;
  const isComplete = done === book.chapters;
  return <section className="chapter-section" aria-labelledby="book-title">
    <div className="section-heading"><div><BookOpen size={27} /><h2 id="book-title">{book.name}</h2></div><span><b>{done}</b> / {book.chapters} complete</span></div>
    <div className="book-progress"><span style={{ width: `${(done / book.chapters) * 100}%` }} /></div>
    <button type="button" className={isComplete ? 'complete-book active' : 'complete-book'} onClick={() => toggleBook(book)} aria-pressed={isComplete}>
      {isComplete ? <CheckCircle2 /> : <Circle />}
      <span>{isComplete ? `${book.name} reading complete` : `Mark all of ${book.name} complete`}</span>
    </button>
    <p className="chapter-help">Tap a chapter number once to mark it complete. Tap it again to undo.</p>
    <div className="chapter-grid">
      {Array.from({ length: book.chapters }, (_, i) => i + 1).map((chapter) => {
        const checked = completed.has(`${book.name}-${chapter}`);
        return <button type="button" key={chapter} className={checked ? 'chapter done' : 'chapter'} aria-label={`${book.name} chapter ${chapter}${checked ? ', completed' : ''}`} aria-pressed={checked} onClick={() => toggleChapter(book.name, chapter)}>
          {checked ? <><Check size={16} />{chapter}</> : chapter}
        </button>;
      })}
    </div>
  </section>;
}

function Vision() {
  return <section className="vision-panel">
    <Heart size={34} strokeWidth={1.7} />
    <p>Our Church Vision</p>
    <h2>A Church That Shares the Gospel</h2>
    <div className="gold-rule"><span /></div>
    <blockquote>“We desire to love God more<br />and know Him more.”</blockquote>
    <div className="world-vision">
      <span>Worship</span><span>Small Groups</span><span>Service</span><span>Evangelism</span><span>Discipleship</span>
    </div>
  </section>;
}

function App() {
  const [completed, setCompleted] = useState(readSaved);
  const [selectedBook, setSelectedBook] = useState(allBooks[0]);
  const [testament, setTestament] = useState('old');
  const [tab, setTab] = useState('home');
  const [showBookDetail, setShowBookDetail] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])); }, [completed]);
  useEffect(() => { if ('serviceWorker' in navigator) navigator.serviceWorker.register(`${BASE_URL}sw.js`); }, []);

  const doneByBook = useMemo(() => {
    const map = new Map();
    allBooks.forEach((book) => map.set(book.name, Array.from(completed).filter((key) => key.startsWith(`${book.name}-`)).length));
    return map;
  }, [completed]);

  const visibleBooks = testament === 'old' ? allBooks.slice(0, 39) : allBooks.slice(39);
  const toggleChapter = (name, chapter) => setCompleted((current) => {
    const next = new Set(current);
    const key = `${name}-${chapter}`;
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });
  const toggleBook = (book) => setCompleted((current) => {
    const next = new Set(current);
    const keys = Array.from({ length: book.chapters }, (_, index) => `${book.name}-${index + 1}`);
    const isComplete = keys.every((key) => next.has(key));
    keys.forEach((key) => { if (isComplete) next.delete(key); else next.add(key); });
    return next;
  });
  const openBook = (book) => {
    setSelectedBook(book);
    setTestament(book.testament);
    setShowBookDetail(true);
    setTab('bible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openBookList = (nextTestament = testament) => {
    setTestament(nextTestament);
    setShowBookDetail(false);
    setTab('bible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const nextUnread = allBooks.find((book) => (doneByBook.get(book.name) || 0) < book.chapters) || allBooks[0];

  return <div className="app-shell">
    <Header />
    <main>
      {tab === 'home' && <>
        <section className="welcome"><Sunrise /><div><p>May God</p><h1>Bless you and be with you today!</h1><span>Family Bible Reading 2026–2027</span></div></section>
        <section className="dashboard">
          <ProgressRing completed={completed.size} />
          <div className="today-area"><button type="button" onClick={() => openBook(nextUnread)}><BookOpen /> Today’s Reading</button><p>Continue your journey<br />through {nextUnread.name}.</p></div>
        </section>
        <div className="testament-links">
          <button type="button" onClick={() => openBookList('old')}><span className="round-icon blue"><BookOpen /></span><div><strong>Old Testament</strong><small>Genesis – Malachi</small></div><ChevronRight /></button>
          <button type="button" onClick={() => openBookList('new')}><span className="round-icon gold"><BookOpen /></span><div><strong>New Testament</strong><small>Matthew – Revelation</small></div><ChevronRight /></button>
        </div>
        <ChapterGrid book={selectedBook} completed={completed} toggleChapter={toggleChapter} toggleBook={toggleBook} />
        <Vision />
      </>}
      {tab === 'bible' && <section className="bible-view">
        {showBookDetail ? <>
          <button type="button" className="back-to-books" onClick={() => setShowBookDetail(false)}><ArrowLeft /> All Books</button>
          <ChapterGrid book={selectedBook} completed={completed} toggleChapter={toggleChapter} toggleBook={toggleBook} />
        </> : <>
          <div className="page-title"><h1>Choose a Book</h1><p>Select a book to view its chapters.</p></div>
          <div className="segment"><button type="button" className={testament === 'old' ? 'active' : ''} onClick={() => setTestament('old')}>Old Testament · 39</button><button type="button" className={testament === 'new' ? 'active' : ''} onClick={() => setTestament('new')}>New Testament · 27</button></div>
          <div className="book-list">{visibleBooks.map((book) => <BookRow key={book.name} book={book} done={doneByBook.get(book.name) || 0} onSelect={() => openBook(book)} />)}</div>
        </>}
      </section>}
      {tab === 'vision' && <div className="vision-page"><div className="page-title"><h1>Our Vision</h1><p>We read God’s Word and share the Gospel through our lives.</p></div><Vision /><section className="prayer"><h2>Our Hope and Prayer</h2><ol><li>We desire to love God more and know Him more.</li><li>We desire to love and serve our neighbors in New York and Westchester.</li><li>We look forward to the new revival God will bring to the Korean Church of Westchester.</li></ol></section><button type="button" className="reset" onClick={() => { if (confirm('Reset all of your Bible reading progress?')) setCompleted(new Set()); }}><RotateCcw size={17} /> Reset Reading Progress</button></div>}
    </main>
    <nav className="bottom-nav" aria-label="Main navigation">
      {[["home","Home",Home],["bible","Bible",BookOpen],["vision","Vision",Heart]].map(([key,label,Icon]) => <button type="button" key={key} className={tab === key ? 'active' : ''} onClick={() => { if (key === 'bible') setShowBookDetail(false); setTab(key); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Icon /><span>{label}</span></button>)}
    </nav>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
