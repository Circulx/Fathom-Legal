'use client'

export function BlogContent({ content }: { content: string }) {

  return (
    <div className="relative">
      {/* Blog Content */}
      <article className={`prose prose-lg prose-slate max-w-none
        prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-8 prose-headings:mb-4
        prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
        prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-2
        prose-p:text-gray-700 prose-p:leading-normal prose-p:mb-4
        [&_p[data-bordered=true]]:border-2 [&_p[data-bordered=true]]:border-[#A5292A] [&_p[data-bordered=true]]:rounded-lg [&_p[data-bordered=true]]:p-4 [&_p[data-bordered=true]]:my-6 [&_p[data-bordered=true]]:bg-red-50 [&_p[data-bordered=true]]:shadow-sm
        prose-a:text-[#A5292A] prose-a:no-underline prose-a:font-semibold hover:prose-a:underline
        prose-strong:text-gray-900 prose-strong:font-bold
        prose-em:text-gray-700 prose-em:italic
        prose-ul:my-6 prose-ul:pl-6
        prose-ol:my-6 prose-ol:pl-6
        prose-li:my-1 prose-li:text-gray-700 prose-li:leading-normal
        prose-blockquote:border-l-4 prose-blockquote:border-[#A5292A] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:my-6
        prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-img:w-full prose-img:h-auto
        prose-hr:border-gray-200 prose-hr:my-8
        prose-code:text-[#A5292A] prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:my-6
        prose-pre-code:bg-transparent prose-pre-code:text-inherit prose-pre-code:p-0
        prose-table:w-full prose-table:my-6 prose-table:border-collapse
        prose-thead:border-b prose-thead:border-gray-300
        prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900
        prose-td:px-4 prose-td:py-2 prose-td:border-b prose-td:border-gray-200 prose-td:text-gray-700`}>
        <div 
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  )
}

