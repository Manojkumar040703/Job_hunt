import { useState } from "react";
import {
  IconHeart,
  IconMessageSquare,
  IconShare,
  IconSparkles,
  IconPlus,
  IconClose,
  IconMapPin,
  IconShield,
  IconUser,
  IconSend,
  IconImage,
  IconUploadCloud,
} from "./Icons";
import { useAuth } from "../context/AuthContext";

export default function CommunityFeed({
  posts = [],
  onCreatePost,
  onLikePost,
  onAddComment,
  onToast,
}) {
  const { user, openLogin } = useAuth();
  const [activeFilter, setActiveFilter] = useState("ALL"); // "ALL" | "HIRING" | "ACHIEVEMENT" | "OPENTOWORK"
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [followedAuthors, setFollowedAuthors] = useState(["Kavitha Rajendran"]);
  const [connectedAuthors, setConnectedAuthors] = useState(["Ravikumar"]);
  const [selectedAuthorProfile, setSelectedAuthorProfile] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [newPostForm, setNewPostForm] = useState({
    content: "",
    badge: "Career Update 🎉",
    tags: "TamilNaduJobs, CareerGrowth",
    image: null,
  });

  function handleImageUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        if (onToast) onToast("⚠️ Photo size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target.result;
        setImagePreview(dataUrl);
        setNewPostForm((prev) => ({ ...prev, image: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemoveImage() {
    setImagePreview(null);
    setNewPostForm((prev) => ({ ...prev, image: null }));
  }

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "HIRING")
      return post.badge?.toLowerCase().includes("hiring");
    if (activeFilter === "ACHIEVEMENT")
      return post.badge?.toLowerCase().includes("achievement") || post.badge?.toLowerCase().includes("milestone");
    if (activeFilter === "OPENTOWORK")
      return post.badge?.toLowerCase().includes("open");
    return true;
  });

  function handleToggleFollow(authorName) {
    if (!user) {
      openLogin();
      return;
    }
    setFollowedAuthors((prev) => {
      const isFollowing = prev.includes(authorName);
      const next = isFollowing
        ? prev.filter((name) => name !== authorName)
        : [...prev, authorName];
      if (onToast)
        onToast(isFollowing ? `Unfollowed ${authorName}` : `Now following ${authorName}!`);
      return next;
    });
  }

  function handleToggleConnect(authorName) {
    if (!user) {
      openLogin();
      return;
    }
    setConnectedAuthors((prev) => {
      const isConnected = prev.includes(authorName);
      const next = isConnected
        ? prev.filter((name) => name !== authorName)
        : [...prev, authorName];
      if (onToast)
        onToast(isConnected ? `Removed connection with ${authorName}` : `🤝 Connected with ${authorName}!`);
      return next;
    });
  }

  function handleOpenAuthorProfile(post) {
    setSelectedAuthorProfile({
      name: post.authorName,
      title: post.authorTitle || "Professional Network Member",
      district: post.authorDistrict || "Tamil Nadu",
      avatar: post.authorAvatar || post.authorName.charAt(0),
      badge: post.badge,
      bio: post.authorName === "Ravikumar"
        ? "Lead Recruiter at Hyundai Motor India's Sriperumbudur facility. Passionate about automotive R&D, embedded systems, and EV engineering talent."
        : post.authorName === "Divya"
        ? "Technical Talent Partner at Freshworks Inc (OMR Chennai). Specializing in Python, FastAPI, and distributed cloud engineering hires."
        : "Active professional in Tamil Nadu's career network. Open to collaborations, technical discussions, and career opportunities.",
      skills: post.authorName === "Ravikumar"
        ? ["Technical Hiring", "Automotive", "CAN Bus", "Embedded Systems"]
        : post.authorName === "Divya"
        ? ["SaaS Recruiting", "Python", "FastAPI", "Engineering Leadership"]
        : ["Full Stack Development", "FastAPI", "React", "SQL"],
    });
  }

  function handleCreatePostSubmit(e) {
    e.preventDefault();
    if (!newPostForm.content.trim()) return;

    const newPost = {
      id: "post-" + Date.now(),
      authorName: user?.name || "Karthik Subramanian",
      authorTitle: user?.title || "Full Stack Software Engineer",
      authorAvatar: user?.avatar || "KS",
      authorDistrict: user?.district || "Coimbatore",
      authorPhoto: user?.profilePhoto || null,
      timestamp: "Just now",
      badge: newPostForm.badge,
      content: newPostForm.content,
      image: newPostForm.image || null,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      comments: [],
      tags: newPostForm.tags.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean),
    };

    onCreatePost(newPost);
    setIsCreateModalOpen(false);
    setImagePreview(null);
    setNewPostForm({
      content: "",
      badge: "Career Update 🎉",
      tags: "TamilNaduJobs, CareerGrowth",
      image: null,
    });
    if (onToast) onToast("🚀 Published your update with photo to Tamil Nadu talent feed!");
  }

  function handleCommentSubmit(postId) {
    if (!user) {
      openLogin();
      return;
    }
    if (!commentInput.trim()) return;

    onAddComment(postId, {
      id: "c-" + Date.now(),
      authorName: user.name,
      authorAvatar: user.avatar,
      text: commentInput.trim(),
      time: "Just now",
    });

    setCommentInput("");
    if (onToast) onToast("💬 Comment posted!");
  }

  return (
    <div className="community-feed-view">
      {/* Community Header Banner */}
      <div className="community-header-banner">
        <div>
          <span className="community-badge">
            <IconSparkles size={14} /> TAMIL NADU PROFESSIONAL NETWORK
          </span>
          <h1>Career Community & Hiring Feed</h1>
          <p>
            Connect with job seekers, engineering leads, founders, and HR recruiters across all 38 districts of Tamil Nadu.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => {
            if (!user) openLogin();
            else setIsCreateModalOpen(true);
          }}
        >
          <IconPlus size={18} /> Publish Career Update
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="feed-filters-bar">
        <div className="filter-chips-group">
          {[
            { id: "ALL", label: "All Updates" },
            { id: "HIRING", label: "📢 Hiring Announcements" },
            { id: "ACHIEVEMENT", label: "🎉 Milestones & Certifications" },
            { id: "OPENTOWORK", label: "💼 Open to Opportunities" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`filter-chip ${activeFilter === tab.id ? "filter-chip--active" : ""}`}
              onClick={() => setActiveFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Stream */}
      <div className="feed-posts-stream">
        {filteredPosts.map((post) => {
          const isFollowing = followedAuthors.includes(post.authorName);
          const isConnected = connectedAuthors.includes(post.authorName);
          const isCommentsOpen = activeCommentPostId === post.id;

          return (
            <article key={post.id} className="feed-post-card">
              {/* Author Row */}
              <div className="post-author-row">
                <div
                  className="post-author-main"
                  onClick={() => handleOpenAuthorProfile(post)}
                  style={{ cursor: "pointer" }}
                  title="Click to view verified network profile"
                >
                  <div className="author-avatar-circle author-avatar-circle--ring">
                    {post.authorPhoto ? (
                      <img src={post.authorPhoto} alt={post.authorName} className="author-avatar-img" />
                    ) : (
                      post.authorAvatar || "TN"
                    )}
                  </div>
                  <div>
                    <div className="author-name-row">
                      <h4 className="author-name">{post.authorName}</h4>
                      {post.authorDistrict && (
                        <span className="author-district-tag">
                          <IconMapPin size={11} /> {post.authorDistrict}
                        </span>
                      )}
                    </div>
                    <p className="author-title">{post.authorTitle}</p>
                    <span className="post-timestamp">{post.timestamp}</span>
                  </div>
                </div>

                <div className="post-header-actions">
                  <button
                    type="button"
                    className={`btn-connect-toggle ${isConnected ? "btn-connect-toggle--active" : ""}`}
                    onClick={() => handleToggleConnect(post.authorName)}
                    title={isConnected ? "Connected in network" : "Send connection request"}
                  >
                    {isConnected ? "🤝 Connected" : "+ Connect"}
                  </button>
                  <button
                    type="button"
                    className={`btn-follow-toggle ${isFollowing ? "btn-follow-toggle--active" : ""}`}
                    onClick={() => handleToggleFollow(post.authorName)}
                  >
                    {isFollowing ? "Following ✓" : "+ Follow"}
                  </button>
                </div>
              </div>

              {/* Category Badge */}
              {post.badge && (
                <div className="post-badge-container">
                  <span className="post-badge-pill">{post.badge}</span>
                </div>
              )}

              {/* Content Body */}
              <div className="post-body-text">
                {post.content.split("\n").map((para, i) => (
                  <p key={i} style={{ marginBottom: para ? "8px" : "12px" }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Attached Photo */}
              {post.image && (
                <div className="post-attached-image-wrapper">
                  <img
                    src={post.image}
                    alt="Post media"
                    className="post-attached-img"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags-row">
                  {post.tags.map((tg) => (
                    <span key={tg} className="post-hash-tag">
                      #{tg}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Bar */}
              <div className="post-action-bar">
                <button
                  type="button"
                  className={`feed-action-btn ${post.isLiked ? "feed-action-btn--liked" : ""}`}
                  onClick={() => onLikePost(post.id)}
                >
                  <IconHeart size={18} filled={post.isLiked} />
                  <span>{post.likesCount} {post.likesCount === 1 ? "Like" : "Likes"}</span>
                </button>

                <button
                  type="button"
                  className={`feed-action-btn ${isCommentsOpen ? "feed-action-btn--active" : ""}`}
                  onClick={() =>
                    setActiveCommentPostId(isCommentsOpen ? null : post.id)
                  }
                >
                  <IconMessageSquare size={18} />
                  <span>{post.commentsCount || (post.comments ? post.comments.length : 0)} Comments</span>
                </button>

                <button
                  type="button"
                  className="feed-action-btn"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    if (onToast) onToast("🔗 Link copied to clipboard!");
                  }}
                >
                  <IconShare size={18} />
                  <span>Share</span>
                </button>
              </div>

              {/* Expandable Comments Section */}
              {isCommentsOpen && (
                <div className="post-comments-container">
                  <div className="add-comment-row">
                    <input
                      type="text"
                      placeholder="Write a constructive professional response..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCommentSubmit(post.id);
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleCommentSubmit(post.id)}
                    >
                      <IconSend size={14} /> Comment
                    </button>
                  </div>

                  {post.comments && post.comments.length > 0 && (
                    <div className="comments-list">
                      {post.comments.map((c) => (
                        <div key={c.id} className="comment-bubble">
                          <div className="comment-avatar">{c.authorAvatar || "U"}</div>
                          <div className="comment-content">
                            <span className="comment-author">{c.authorName}</span>
                            <p className="comment-text">{c.text}</p>
                            <span className="comment-time">{c.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content create-post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Share an Update with Tamil Nadu</h3>
                <p className="create-post-sub">Post job openings, career achievements, or seek advice.</p>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsCreateModalOpen(false)}
              >
                <IconClose size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="create-post-form">
              <div className="form-group">
                <label>Post Category / Badge</label>
                <select
                  value={newPostForm.badge}
                  onChange={(e) => setNewPostForm({ ...newPostForm, badge: e.target.value })}
                >
                  <option value="Hiring Announcement 📢">Hiring Announcement 📢</option>
                  <option value="Career Achievement 🎉">Career Achievement 🎉</option>
                  <option value="Open To Work 💼">Open To Work 💼</option>
                  <option value="Project Showcase 💻">Project Showcase 💻</option>
                  <option value="Career Advice & Tip 💡">Career Advice & Tip 💡</option>
                </select>
              </div>

              <div className="form-group">
                <label>Post Content *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Share details about what you're hiring for, what you achieved, or what role you're seeking..."
                  value={newPostForm.content}
                  onChange={(e) => setNewPostForm({ ...newPostForm, content: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Keywords & Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. CoimbatoreTech, Python, HiringNow, TamilNadu"
                  value={newPostForm.tags}
                  onChange={(e) => setNewPostForm({ ...newPostForm, tags: e.target.value })}
                />
              </div>

              {/* Upload Photo Option */}
              <div className="form-group">
                <label>Add Photo to Post (Optional)</label>
                {imagePreview ? (
                  <div className="post-upload-preview-card">
                    <img src={imagePreview} alt="Preview" className="post-upload-preview-img" />
                    <button
                      type="button"
                      className="btn-remove-preview"
                      onClick={handleRemoveImage}
                      title="Remove image"
                    >
                      ✕ Remove Photo
                    </button>
                  </div>
                ) : (
                  <label className="feed-image-dropzone">
                    <IconUploadCloud size={20} />
                    <span>Upload workplace photo, certificate, or project screenshot</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Author Profile Preview Modal */}
      {selectedAuthorProfile && (
        <div className="modal-backdrop" onClick={() => setSelectedAuthorProfile(null)}>
          <div className="modal-content glass-panel" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div className="profile-preview-header">
              <div className="profile-preview-avatar">
                {selectedAuthorProfile.avatar}
              </div>
              <div className="profile-preview-meta">
                <h3>{selectedAuthorProfile.name}</h3>
                <p className="profile-preview-title">{selectedAuthorProfile.title}</p>
                <span className="profile-preview-district">
                  <IconMapPin size={12} /> {selectedAuthorProfile.district}, Tamil Nadu
                </span>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setSelectedAuthorProfile(null)}
                title="Close"
              >
                <IconClose size={18} />
              </button>
            </div>

            <div className="profile-preview-body">
              <p className="profile-preview-bio">{selectedAuthorProfile.bio}</p>

              <div className="profile-preview-section">
                <span className="section-label-sm">Key Expertise & Skills</span>
                <div className="skills-pill-group">
                  {selectedAuthorProfile.skills?.map((sk) => (
                    <span key={sk} className="skill-pill-sm">{sk}</span>
                  ))}
                </div>
              </div>

              <div className="profile-preview-mutuals">
                <IconShield size={14} className="text-accent-cyan" />
                <span>Verified Member of Tamil Nadu Career & Recruitment Mesh</span>
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: "1px solid var(--border-light)", paddingTop: "14px" }}>
              <button
                type="button"
                className={`btn ${connectedAuthors.includes(selectedAuthorProfile.name) ? "btn-secondary" : "btn-primary"}`}
                onClick={() => handleToggleConnect(selectedAuthorProfile.name)}
              >
                {connectedAuthors.includes(selectedAuthorProfile.name) ? "🤝 Connected" : "+ Connect in Network"}
              </button>

              <button
                type="button"
                className={`btn ${followedAuthors.includes(selectedAuthorProfile.name) ? "btn-secondary" : "btn-cyber-outline"}`}
                onClick={() => handleToggleFollow(selectedAuthorProfile.name)}
              >
                {followedAuthors.includes(selectedAuthorProfile.name) ? "Following ✓" : "Follow Updates"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
