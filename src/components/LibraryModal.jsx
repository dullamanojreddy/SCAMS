import React, { useEffect, useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  MapPin,
  BookmarkPlus,
  RefreshCw,
  BookMarked,
  Filter,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { LIBRARY_BOOKS, ISSUED_BOOKS, USER_PROFILE } from '../data/mockData';
import { api } from '../api/client';

export const LibraryModal = ({ isOpen, onClose, currentUser = USER_PROFILE }) => {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'issued' | 'recommendations'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [issuedList, setIssuedList] = useState(ISSUED_BOOKS);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [renewMessage, setRenewMessage] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    api.get('/api/v1/library').then((items) => {
      if (Array.isArray(items) && items.length) {
        setBooks(items.map((book) => ({
          ...book,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          subject: book.subject || book.department,
          shelfLocation: book.shelfLocation || book.shelf_location || book.shelf,
          totalCopies: book.totalCopies ?? book.total_copies ?? 1,
          availableCopies: book.availableCopies ?? book.available_copies ?? (book.available ? 1 : 0),
          coverImage: book.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=240&auto=format&fit=crop&q=80',
          edition: book.edition || 'Latest Edition',
          isCourseRecommended: book.isCourseRecommended ?? Boolean(book.course_tags?.length),
          courseTags: book.courseTags || book.course_tags || [],
          isAvailable: book.available ?? (book.availableCopies ?? book.available_copies ?? 0) > 0,
        })));
      }
    }).catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ['All', 'Computer Networks', 'DBMS', 'Algorithms & Data Structures', 'Artificial Intelligence', 'Operating Systems'];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || book.subject === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recommendedBooks = books.filter((b) => b.isCourseRecommended || b.courseTags?.length);

  const handleRenew = (bookId) => {
    setIssuedList((prev) =>
      prev.map((item) => {
        if (item.id === bookId) {
          return {
            ...item,
            dueDate: '05 Sep 2025',
            daysRemaining: 18,
            canRenew: false,
            status: 'Renewed',
          };
        }
        return item;
      })
    );
    setRenewMessage('Book successfully renewed for an additional 14 days!');
    setTimeout(() => setRenewMessage(null), 3500);
  };

  const handleReserve = (book) => {
    if (reservedBooks.includes(book.id)) {
      setReservedBooks((prev) => prev.filter((id) => id !== book.id));
    } else {
      api.post(`/api/v1/library/${book.id}/reserve`, {}).catch(() => {});
      setReservedBooks((prev) => [...prev, book.id]);
      setRenewMessage(`Reserved "${book.title}". Collect from Circulation Desk within 24h.`);
      setTimeout(() => setRenewMessage(null), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-outfit">Central Library & E-Resource Catalog</h3>
                <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
                  REQ-4.5 MODULE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Vasavi College of Engineering • Over 120,000+ volumes, IEEE/ACM digital access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              <span>Search Catalog ({books.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('issued')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer relative ${
                activeTab === 'issued'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 text-cyan-600" />
              <span>My Issued Books ({issuedList.length})</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-0.5"></span>
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'recommendations'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Course Recommendations</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                IT 3rd Year
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Card: {currentUser?.libraryCardNo || 'LIB-VCE-2024-152'}</span>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {renewMessage && (
          <div className="mx-6 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 flex items-center gap-2 shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{renewMessage}</span>
          </div>
        )}

        {/* Tab 1: Catalog Search */}
        {activeTab === 'catalog' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by book title, author, subject, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {filteredBooks.map((book) => {
                const isReserved = reservedBooks.includes(book.id);
                return (
                  <div
                    key={book.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-3.5">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-16 h-22 object-cover rounded-lg border border-slate-200 shadow-xs shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                              {book.subject}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                book.availableCopies > 0
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {book.availableCopies > 0
                                ? `${book.availableCopies} of ${book.totalCopies} Available`
                                : 'All Issued'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                            {book.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">By {book.author}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{book.edition}</p>
                        </div>
                      </div>

                      {/* Shelf Locator Badge */}
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="font-mono text-[11px]">{book.shelfLocation}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">ISBN: {book.isbn}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500">
                        {book.isCourseRecommended && (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-500" /> VCE Syllabus Core
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleReserve(book)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isReserved
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>{isReserved ? 'Reserved' : 'Reserve Book'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Issued Books */}
        {activeTab === 'issued' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-cyan-950">Borrowing Account Status</h4>
                <p className="text-xs text-cyan-800 mt-0.5">
                  Quota: 2/4 books issued • Late fee rate: ₹5.00/day after 14-day cycle
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">Outstanding Fine</div>
                <div className="text-base font-bold text-rose-600 font-mono">₹10.00</div>
              </div>
            </div>

            <div className="space-y-3">
              {issuedList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 font-bold font-mono">
                      📖
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{item.bookTitle}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.status === 'Overdue'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">By {item.author}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-mono">
                        <span>Issued: {item.issueDate}</span>
                        <span>•</span>
                        <span className="font-bold text-slate-700">Due: {item.dueDate}</span>
                        <span>•</span>
                        <span className="text-slate-400">{item.shelfLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Timeline</div>
                      <div
                        className={`text-xs font-bold font-mono ${
                          item.daysRemaining < 0 ? 'text-rose-600' : 'text-slate-900'
                        }`}
                      >
                        {item.daysRemaining < 0
                          ? `${Math.abs(item.daysRemaining)} Days Overdue`
                          : `${item.daysRemaining} Days Left`}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRenew(item.id)}
                      disabled={!item.canRenew}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                        item.canRenew
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-sm'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{item.canRenew ? 'Renew (14 Days)' : 'Max Renewed'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Recommendations */}
        {activeTab === 'recommendations' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Course-Based Syllabus Recommendations</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Filtered automatically for <strong>Information Technology • Semester V</strong> based on current enrolled subjects (Computer Networks IT302PC, DBMS IT301PC, AI Lab IT308PC).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-4 rounded-2xl border border-emerald-100 bg-white shadow-xs hover:border-emerald-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        {book.recommendedFor}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{book.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">By {book.author}</p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="font-mono text-[11px] text-slate-500">
                      📍 {book.shelfLocation}
                    </div>
                    <button
                      onClick={() => handleReserve(book)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Reserve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Digital Library Portal • Support: library@vce.ac.in</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
