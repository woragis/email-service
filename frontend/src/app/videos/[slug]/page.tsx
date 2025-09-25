'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaHeart, FaComment, FaStar, FaThumbsUp, FaReply, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Button, Skeleton } from '@/components/ui';
import { 
  useVideoBySlug,
  useVideoComments,
  useCreateVideoComment,
  useLikeVideoComment,
  useUnlikeVideoComment,
  useVideoRatingStats,
  useCreateVideoRating,
  useDeleteVideoRating
} from '@/hooks';
import { Video, VideoComment, CreateVideoCommentData, CreateVideoRatingData } from '@/types/platform';
import Image from 'next/image';

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);

  const { data: video, isLoading, error } = useVideoBySlug(slug);
  const { data: comments = [], isLoading: commentsLoading } = useVideoComments({ videoId: video?.id || '' });
  const { data: ratingStats } = useVideoRatingStats(video?.id || '');

  const createCommentMutation = useCreateVideoComment();
  const likeCommentMutation = useLikeVideoComment();
  const unlikeCommentMutation = useUnlikeVideoComment();
  const createRatingMutation = useCreateVideoRating();
  const deleteRatingMutation = useDeleteVideoRating();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleTimeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !video?.id) return;

    const commentData: CreateVideoCommentData = {
      content: newComment.trim(),
      parentCommentId: replyingTo || undefined
    };

    try {
      await createCommentMutation.mutateAsync({ videoId: video.id, data: commentData });
      setNewComment('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await likeCommentMutation.mutateAsync(commentId);
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleUnlikeComment = async (commentId: string) => {
    try {
      await unlikeCommentMutation.mutateAsync(commentId);
    } catch (error) {
      console.error('Failed to unlike comment:', error);
    }
  };

  const handleRatingSubmit = async (rating: number) => {
    if (!video?.id) return;

    try {
      const ratingData: CreateVideoRatingData = { rating };
      await createRatingMutation.mutateAsync({ videoId: video.id, data: ratingData });
      setUserRating(rating);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="video-detail-page">
        <div className="container">
          <div className="video-player-skeleton">
            <Skeleton height="400px" />
          </div>
          <div className="video-info-skeleton">
            <Skeleton height="200px" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="video-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>Video not found</h2>
            <p>The video you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Button onClick={() => router.push('/videos')}>
              <FaArrowLeft />
              Back to Videos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-detail-page">
      <div className="container">
        {/* Video Player */}
        <section className="video-player-section">
          <div className="video-player-container">
            <div className="video-player">
              {video.youtubeUrl ? (
                <iframe
                  src={video.youtubeUrl}
                  title={video.title}
                  allowFullScreen
                  className="video-iframe"
                />
              ) : video.thumbnail ? (
                <div className="video-thumbnail">
                  <Image src={video.thumbnail} alt={video.title} width={800} height={450} />
                  <div className="play-overlay">
                    <Button variant="primary" size="lg" className="play-button">
                      <FaPlay />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="video-placeholder">
                  <FaPlay className="play-icon" />
                  <p>Video content not available</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Video Info */}
        <section className="video-info-section">
          <div className="video-info">
            <h1 className="video-title">{video.title}</h1>
            {video.description && (
              <p className="video-description">{video.description}</p>
            )}
            
            <div className="video-meta">
              <div className="video-duration">
                Duration: {formatDuration(video.duration)}
              </div>
            </div>

            {/* Categories */}
            {video.categories && video.categories.length > 0 && (
              <div className="video-categories">
                <h3>Categories:</h3>
                <div className="categories-list">
                  {video.categories.map((category) => (
                    <span key={category.id} className="category-tag">
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            <div className="video-links">
              {video.youtubeUrl && (
                <Button
                  variant="secondary"
                  onClick={() => window.open(video.youtubeUrl, '_blank')}
                >
                  Watch on YouTube
                </Button>
              )}
              {video.instagramUrl && (
                <Button
                  variant="secondary"
                  onClick={() => window.open(video.instagramUrl, '_blank')}
                >
                  View on Instagram
                </Button>
              )}
              {video.tiktokUrl && (
                <Button
                  variant="secondary"
                  onClick={() => window.open(video.tiktokUrl, '_blank')}
                >
                  View on TikTok
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Comments Section */}
        {showComments && (
          <section className="comments-section">
            <div className="comments-header">
              <h2>Comments ({comments.length})</h2>
              <Button
                variant="ghost"
                onClick={() => setShowComments(false)}
              >
                Hide Comments
              </Button>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
                rows={3}
              />
              <div className="comment-form-actions">
                {replyingTo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel Reply
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="comments-list">
              {commentsLoading ? (
                <div className="comments-loading">
                  <Skeleton height="100px" />
                  <Skeleton height="100px" />
                  <Skeleton height="100px" />
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-content">
                      <p>{comment.content}</p>
                      <div className="comment-meta">
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        <span className="comment-likes">
                          {comment.totalLikes || 0} likes
                        </span>
                      </div>
                    </div>
                    
                    <div className="comment-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => comment.isLikedByUser 
                          ? handleUnlikeComment(comment.id)
                          : handleLikeComment(comment.id)
                        }
                        className={comment.isLikedByUser ? 'liked' : ''}
                      >
                        <FaThumbsUp />
                        {comment.isLikedByUser ? 'Liked' : 'Like'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(comment.id)}
                      >
                        <FaReply />
                        Reply
                      </Button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="replies">
                        {comment.replies.map((reply: VideoComment) => (
                          <div key={reply.id} className="reply-item">
                            <div className="reply-content">
                              <p>{reply.content}</p>
                              <div className="reply-meta">
                                <span className="reply-date">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="reply-actions">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => reply.isLikedByUser 
                                  ? handleUnlikeComment(reply.id)
                                  : handleLikeComment(reply.id)
                                }
                                className={reply.isLikedByUser ? 'liked' : ''}
                              >
                                <FaThumbsUp />
                                {reply.isLikedByUser ? 'Liked' : 'Like'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <form onSubmit={handleCommentSubmit} className="reply-form">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder={`Reply to ${comment.content.substring(0, 50)}...`}
                          className="reply-input"
                          rows={2}
                        />
                        <div className="reply-form-actions">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={!newComment.trim()}
                          >
                            Reply
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-comments">
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Show Comments Button */}
        {!showComments && (
          <div className="show-comments-section">
            <Button
              variant="primary"
              onClick={() => setShowComments(true)}
            >
              <FaComment />
              Show Comments ({comments.length})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
