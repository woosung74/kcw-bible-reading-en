import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, BookOpen, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, Circle, Heart, Home, RotateCcw, Sunrise } from 'lucide-react';
import { allBooks, TOTAL_CHAPTERS } from './bibleData';
import './styles.css';

const STORAGE_KEY = 'kcw-bible-progress-en-v1';
const DATES_KEY = 'kcw-bible-reading-dates-en-v1';
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

function readSavedDates() {
  try {
    const saved = JSON.parse(localStorage.getItem(DATES_KEY) || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch { return {}; }
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(new Date(year, month - 1, day));
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

function ReadingCalendar({ completed, readingDates }) {
  const todayKey = localDateKey();
  const today = new Date();
  const [monthDate, setMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const readingsByDate = useMemo(() => {
    const grouped = {};
    Object.entries(readingDates).forEach(([chapterKey, dateKey]) => {
      if (!completed.has(chapterKey) || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return;
      (grouped[dateKey] ||= []).push(chapterKey);
    });
    Object.values(grouped).forEach((items) => items.sort((a, b) => a.localeCompare(b, 'en')));
    return grouped;
  }, [completed, readingDates]);

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7) cells.push(null);
  const selectedReadings = readingsByDate[selectedDate] || [];
  const moveMonth = (amount) => {
    const nextMonth = new Date(year, month + amount, 1);
    setMonthDate(nextMonth);
    setSelectedDate(localDateKey(nextMonth));
  };
  const returnToToday = () => {
    setMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(todayKey);
  };

  return <section className="calendar-panel" aria-labelledby="calendar-title">
    <div className="calendar-heading">
      <div><CalendarDays /><div><p>Reading by Date</p><h2 id="calendar-title">Reading Calendar</h2></div></div>
      <button type="button" onClick={returnToToday}>Today</button>
    </div>
    <div className="calendar-month-nav">
      <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month"><ChevronLeft /></button>
      <strong>{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(monthDate)}</strong>
      <button type="button" onClick={() => moveMonth(1)} aria-label="Next month"><ChevronRight /></button>
    </div>
    <div className="calendar-weekdays" aria-hidden="true">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}
    </div>
    <div className="calendar-grid">
      {cells.map((day, index) => {
        if (!day) return <span className="calendar-empty" key={`empty-${index}`} />;
        const dateKey = localDateKey(new Date(year, month, day));
        const count = readingsByDate[dateKey]?.length || 0;
        const className = ['calendar-day', dateKey === todayKey ? 'today' : '', dateKey === selectedDate ? 'selected' : '', count ? 'has-reading' : ''].filter(Boolean).join(' ');
        const countLabel = `${count} ${count === 1 ? 'chapter' : 'chapters'} read`;
        return <button type="button" key={dateKey} className={className} onClick={() => setSelectedDate(dateKey)} aria-label={`${formatDate(dateKey)}, ${countLabel}`}>
          <span>{day}</span>{count > 0 && <b>{count} ch.</b>}
        </button>;
      })}
    </div>
    <div className="calendar-detail" aria-live="polite">
      <div><span>{formatDate(selectedDate)}</span><strong>{selectedReadings.length} {selectedReadings.length === 1 ? 'chapter' : 'chapters'} read</strong></div>
      {selectedReadings.length ? <ul>{selectedReadings.map((key) => {
        const splitAt = key.lastIndexOf('-');
        return <li key={key}><CheckCircle2 /> {key.slice(0, splitAt)} {key.slice(splitAt + 1)}</li>;
      })}</ul> : <p>No Bible reading is recorded for this date.</p>}
    </div>
    <p className="calendar-note">Your existing progress remains unchanged. The calendar records chapters checked after this update.</p>
  </section>;
}

function App() {
  const [completed, setCompleted] = useState(readSaved);
  const [readingDates, setReadingDates] = useState(readSavedDates);
  const [selectedBook, setSelectedBook] = useState(allBooks[0]);
  const [testament, setTestament] = useState('old');
  const [tab, setTab] = useState('home');
  const [showBookDetail, setShowBookDetail] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])); }, [completed]);
  useEffect(() => { localStorage.setItem(DATES_KEY, JSON.stringify(readingDates)); }, [readingDates]);
  useEffect(() => { if ('serviceWorker' in navigator) navigator.serviceWorker.register(`${BASE_URL}sw.js`); }, []);

  const doneByBook = useMemo(() => {
    const map = new Map();
    allBooks.forEach((book) => map.set(book.name, Array.from(completed).filter((key) => key.startsWith(`${book.name}-`)).length));
    return map;
  }, [completed]);

  const visibleBooks = testament === 'old' ? allBooks.slice(0, 39) : allBooks.slice(39);
  const toggleChapter = (name, chapter) => {
    const key = `${name}-${chapter}`;
    const willComplete = !completed.has(key);
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setReadingDates((current) => {
      const next = { ...current };
      if (willComplete) next[key] = localDateKey(); else delete next[key];
      return next;
    });
  };
  const toggleBook = (book) => {
    const keys = Array.from({ length: book.chapters }, (_, index) => `${book.name}-${index + 1}`);
    const isComplete = keys.every((key) => completed.has(key));
    const today = localDateKey();
    setCompleted((current) => {
    const next = new Set(current);
    keys.forEach((key) => { if (isComplete) next.delete(key); else next.add(key); });
    return next;
    });
    setReadingDates((current) => {
      const next = { ...current };
      keys.forEach((key) => { if (isComplete) delete next[key]; else if (!completed.has(key)) next[key] = today; });
      return next;
    });
  };
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
  const todayCount = Object.entries(readingDates).filter(([key, date]) => completed.has(key) && date === localDateKey()).length;

  return <div className="app-shell">
    <Header />
    <main>
      {tab === 'home' && <>
        <section className="welcome"><Sunrise /><div><p>May God</p><h1>Bless you and be with you today!</h1><span>Family Bible Reading 2026–2027</span></div></section>
        <section className="dashboard">
          <ProgressRing completed={completed.size} />
          <div className="today-area"><div className="today-count"><small>Read Today</small><strong>{todayCount}<em> chapters</em></strong></div><button type="button" onClick={() => openBook(nextUnread)}><BookOpen /> Continue Reading</button><button type="button" className="calendar-shortcut" onClick={() => { setTab('calendar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><CalendarDays /> View Reading Calendar</button><p>Continue your journey through {nextUnread.name}.</p></div>
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
      {tab === 'calendar' && <div className="calendar-page"><div className="page-title"><h1>My Reading History</h1><p>See what you read today and review your progress by date.</p></div><ReadingCalendar completed={completed} readingDates={readingDates} /></div>}
      {tab === 'vision' && <div className="vision-page"><div className="page-title"><h1>Our Vision</h1><p>We read God’s Word and share the Gospel through our lives.</p></div><Vision /><section className="prayer"><h2>Our Hope and Prayer</h2><ol><li>We desire to love God more and know Him more.</li><li>We desire to love and serve our neighbors in New York and Westchester.</li><li>We look forward to the new revival God will bring to the Korean Church of Westchester.</li></ol></section><button type="button" className="reset" onClick={() => { if (confirm('Reset all of your Bible reading progress?')) { setCompleted(new Set()); setReadingDates({}); } }}><RotateCcw size={17} /> Reset Reading Progress</button></div>}
    </main>
    <nav className="bottom-nav" aria-label="Main navigation">
      {[["home","Home",Home],["bible","Bible",BookOpen],["calendar","Calendar",CalendarDays],["vision","Vision",Heart]].map(([key,label,Icon]) => <button type="button" key={key} className={tab === key ? 'active' : ''} onClick={() => { if (key === 'bible') setShowBookDetail(false); setTab(key); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Icon /><span>{label}</span></button>)}
    </nav>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
