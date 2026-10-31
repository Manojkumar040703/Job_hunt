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
  IconEdit,
  IconTrash,
  IconCheck,
} from "./Icons";
import { useAuth } from "../context/AuthContext";

export default function CommunityFeed({
  posts = [],
  onCreatePost,
  onEditPost,
  onDeletePost,
  onLikePost,
  onAddComment,
  onToast,
}) {
  const { user, openLogin } = useAuth();
  const [activeFilter, setActiveFilter] = useState("ALL"); // "ALL" | "HIRING" | "ACHIEVEMENT" | "OPENTOWORK"
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);

  const [followedAuthors, setFollowedAuthors] = useState(["Kavitha Rajendran"]);
  const [connectedAuthors, setConnectedAuthors] = useState(["Ravikumar"]);
  const [selectedAuthorProfile, setSelectedAuthorProfile] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const [newPostForm, setNewPostForm] = useState({
    content: "",
    badge: "Career Update 🎉",
    tags: "TamilNaduJobs, CareerGrowth",
    image: null,
  });

  const [editPostForm, setEditPostForm] = useState({
    content: "",
    badge: "Career Update 🎉",
    tags: "",
    image: null,
  });

  const POPULAR_TAGS = [
    "TamilNaduJobs",
    "CareerGrowth",
    "ChennaiTech",
    "CoimbatoreJobs",
    "HiringAlert",
    "SoftwareEngineering",
  ];

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

  function handleEditImageUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        if (onToast) onToast("⚠️ Photo size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target.result;
        setEditImagePreview(dataUrl);
        setEditPostForm((prev) => ({ ...prev, image: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemoveEditImage() {
    setEditImagePreview(null);
    setEditPostForm((prev) => ({ ...prev, image: null }));
  }

  function canManagePost(post) {
    if (!post) return false;
    if (user?.role === "admin") return true;
    if (
      user?.name &&
      post.authorName &&
      user.name.trim().toLowerCase() === post.authorName.trim().toLowerCase()
    ) {
      return true;
    }
    if (String(post.id).startsWith("post-")) {
      return true;
    }
    if (
      user?.name &&
      (post.authorName?.toLowerCase() === "manoj" ||
        post.authorName?.toLowerCase() === "karthik subramanian")
    ) {
      return true;
    }
    return false;
  }

  function handleOpenEditModal(post) {
    setEditingPost(post);
    setEditPostForm({
      content: post.content || "",
      badge: post.badge || "Career Update 🎉",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "",
      image: post.image || null,
    });
    setEditImagePreview(post.image || null);
  }

  function handleEditPostSubmit(e) {
    e.preventDefault();
    if (!editPostForm.content.trim()) return;

    if (onEditPost && editingPost) {
      onEditPost(editingPost.id, {
        content: editPostForm.content.trim(),
        badge: editPostForm.badge,
        tags: editPostForm.tags
          .split(",")
          .map((t) => t.trim().replace(/^#/, ""))
          .filter(Boolean),
        image: editPostForm.image,
      });
    }

    setEditingPost(null);
    if (onToast) onToast("✅ Post updated successfully!");
  }

  function handleConfirmDelete() {
    if (onDeletePost && postToDelete) {
      onDeletePost(postToDelete.id);
      if (onToast) onToast("🗑️ Post was deleted from the feed.");
    }
    setPostToDelete(null);
  }

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "HIRING")
      return post.badge?.toLowerCase().includes("hiring");
    if (activeFilter === "ACHIEVEMENT")
      return (
        post.badge?.toLowerCase().includes("achievement") ||
        post.badge?.toLowerCase().includes("milestone")
      );
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
        onToast(
          isFollowing
            ? `Unfollowed ${authorName}`
            : `Now following ${authorName}!`
        );
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
        onToast(
          isConnected
            ? `Removed connection with ${authorName}`
            : `🤝 Connected with ${authorName}!`
        );
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
      bio:
        post.authorName === "Ravikumar"
          ? "Lead Recruiter at Hyundai Motor India's Sriperumbudur facility. Passionate about automotive R&D, embedded systems, and EV engineering talent."
          : post.authorName === "Divya"
          ? "Technical Talent Partner at Freshworks Inc (OMR Chennai). Specializing in Python, FastAPI, and distributed cloud engineering hires."
          : "Active professional in Tamil Nadu's career network. Open to collaborations, technical discussions, and career opportunities.",
      skills:
        post.authorName === "Ravikumar"
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
      authorName: user?.name || "Manoj",
      authorTitle: user?.title || "Full Stack Software Engineer",
      authorAvatar: user?.avatar || "M",
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
      tags: newPostForm.tags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean),
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
    if (onToast) onToast("🚀 Published your update to Tamil Nadu talent feed!");
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
          className="btn btn-primary btn-lg pulse-hover-btn"
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
          const isManageable = canManagePost(post);

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
                      post.authorAvatar || post.authorName?.charAt(0) || "TN"
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
                    <span className="post-timestamp">
                      {post.timestamp}
                      {post.isEdited && (
                        <span className="post-edited-indicator" title="Edited by author">
                          • Edited
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="post-header-actions">
                  {isManageable ? (
                    <div className="post-owner-actions">
                      <button
                        type="button"
                        className="btn-post-action btn-post-action--edit"
                        onClick={() => handleOpenEditModal(post)}
                        title="Edit this post to fix mistakes or change text/photo"
                      >
                        <IconEdit size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn-post-action btn-post-action--delete"
                        onClick={() => setPostToDelete(post)}
                        title="Delete this post"
                      >
                        <IconTrash size={14} /> Delete
                      </button>
                    </div>
                  ) : (
                    <div className="post-network-actions">
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
                  )}
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
          <div className="modal-content community-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="community-modal-header">
              <div className="community-modal-header-info">
                <span className="community-modal-badge">
                  <IconSparkles size={13} /> PUBLISH TO NETWORK
                </span>
                <h3 className="community-modal-title">Share an Update with Tamil Nadu</h3>
                <p className="community-modal-subtitle">
                  Post job openings, career achievements, or seek advice across all 38 districts.
                </p>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsCreateModalOpen(false)}
                title="Close"
              >
                <IconClose size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="community-modal-form">
              <div className="form-field-card">
                <label className="form-field-label">Post Category / Badge</label>
                <select
                  className="form-field-select"
                  value={newPostForm.badge}
                  onChange={(e) => setNewPostForm({ ...newPostForm, badge: e.target.value })}
                >
                  <option value="Hiring Announcement 📢">📢 Hiring Announcement</option>
                  <option value="Career Achievement 🎉">🎉 Career Achievement</option>
                  <option value="Open To Work 💼">💼 Open To Work</option>
                  <option value="Project Showcase 💻">💻 Project Showcase</option>
                  <option value="Career Advice & Tip 💡">💡 Career Advice & Tip</option>
                </select>
              </div>

              <div className="form-field-card">
                <div className="form-field-header-row">
                  <label className="form-field-label">Post Content *</label>
                  <span className="form-field-counter">{newPostForm.content.length} characters</span>
                </div>
                <textarea
                  className="form-field-textarea"
                  rows={5}
                  required
                  placeholder="Share details about what you're hiring for, what you achieved, or what role you're seeking..."
                  value={newPostForm.content}
                  onChange={(e) => setNewPostForm({ ...newPostForm, content: e.target.value })}
                />
              </div>

              <div className="form-field-card">
                <label className="form-field-label">Keywords & Tags</label>
                <input
                  className="form-field-input"
                  type="text"
                  placeholder="e.g. CoimbatoreTech, Python, HiringNow, TamilNadu"
                  value={newPostForm.tags}
                  onChange={(e) => setNewPostForm({ ...newPostForm, tags: e.target.value })}
                />
                <div className="tag-pills-quickselect">
                  <span className="tag-pills-label">Suggestions:</span>
                  {POPULAR_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="quick-tag-chip"
                      onClick={() => {
                        const current = newPostForm.tags ? newPostForm.tags.split(",").map((t) => t.trim()) : [];
                        if (!current.includes(tag)) {
                          const updated = [...current, tag].filter(Boolean).join(", ");
                          setNewPostForm({ ...newPostForm, tags: updated });
                        }
                      }}
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Photo Option */}
              <div className="form-field-card">
                <label className="form-field-label">Add Photo to Post (Optional)</label>
                {imagePreview ? (
                  <div className="community-upload-preview-card">
                    <img src={imagePreview} alt="Preview" className="community-upload-preview-img" />
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
                  <label className="community-image-dropzone">
                    <div className="dropzone-icon-circle">
                      <IconUploadCloud size={24} />
                    </div>
                    <div className="dropzone-text-group">
                      <span className="dropzone-title">Upload workplace photo, certificate, or flyer</span>
                      <span className="dropzone-subtitle">Supports PNG, JPG, WebP up to 5MB</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>

              <div className="community-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-md"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-md btn-glow">
                  <IconSend size={15} /> Publish to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="modal-backdrop" onClick={() => setEditingPost(null)}>
          <div className="modal-content community-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="community-modal-header">
              <div className="community-modal-header-info">
                <span className="community-modal-badge community-modal-badge--edit">
                  <IconEdit size={13} /> EDIT COMMUNITY POST
                </span>
                <h3 className="community-modal-title">Edit Your Update</h3>
                <p className="community-modal-subtitle">
                  Fix typos, update job requirements, adjust tags, or replace photos.
                </p>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setEditingPost(null)}
                title="Close"
              >
                <IconClose size={20} />
              </button>
            </div>

            <form onSubmit={handleEditPostSubmit} className="community-modal-form">
              <div className="form-field-card">
                <label className="form-field-label">Post Category / Badge</label>
                <select
                  className="form-field-select"
                  value={editPostForm.badge}
                  onChange={(e) => setEditPostForm({ ...editPostForm, badge: e.target.value })}
                >
                  <option value="Hiring Announcement 📢">📢 Hiring Announcement</option>
                  <option value="Career Achievement 🎉">🎉 Career Achievement</option>
                  <option value="Open To Work 💼">💼 Open To Work</option>
                  <option value="Project Showcase 💻">💻 Project Showcase</option>
                  <option value="Career Advice & Tip 💡">💡 Career Advice & Tip</option>
                </select>
              </div>

              <div className="form-field-card">
                <div className="form-field-header-row">
                  <label className="form-field-label">Post Content *</label>
                  <span className="form-field-counter">{editPostForm.content.length} characters</span>
                </div>
                <textarea
                  className="form-field-textarea"
                  rows={5}
                  required
                  placeholder="Update your post message here..."
                  value={editPostForm.content}
                  onChange={(e) => setEditPostForm({ ...editPostForm, content: e.target.value })}
                />
              </div>

              <div className="form-field-card">
                <label className="form-field-label">Keywords & Tags (Comma separated)</label>
                <input
                  className="form-field-input"
                  type="text"
                  placeholder="e.g. CoimbatoreTech, Python, HiringNow"
                  value={editPostForm.tags}
                  onChange={(e) => setEditPostForm({ ...editPostForm, tags: e.target.value })}
                />
              </div>

              {/* Edit Attached Photo */}
              <div className="form-field-card">
                <label className="form-field-label">Attached Photo</label>
                {editImagePreview ? (
                  <div className="community-upload-preview-card">
                    <img src={editImagePreview} alt="Preview" className="community-upload-preview-img" />
                    <button
                      type="button"
                      className="btn-remove-preview"
                      onClick={handleRemoveEditImage}
                      title="Remove image"
                    >
                      ✕ Remove Photo
                    </button>
                  </div>
                ) : (
                  <label className="community-image-dropzone">
                    <div className="dropzone-icon-circle">
                      <IconUploadCloud size={24} />
                    </div>
                    <div className="dropzone-text-group">
                      <span className="dropzone-title">Upload a new photo, certificate, or screenshot</span>
                      <span className="dropzone-subtitle">Supports PNG, JPG, WebP up to 5MB</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>

              <div className="community-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-md"
                  onClick={() => setEditingPost(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-md btn-glow">
                  <IconCheck size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="modal-backdrop" onClick={() => setPostToDelete(null)}>
          <div className="modal-content delete-confirm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon-badge">
              <IconTrash size={28} />
            </div>
            <h3 className="delete-modal-title">Delete Community Post?</h3>
            <p className="delete-modal-desc">
              Are you sure you want to remove this update from the Tamil Nadu talent feed? This action cannot be undone.
            </p>

            <div className="delete-post-preview-card">
              <span className="delete-preview-author">{postToDelete.authorName}</span>
              <p className="delete-preview-text">
                {postToDelete.content.length > 120
                  ? postToDelete.content.slice(0, 120) + "..."
                  : postToDelete.content}
              </p>
            </div>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="btn btn-secondary btn-md"
                onClick={() => setPostToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-md"
                onClick={handleConfirmDelete}
              >
                <IconTrash size={15} /> Yes, Delete Post
              </button>
            </div>
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
