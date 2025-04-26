import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ActivityGroupHeader({ title, count, isSecondary = false }) {
  const [collapsed, setCollapsed] = useState(false)
  
  return (
    <div className={`flex items-center justify-between ${isSecondary ? 'pl-4' : ''}`}>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1 h-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <h3 className={`font-medium ${isSecondary ? 'text-sm text-muted-foreground' : ''}`}>
          {title}
        </h3>
        <Badge variant="outline">{count}</Badge>
      </div>
    </div>
  )
}
