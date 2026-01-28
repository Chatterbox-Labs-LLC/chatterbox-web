export default function NewPostPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">New Post</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
          <input 
            id="title"
            type="text" 
            className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black"
            placeholder="What's on your mind?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="content">Content</label>
          <textarea 
            id="content"
            rows={8}
            className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
            placeholder="Write your post content here..."
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button 
            type="button"
            className="px-4 py-2 text-sm font-medium hover:underline"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
