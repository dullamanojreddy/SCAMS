import React, { useEffect, useState } from 'react';
import {
  X,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ThumbsUp,
  Share2,
  Bookmark,
  Send,
  Filter,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  UserCheck,
  Search,
} from 'lucide-react';
import { COMMUNITY_POSTS, USER_PROFILE } from '../data/mockData';
import { api } from '../api/client';

export const CommunityModal = ({ isOpen, onClose, currentUser = USER_PROFILE }) => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Placements');
  const [newContent, setNewContent] = useState('');
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [reportedToast, setReportedToast] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    api.get('/api/v1/community').then((items) => {
      if (Array.isArray(items)) setPosts(items);
    }).catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ['All', 'Placements', 'Academics', 'Internships', 'Projects', 'College Life'];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUpvote = (postId) => {
    api.post(`/api/v1/community/${postId}/upvote`, {}).then((result) => {
      setPosts((prev) => prev.map((post) => post.id === postId ? { ...post, ...result } : post));
    }).catch(() => {});
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            upvotes: p.hasUpvoted ? p.upvotes - 1 : p.upvotes + 1,
            hasUpvoted: !p.hasUpvoted,
          };
        }
        return p;
      })
    );
  };

  const handleFollow = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, isFollowed: !p.isFollowed };
        }
        return p;
      })
    );
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      author: {
        name: currentUser?.name || 'Manoj Reddy',
        role: `Student • ${currentUser?.department || '3rd Year IT'}`,
        avatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      },
      content: newContent,
      upvotes: 1,
      hasUpvoted: true,
      isFollowed: true,
      timeAgo: 'Just now',
      answers: [],
    };

    try {
      const saved = await api.post('/api/v1/community', { title: newTitle, body: newContent, category: newCategory });
      setPosts([{ ...newPost, ...saved, content: saved.body || saved.content }, ...posts]);
    } catch {
      setPosts([newPost, ...posts]);
    }
    setNewTitle('');
    setNewContent('');
    setIsAsking(false);
  };

  const handleAddAnswer = (postId) => {
    if (!replyText.trim()) return;

    const isSenior = currentUser?.isVerifiedSenior || currentUser?.year?.includes('4th');
    const newAnswer = {
      id: `ans-${Date.now()}`,
      author: {
        name: currentUser?.name || 'Manoj Reddy',
        role: isSenior ? 'Verified Senior' : 'Student',
        subtitle: `${currentUser?.department || 'IT'} • Vasavi College`,
        isVerifiedSenior: isSenior,
        avatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      },
      content: replyText,
      upvotes: 0,
      timeAgo: 'Just now',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            answers: [...p.answers, newAnswer],
          };
        }
        return p;
      })
    );

    setReplyText('');
    setActiveReplyPostId(null);
  };

  const handleReport = (postTitle) => {
    setReportedToast(`Report logged for "${postTitle.slice(0, 30)}...". Admin will review.`);
    setTimeout(() => setReportedToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-outfit">Community — Connect with Seniors</h3>
                <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-400/30">
                  REQ-4.6 MODULE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Verified Senior guidance on Placements, Academics, Internships & College Life
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

        {/* Action & Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search senior advice, questions, placement tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-purple-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAsking(!isAsking)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ask Question</span>
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {reportedToast && (
          <div className="mx-6 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{reportedToast}</span>
          </div>
        )}

        {/* Ask Question Form Panel */}
        {isAsking && (
          <form
            onSubmit={handleCreatePost}
            className="m-6 p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3 animate-fadeIn"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-purple-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Ask the Senior Community</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAsking(false)}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Title</label>
              <input
                type="text"
                placeholder="e.g. What are the key coding topics for ServiceNow on-campus drive?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Tag</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Placements">Placements</option>
                  <option value="Academics">Academics</option>
                  <option value="Internships">Internships</option>
                  <option value="Projects">Projects</option>
                  <option value="College Life">College Life</option>
                </select>
              </div>
              <div className="flex items-center pt-5 text-xs text-slate-500">
                <span>Posting as: <strong>{currentUser?.name || 'Manoj Reddy'}</strong> ({currentUser?.rollNo || '1602-24-737-152'})</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Details & Context</label>
              <textarea
                rows={3}
                placeholder="Describe your question in detail so seniors can give specific guidance..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post to Community</span>
              </button>
            </div>
          </form>
        )}

        {/* Discussion Threads */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-purple-200 transition space-y-4"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{post.author.name}</span>
                      <span className="text-[10px] font-normal text-slate-400">• {post.timeAgo}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{post.author.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono uppercase bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200">
                    {post.category}
                  </span>
                  <button
                    onClick={() => handleReport(post.title)}
                    className="text-slate-400 hover:text-rose-500 transition text-[11px] cursor-pointer p-1"
                    title="Report Content (BR-5.5.3)"
                  >
                    Flag
                  </button>
                </div>
              </div>

              {/* Post Title & Content */}
              <div>
                <h4 className="text-base font-bold text-slate-900">{post.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Post Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      post.hasUpvoted
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.upvotes}</span>
                  </button>

                  <button
                    onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.answers.length} Answers</span>
                  </button>

                  <button
                    onClick={() => handleFollow(post.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      post.isFollowed ? 'text-purple-600 bg-purple-50' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{post.isFollowed ? 'Following' : 'Follow'}</span>
                  </button>
                </div>

                <button
                  onClick={() => setActiveReplyPostId(post.id)}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 cursor-pointer"
                >
                  Write Answer →
                </button>
              </div>

              {/* Reply Box */}
              {activeReplyPostId === post.id && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-purple-200 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Post Answer as {currentUser?.name}</span>
                    </span>
                    <span className="text-[10px] text-purple-600 font-mono">
                      Senior Verified System Active
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Provide technical tips, syllabus insights, or placement experiences..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setActiveReplyPostId(null)}
                      className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddAnswer(post.id)}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Submit Answer
                    </button>
                  </div>
                </div>
              )}

              {/* Answers Section */}
              {post.answers.length > 0 && (
                <div className="space-y-3 pt-2 pl-3 sm:pl-6 border-l-2 border-purple-100">
                  {post.answers.map((ans) => (
                    <div
                      key={ans.id}
                      className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-purple-50/40 border border-slate-200/90 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={ans.author.avatar}
                            alt={ans.author.name}
                            className="w-8 h-8 rounded-full object-cover border border-purple-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">{ans.author.name}</span>
                              {ans.author.isVerifiedSenior && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  <span>Verified Senior</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">
                              {ans.author.subtitle}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">{ans.timeAgo}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {ans.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Vasavi Senior Peer Network • Admin Moderated (BR-5.5.3)</span>
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
