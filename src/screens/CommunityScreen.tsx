/**
 * ================================================================================
 * File: src/screens/CommunityScreen.tsx
 * Description: Peer Support & Recovery Stories Feed Screen.
 * Displays shared survivor stories, community encouragement posts, interactive support
 * reactions ("Sahaara dein"), and entry points to post anonymous thoughts.
 * ================================================================================
 */

import React from 'react';
import { Heart, User, HeartHandshake, BookOpen, MessageSquarePlus } from 'lucide-react';
import { CommunityPost } from '../types';
import confetti from 'canvas-confetti';

interface CommunityScreenProps {
  posts: CommunityPost[];
  onToggleSupport: (postId: string) => void;
  onOpenStoryDetail: (post: CommunityPost) => void;
  onCreatePost: () => void;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  posts,
  onToggleSupport,
  onOpenStoryDetail,
  onCreatePost,
}) => {
  const handleSupport = (id: string, currentlySupported: boolean) => {
    onToggleSupport(id);
    if (!currentlySupported) {
      try {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.7 },
          colors: ['#9e3d00', '#006b58', '#fed7aa', '#ba1a1a'],
        });
      } catch (e) {}
    }
  };

  return (
    <div
      id="screen-community"
      className="flex flex-col px-5 py-4 max-w-md mx-auto min-h-full space-y-5"
    >
      {/* Top Heart Badge & Heading matching Image 11 */}
      <div className="flex flex-col items-center text-center">
        <div className="w-18 h-18 rounded-full bg-[#8bf2d6] flex items-center justify-center text-[#006b58] shadow-sm mb-3">
          <Heart size={32} className="fill-[#006b58] text-[#006b58]" />
        </div>

        <h1
          id="community-title"
          className="font-serif text-2xl sm:text-3xl font-bold text-[#1d1b19] tracking-tight leading-snug mb-1"
        >
          Aap akele nahi hain
        </h1>

        <p className="text-base sm:text-lg text-[#594238] font-normal leading-relaxed max-w-xs">
          Yahan hum sab ek saath hain. Padhein aur mehsoos karein.
        </p>
      </div>

      {/* Featured Companion Story Card Link */}
      <button
        id="btn-featured-story"
        type="button"
        onClick={() => {
          const storyPost = posts.find((p) => p.isStory) || posts[0];
          if (storyPost) onOpenStoryDetail(storyPost);
        }}
        className="w-full text-left p-4 rounded-3xl bg-[#fed7aa]/40 hover:bg-[#fed7aa]/60 border border-[#e0c0b2] shadow-2xs flex items-center justify-between gap-3 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#9e3d00] flex items-center justify-center text-white">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="font-serif text-base font-bold text-[#1d1b19]">
              Ek Saathi ki kahani (Read Story)
            </h2>
            <p className="text-xs text-[#594238]">
              Prerna aur aasha ki sacchi kahani
            </p>
          </div>
        </div>
        <span className="text-xs font-serif font-bold text-[#9e3d00] bg-white px-3 py-1.5 rounded-full shadow-2xs">
          Padhein →
        </span>
      </button>

      {/* Posts Feed matching Image 11 */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            id={`post-card-${post.id}`}
            className="w-full rounded-3xl bg-[#ede7e2] p-5 border border-[#ded9d4] shadow-xs flex flex-col justify-between text-left"
          >
            <div>
              {/* Author Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-[#f8f3ee] flex items-center justify-center text-[#594238]">
                  <User size={16} />
                </div>
                <span className="font-serif font-bold text-sm text-[#1d1b19]">
                  {post.author}
                </span>
                <span className="text-xs text-[#8c7166] ml-auto">
                  {post.timestamp}
                </span>
              </div>

              {/* Quote Content */}
              <blockquote className="font-sans text-base sm:text-lg text-[#1d1b19] leading-relaxed mb-4">
                "{post.content}"
              </blockquote>
            </div>

            {/* Support Action Button matching Image 11 */}
            <div className="flex items-center justify-end pt-1">
              <button
                id={`btn-support-post-${post.id}`}
                type="button"
                onClick={() => handleSupport(post.id, post.isSupported)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-serif text-sm font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 ${
                  post.isSupported
                    ? 'bg-[#fed7aa] text-[#9e3d00] border border-[#e0c0b2]'
                    : 'bg-[#f8f3ee] text-[#835100] hover:bg-[#fffaf5] border border-[#ded9d4]'
                }`}
              >
                {post.isSupported ? (
                  <>
                    <Heart size={16} className="fill-[#ba1a1a] text-[#ba1a1a]" />
                    <span>Saath diya ({post.supportCount})</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake size={18} className="text-[#835100]" />
                    <span>Saath dein ({post.supportCount})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sticky CTA Button matching Image 11 */}
      <div className="pt-3 pb-2">
        <button
          id="btn-create-community-post"
          type="button"
          onClick={onCreatePost}
          className="w-full min-h-[58px] rounded-2xl bg-[#9e3d00] hover:bg-[#7c2e00] active:scale-[0.98] text-white font-serif text-xl font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <MessageSquarePlus size={22} />
          <span>Apni baat kahein</span>
        </button>
        <p className="text-center text-xs text-[#594238] mt-2">
          Aapki pehchaan gupt (anonymous) rakhi jayegi
        </p>
      </div>
    </div>
  );
};
