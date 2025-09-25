'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaHeart, FaComment, FaStar, FaThumbsUp, FaReply, FaEdit, FaTrash } from 'react-icons/fa';
import { Button, Skeleton } from '@/components/ui';
import { 
  useCourseVideoBySlug,
  useVideoComments,
  useCreateVideoComment,
  useLikeVideoComment,
  useUnlikeVideoComment,
  useVideoRatingStats,
  useCreateVideoRating,
  useDeleteVideoRating
} from '@/hooks';
import { CourseVideo, VideoComment, CreateVideoCommentData, CreateVideoRatingData } from '@/types/platform';
import Image from 'next/image';

export default function CourseVideoBySlugPage() {
  const params = useParams();
  const router = useRouter();
  const videoSlug = params.videoSlug as string;
  const courseSlug = params.slug as string;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);

  const { data: video, isLoading, error } = useCourseVideoBySlug(videoSlug);
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
    setIsMuted(newVolume === 0);
  };

  const handleTimeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !video) return;

    const commentData: CreateVideoCommentData = {
      content: newComment.trim(),
      parentCommentId: replyingTo || undefined,
    };

    try {
      await createCommentMutation.mutateAsync({ videoId: video.id, data: commentData });
      setNewComment('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await unlikeCommentMutation.mutateAsync(commentId);
      } else {
        await likeCommentMutation.mutateAsync(commentId);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleRating = async (rating: number) => {
    if (!video) return;
    
    try {
      if (userRating === rating) {
        // Remove rating
        await deleteRatingMutation.mutateAsync(video.id);
        setUserRating(null);
      } else {
        // Create/update rating
        const ratingData: CreateVideoRatingData = { rating };
        await createRatingMutation.mutateAsync({ videoId: video.id, data: ratingData });
        setUserRating(rating);
      }
    } catch (error) {
      console.error('Failed to rate video:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    return formatTime(seconds);
  };

  if (isLoading) {
    return (
      <div className="course-video-page">
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
      <div className="course-video-page">
        <div className="container">
          <div className="error-state">
            <h2>Video not found</h2>
            <p>The video you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Button onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-video-page">
      <div className="container">
        {/* Video Player */}
        <section className="video-player-section">
          <div className="video-player">
            <div className="video-container">
              <video
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                className="video-element"
                onLoadedMetadata={(e) => {
                  setDuration(e.currentTarget.duration);
                }}
                onTimeUpdate={(e) => {
                  setCurrentTime(e.currentTarget.currentTime);
                }}
                onEnded={() => setIsPlaying(false)}
              />
              
              {/* Video Controls Overlay */}
              <div className="video-controls">
                <div className="progress-bar">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleTimeUpdate}
                    className="progress-slider"
                  />
                </div>
                
                <div className="controls-row">
                  <div className="left-controls">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlayPause}
                      className="play-button"
                    >
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </Button>
                    
                    <div className="time-display">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  
                  <div className="right-controls">
                    <div className="volume-control">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMuteToggle}
                      >
                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                      </Button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                      />
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="fullscreen-button"
                    >
                      <FaExpand />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Info */}
        <section className="video-info-section">
          <div className="video-header">
            <h1 className="video-title">{video.title}</h1>
            <div className="video-meta">
              <span className="video-duration">
                {formatDuration(video.durationSeconds)}
              </span>
              <span className="video-views">
                {video.totalComments || 0} comments
              </span>
              {video.averageRating && (
                <div className="video-rating">
                  <FaStar className="star-icon" />
                  <span>{video.averageRating.toFixed(1)}</span>
                  <span>({video.totalRatings || 0} ratings)</span>
                </div>
              )}
            </div>
          </div>

          {video.description && (
            <div className="video-description">
              <p>{video.description}</p>
            </div>
          )}

          {/* Rating Section */}
          <div className="video-rating-section">
            <h3>Rate this video</h3>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`star-button ${userRating && userRating >= star ? 'active' : ''}`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
            {ratingStats && (
              <div className="rating-stats">
                <p>Average: {ratingStats.averageRating.toFixed(1)} ({ratingStats.totalRatings} ratings)</p>
              </div>
            )}
          </div>
        </section>

        {/* Comments Section */}
        <section className="comments-section">
          <div className="comments-header">
            <h2>Comments ({video.totalComments || 0})</h2>
            <Button
              variant="ghost"
              onClick={() => setShowComments(!showComments)}
            >
              {showComments ? 'Hide' : 'Show'} Comments
            </Button>
          </div>

          {showComments && (
            <>
              {/* New Comment Form */}
              <form onSubmit={handleSubmitComment} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="comment-input"
                  rows={3}
                />
                <div className="comment-form-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!newComment.trim() || createCommentMutation.isPending}
                  >
                    {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
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
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-content">
                        <p>{comment.content}</p>
                        <div className="comment-meta">
                          <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                          {comment.isEdited && (
                            <span className="comment-edited">(edited)</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="comment-actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeComment(comment.id, comment.isLikedByUser || false)}
                          className={comment.isLikedByUser ? 'liked' : ''}
                        >
                          <FaThumbsUp />
                          {comment.totalLikes || 0}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        >
                          <FaReply />
                          Reply
                        </Button>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <form onSubmit={handleSubmitComment} className="reply-form">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a reply..."
                            className="reply-input"
                            rows={2}
                          />
                          <div className="reply-form-actions">
                            <Button
                              type="submit"
                              variant="primary"
                              size="sm"
                              disabled={!newComment.trim() || createCommentMutation.isPending}
                            >
                              Reply
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setReplyingTo(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}

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
                                  onClick={() => handleLikeComment(reply.id, reply.isLikedByUser || false)}
                                  className={reply.isLikedByUser ? 'liked' : ''}
                                >
                                  <FaThumbsUp />
                                  {reply.totalLikes || 0}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
