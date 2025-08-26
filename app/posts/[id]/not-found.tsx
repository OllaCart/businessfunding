import { MarinaHeader } from "@/components/marina-header"
import { MarinaFooter } from "@/components/marina-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileX, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <MarinaHeader />

      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center py-16">
              <CardContent>
                <FileX className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h1 className="font-serif font-bold text-3xl text-foreground mb-4">Post Not Found</h1>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  The post you're looking for doesn't exist or may have been removed. It might have been unpublished or
                  the link may be incorrect.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/posts">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Updates
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/">Go to Homepage</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <MarinaFooter />
    </div>
  )
}
