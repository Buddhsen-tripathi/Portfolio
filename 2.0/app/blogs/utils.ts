import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type BlogPost = {
  slug: string
  title: string
  date: string
  excerpt: string
  type?: string
}

function convertDateFormat(dateStr: string): string {
  const [dd, mm, yyyy] = dateStr.split("-").map(Number);
  // Handle potential parsing issues if format is different
  if (isNaN(dd) || isNaN(mm) || isNaN(yyyy)) {
    console.warn(`Invalid date format encountered: ${dateStr}. Using original.`);
    // Attempt to parse directly if it's already in a standard format like YYYY-MM-DD
    const directDate = new Date(dateStr);
    if (!isNaN(directDate.getTime())) {
      return dateStr; // Assume it's already correct
    }
    return new Date().toISOString().split('T')[0]; // Fallback to today
  }
  return `${yyyy}-${mm.toString().padStart(2, "0")}-${dd.toString().padStart(2, "0")}`;
}

export function getAllBlogPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), 'app/blogs/posts')
  const filenames = fs.readdirSync(postsDirectory)

  return filenames
    .filter((filename) => filename.endsWith('.mdx'))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug: filename.replace(/\.mdx?$/, ''),
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        type: data.type,
      }
    })
    .sort((a, b) => {
      const dateA = new Date(convertDateFormat(a.date)).getTime();
      const dateB = new Date(convertDateFormat(b.date)).getTime();
      if (isNaN(dateA) || isNaN(dateB)) {
        return 0; 
      }
      return dateB - dateA;
    });
}