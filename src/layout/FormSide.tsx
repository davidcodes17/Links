import type { IframelyResponse } from "@/types/framely";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart } from "lucide-react";

interface Post {
  data: IframelyResponse;
  likes: number;
  liked: boolean;
  comments: string[];
}

const FormSide = () => {
  const [url, setUrl] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>(
    {}
  );

  const fetchPreview = async () => {
    if (!url) return;

    const res = await fetch(
      `https://iframe.ly/api/iframely?url=${encodeURIComponent(
        url
      )}&api_key=505af26aabd37ff46c6960`
    );
    const data: IframelyResponse = await res.json();

    setPosts((prev) => [
      { data, likes: 0, liked: false, comments: [] },
      ...prev,
    ]);

    setUrl("");
  };

  const toggleLike = (index: number) => {
    setPosts((prev) =>
      prev.map((post, i) =>
        i === index
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const addComment = (index: number) => {
    const text = commentInputs[index]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((post, i) =>
        i === index
          ? { ...post, comments: [...post.comments, text] }
          : post
      )
    );

    setCommentInputs((prev) => ({ ...prev, [index]: "" }));
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      {/* Input + Button */}
      <div className="">
        <h1 className="text-xl">Links by Tola Adewale</h1>
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Paste a link..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border rounded-lg p-3 flex-1 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <Button className="py-5" onClick={fetchPreview}>
          Post
        </Button>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map((post:any, idx) => {
          const video = post.data.links?.player?.[0]?.href;
          const images = post.data.links?.image || [];
          const thumbnail = post.data.links?.thumbnail?.[0]?.href;

          return (
            <Card
              key={idx}
              className="overflow-hidden rounded-2xl shadow-lg border bg-white"
            >
              {/* Header */}
              <CardHeader className="flex items-center gap-3 p-4">
                <Avatar>
                  <AvatarImage
                    src={post.data.links?.icon?.[0]?.href}
                    alt={post.data.meta?.site || "site"}
                  />
                  <AvatarFallback>
                    {post.data.meta?.site?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">
                    {post.data.meta?.site}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {post.data.meta?.author}
                  </p>
                </div>
              </CardHeader>

              {/* Media (Video / Image / Thumbnail) */}
              <div className="w-full">
                {video ? (
                  <iframe
                    src={video}
                    className="w-full h-64"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                ) : images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {images.map((img:any, i:any) => (
                      <img
                        key={i}
                        src={img.href}
                        alt="preview"
                        className="w-full object-cover rounded-lg"
                      />
                    ))}
                  </div>
                ) : thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="preview"
                    className="w-full object-cover max-h-64"
                  />
                ) : null}
              </div>

              {/* Content */}
              <CardContent className="p-4 space-y-2">
                <h2 className="font-bold text-lg leading-snug line-clamp-2">
                  {post.data.meta?.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {post.data.meta?.description}
                </p>
                <a
                  href={post.data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  {new URL(post.data.url).hostname}
                </a>

                {/* Like + Comment Buttons */}
                <div className="flex items-center gap-6 mt-4">
                  <button
                    onClick={() => toggleLike(idx)}
                    className={`flex items-center gap-1 text-sm ${
                      post.liked ? "text-red-500" : "text-gray-600"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        post.liked ? "fill-red-500 stroke-red-500" : ""
                      }`}
                    />
                    {post.likes}
                  </button>

                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <MessageCircle className="w-5 h-5" />
                    {post.comments.length}
                  </div>
                </div>

                {/* Comment Input */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[idx] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [idx]: e.target.value,
                      }))
                    }
                    className="flex-1 border rounded-lg p-2 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => addComment(idx)}
                    className="px-3"
                  >
                    Post
                  </Button>
                </div>

                {/* Comment List */}
                {post.comments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {post.comments.map((c:any, i:any) => (
                      <div
                        key={i}
                        className="text-sm bg-gray-100 rounded-lg p-2"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FormSide;
