"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"

interface Patent {
  id: string
  title: string
  type: string
  status: string
  expiry_date: string | null
}

export default function AssetsPage() {
  const [patents, setPatents] = useState<Patent[]>([])
  const [loading, setLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { addToast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    status: "",
    expiry_date: "",
  })

  const fetchPatents = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("patents").select("*")

      if (error) {
        console.error("Error fetching patents:", error)
        addToast({
          title: "Error",
          description: "Failed to fetch patents",
          variant: "destructive",
        })
        return
      }

      setPatents(data || [])
    } catch (error) {
      console.error("Error:", error)
      addToast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("patents").insert([
        {
          title: formData.title,
          type: formData.type,
          status: formData.status,
          expiry_date: formData.expiry_date || null,
        },
      ])

      if (error) {
        console.error("Error inserting patent:", error)
        addToast({
          title: "Error",
          description: "Failed to create patent",
          variant: "destructive",
        })
        return
      }

      // Success
      addToast({
        title: "Success",
        description: "Patent created successfully",
        variant: "success",
      })

      // Reset form
      setFormData({
        title: "",
        type: "",
        status: "",
        expiry_date: "",
      })

      // Close sheet
      setSheetOpen(false)

      // Refresh list
      await fetchPatents()
    } catch (error) {
      console.error("Error:", error)
      addToast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("zh-CN")
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading assets...</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-end mb-6">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button>Create New</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>创建新专利</SheetTitle>
              <SheetDescription>
                填写以下信息以创建新的专利记录
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="Enter patent title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                >
                  <option value="">Select type</option>
                  <option value="发明专利">发明专利</option>
                  <option value="实用新型">实用新型</option>
                  <option value="外观设计">外观设计</option>
                  <option value="软著">软著</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                >
                  <option value="">Select status</option>
                  <option value="已授权">已授权</option>
                  <option value="审核中">审核中</option>
                  <option value="即将过期">即将过期</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) =>
                    setFormData({ ...formData, expiry_date: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSheetOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
            <SheetClose onClick={() => setSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No patents found
                </TableCell>
              </TableRow>
            ) : (
              patents.map((patent) => (
                <TableRow key={patent.id}>
                  <TableCell className="font-medium">{patent.title}</TableCell>
                  <TableCell>{patent.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        patent.status === "已授权" ? "success" : "warning"
                      }
                    >
                      {patent.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(patent.expiry_date)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
