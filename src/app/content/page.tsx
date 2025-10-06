"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Content {
  _id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  createdAt: string;
}

export default function ContentPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "science", "math", "history", "arts", "technology"];

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      try {
        const categoryFilter = selectedCategory === "all" ? "" : `&category=${selectedCategory}`;
        const response = await fetch(
          `/api/content?page=${page}&limit=12${categoryFilter}`
        );
        if (response.ok) {
          const data = await response.json();
          setContent(data.content);
          setTotalPages(data.pagination.pages);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [page, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Content</h1>
          <p className="text-muted-foreground">
            Discover educational content tailored for you
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory(category);
                setPage(1);
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading content...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {content.map((item) => (
                <Card key={item._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-secondary px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="capitalize">{item.category}</span>
                      <span>{item.views} views</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {content.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No content found for this category. Try a different filter!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center px-4">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
