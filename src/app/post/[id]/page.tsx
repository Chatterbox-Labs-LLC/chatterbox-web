export default function PostPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the post by id from Supabase
  const post = {
    title: "Welcome to index",
    author: "admin",
    date: "2024-01-25",
    content: "This is the first post on index. We are glad to have you here! Feel free to explore and share your thoughts."
  };

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="flex space-x-2 text-sm text-gray-500">
          <span>by {post.author}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
      </header>
      
      <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
        {post.content}
      </div>

      <div className="border-t border-gray-100 pt-8 mt-12">
        <h2 className="text-xl font-bold mb-6">Comments</h2>
        <div className="text-center py-12 bg-gray-50 text-gray-500 text-sm">
          No comments yet. Be the first to reply!
        </div>
      </div>
    </article>
  );
}
