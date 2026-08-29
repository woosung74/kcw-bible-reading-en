import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, BookOpen, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, Circle, Heart, Home, RotateCcw, Sparkles, Sunrise, Trophy } from 'lucide-react';
import { allBooks, TOTAL_CHAPTERS } from './bibleData';
import './styles.css';

const STORAGE_KEY = 'kcw-bible-progress-en-v1';
const DATES_KEY = 'kcw-bible-reading-dates-en-v1';
const ROUNDS_KEY = 'kcw-bible-completed-rounds-en-v1';
const ROUND_AWARDED_KEY = 'kcw-bible-round-awarded-en-v1';
const HISTORY_KEY = 'kcw-bible-reading-history-en-v1';
const BASE_URL = import.meta.env.BASE_URL;
const DAILY_VERSES = [
  { reference: 'Psalm 119:105', text: 'Thy word is a lamp unto my feet, and a light unto my path.' },
  { reference: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.' },
  { reference: 'Proverbs 3:5–6', text: 'Trust in the Lord with all thine heart, and he shall direct thy paths.' },
  { reference: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God.' },
  { reference: 'Jeremiah 29:11', text: 'I know the thoughts that I think toward you, thoughts of peace, and not of evil.' },
  { reference: 'Psalm 46:1', text: 'God is our refuge and strength, a very present help in trouble.' },
  { reference: 'Matthew 11:28', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.' },
  { reference: 'Romans 8:28', text: 'All things work together for good to them that love God.' },
  { reference: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.' },
  { reference: 'John 14:27', text: 'Peace I leave with you, my peace I give unto you.' },
  { reference: '2 Corinthians 5:17', text: 'If any man be in Christ, he is a new creature.' },
  { reference: 'Galatians 6:9', text: 'Let us not be weary in well doing: for in due season we shall reap.' },
  { reference: 'Psalm 37:5', text: 'Commit thy way unto the Lord; trust also in him; and he shall bring it to pass.' },
  { reference: 'Joshua 1:9', text: 'Be strong and of a good courage; for the Lord thy God is with thee.' },
  { reference: '1 Thessalonians 5:16–18', text: 'Rejoice evermore. Pray without ceasing. In every thing give thanks.' },
  { reference: 'Hebrews 11:1', text: 'Faith is the substance of things hoped for, the evidence of things not seen.' },
];
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

function readStoredNumber(key) {
  const value = Number(localStorage.getItem(key));
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

function readStoredBoolean(key) {
  return localStorage.getItem(key) === 'true';
}

function readSavedHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((entry) => entry && Number.isInteger(entry.round) && entry.round > 0 && typeof entry.chapter === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entry.date)) : [];
  } catch { return []; }
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

function DailyVerse() {
  const todayKey = localDateKey();
  const [year, month, day] = todayKey.split('-').map(Number);
  const dayNumber = Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  const verse = DAILY_VERSES[dayNumber % DAILY_VERSES.length];
  return <section className="daily-verse" aria-labelledby="daily-verse-title">
    <div className="daily-verse-label"><Sparkles /><div><p>{formatDate(todayKey)}</p><h2 id="daily-verse-title">Today’s Word</h2></div></div>
    <blockquote>“{verse.text}”</blockquote>
    <cite>{verse.reference}</cite>
  </section>;
}

function ReadingJourney({ completedRounds, currentRound, isComplete, onStartNext }) {
  return <section className={isComplete ? 'reading-journey complete' : 'reading-journey'} aria-labelledby="journey-title">
    <div className="journey-heading"><span><Trophy /></span><div><p>My Bible Reading Journey</p><h2 id="journey-title">{isComplete ? `Round ${completedRounds} Complete!` : `Reading Round ${currentRound}`}</h2></div></div>
    <div className="round-badges" aria-label={`${completedRounds} completed Bible readings`}>
      {completedRounds > 0 ? Array.from({ length: completedRounds }, (_, index) => <span key={index + 1}><CheckCircle2 /> Round {index + 1} Complete</span>) : <span className="round-pending">Walking with God’s Word toward your first complete reading.</span>}
    </div>
    <p className="journey-message">{isComplete ? `Congratulations! You have read all ${TOTAL_CHAPTERS.toLocaleString()} chapters of the Bible.` : `Every chapter is a meaningful step toward completing reading round ${currentRound}.`}</p>
    {isComplete && <button type="button" className="next-round" onClick={onStartNext}><BookOpen /> Start Round {completedRounds + 1}</button>}
  </section>;
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

function ReadingCalendar({ readingEntries }) {
  const todayKey = localDateKey();
  const today = new Date();
  const [monthDate, setMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const readingsByDate = useMemo(() => {
    const grouped = {};
    readingEntries.forEach(({ chapter, date, round }) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      (grouped[date] ||= []).push({ chapter, round });
    });
    Object.values(grouped).forEach((items) => items.sort((a, b) => a.round - b.round || a.chapter.localeCompare(b.chapter, 'en')));
    return grouped;
  }, [readingEntries]);

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
      {selectedReadings.length ? <ul>{selectedReadings.map(({ chapter, round }) => {
        const splitAt = chapter.lastIndexOf('-');
        return <li key={`${round}-${chapter}`}><CheckCircle2 /> <b>Round {round}</b> · {chapter.slice(0, splitAt)} {chapter.slice(splitAt + 1)}</li>;
      })}</ul> : <p>No Bible reading is recorded for this date.</p>}
    </div>
    <p className="calendar-note">Date-by-date records from completed rounds stay in your history. Existing progress is preserved; older chapters without dates cannot appear on the calendar.</p>
  </section>;
}

function App() {
  const [completed, setCompleted] = useState(readSaved);
  const [readingDates, setReadingDates] = useState(readSavedDates);
  const [completedRounds, setCompletedRounds] = useState(() => readStoredNumber(ROUNDS_KEY));
  const [roundAwarded, setRoundAwarded] = useState(() => readStoredBoolean(ROUND_AWARDED_KEY));
  const [readingHistory, setReadingHistory] = useState(readSavedHistory);
  const [selectedBook, setSelectedBook] = useState(allBooks[0]);
  const [testament, setTestament] = useState('old');
  const [tab, setTab] = useState('home');
  const [showBookDetail, setShowBookDetail] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])); }, [completed]);
  useEffect(() => { localStorage.setItem(DATES_KEY, JSON.stringify(readingDates)); }, [readingDates]);
  useEffect(() => { localStorage.setItem(ROUNDS_KEY, String(completedRounds)); }, [completedRounds]);
  useEffect(() => { localStorage.setItem(ROUND_AWARDED_KEY, String(roundAwarded)); }, [roundAwarded]);
  useEffect(() => { localStorage.setItem(HISTORY_KEY, JSON.stringify(readingHistory)); }, [readingHistory]);
  useEffect(() => { if ('serviceWorker' in navigator) navigator.serviceWorker.register(`${BASE_URL}sw.js`); }, []);
  useEffect(() => {
    if (completed.size === TOTAL_CHAPTERS && !roundAwarded) {
      setCompletedRounds(completedRounds + 1);
      setRoundAwarded(true);
    }
  }, [completed.size, completedRounds, roundAwarded]);

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
  const isRoundComplete = completed.size === TOTAL_CHAPTERS;
  const visibleCompletedRounds = completedRounds + (isRoundComplete && !roundAwarded ? 1 : 0);
  const currentRound = isRoundComplete ? visibleCompletedRounds : completedRounds + (roundAwarded ? 0 : 1);
  const readingEntries = useMemo(() => [
    ...readingHistory,
    ...Object.entries(readingDates).filter(([chapter]) => completed.has(chapter)).map(([chapter, date]) => ({ round: currentRound, chapter, date })),
  ], [completed, currentRound, readingDates, readingHistory]);
  const startNextRound = () => {
    const finishedRound = visibleCompletedRounds;
    const archivedEntries = Object.entries(readingDates).map(([chapter, date]) => ({ round: finishedRound, chapter, date }));
    setReadingHistory((history) => [...history.filter((entry) => entry.round !== finishedRound), ...archivedEntries]);
    setCompletedRounds(finishedRound);
    setRoundAwarded(false);
    setCompleted(new Set());
    setReadingDates({});
    setSelectedBook(allBooks[0]);
    setShowBookDetail(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const nextUnread = allBooks.find((book) => (doneByBook.get(book.name) || 0) < book.chapters) || allBooks[0];
  const todayCount = readingEntries.filter(({ date }) => date === localDateKey()).length;

  return <div className="app-shell">
    <Header />
    <main>
      {tab === 'home' && <>
        <section className="welcome"><Sunrise /><div><p>May God</p><h1>Bless you and be with you today!</h1><span>Family Bible Reading 2026–2027</span></div></section>
        <DailyVerse />
        <section className="dashboard">
          <ProgressRing completed={completed.size} />
          <div className="today-area"><div className="today-count"><small>Read Today</small><strong>{todayCount}<em> chapters</em></strong></div><button type="button" onClick={() => openBook(nextUnread)}><BookOpen /> Continue Reading</button><button type="button" className="calendar-shortcut" onClick={() => { setTab('calendar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><CalendarDays /> View Reading Calendar</button><p>Continue your journey through {nextUnread.name}.</p></div>
        </section>
        <ReadingJourney completedRounds={visibleCompletedRounds} currentRound={currentRound} isComplete={isRoundComplete} onStartNext={startNextRound} />
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
      {tab === 'calendar' && <div className="calendar-page"><div className="page-title"><h1>My Reading History</h1><p>See what you read today and review your progress by date.</p></div><ReadingCalendar readingEntries={readingEntries} /></div>}
      {tab === 'vision' && <div className="vision-page"><div className="page-title"><h1>Our Vision</h1><p>We read God’s Word and share the Gospel through our lives.</p></div><Vision /><section className="prayer"><h2>Our Hope and Prayer</h2><ol><li>We desire to love God more and know Him more.</li><li>We desire to love and serve our neighbors in New York and Westchester.</li><li>We look forward to the new revival God will bring to the Korean Church of Westchester.</li></ol></section><button type="button" className="reset" onClick={() => { if (confirm('Reset all progress, completed rounds, and reading history?')) { setCompleted(new Set()); setReadingDates({}); setReadingHistory([]); setCompletedRounds(0); setRoundAwarded(false); } }}><RotateCcw size={17} /> Reset Reading Progress</button></div>}
    </main>
    <nav className="bottom-nav" aria-label="Main navigation">
      {[["home","Home",Home],["bible","Bible",BookOpen],["calendar","Calendar",CalendarDays],["vision","Vision",Heart]].map(([key,label,Icon]) => <button type="button" key={key} className={tab === key ? 'active' : ''} onClick={() => { if (key === 'bible') setShowBookDetail(false); setTab(key); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Icon /><span>{label}</span></button>)}
    </nav>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
