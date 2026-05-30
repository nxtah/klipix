"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { deleteScene, moveScene, toggleScene } from "./actions"
import { ScriptModal } from "./script-modal"
import { GripVertical, Trash2, ChevronDown } from "lucide-react"

interface Scene {
  id: string
  title: string | null
  description: string | null
  duration_seconds: number | null
  script_content: string | null
  is_completed: boolean
  order_index: number
}

interface SortableSceneItemProps {
  scene: Scene
  index: number
  totalScenes: number
  projectId: string
}

function SortableSceneItem({
  scene,
  index,
  totalScenes,
  projectId,
}: SortableSceneItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Mobile: Show expandable card with separate drag handle
  if (isMobile) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs select-none"
      >
        <div className="flex items-start gap-3">
          {/* Grip handle - only this is draggable */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent/30 rounded-lg transition-colors flex-shrink-0 mt-0.5"
            aria-label="Drag to reorder"
            suppressHydrationWarning
            onTouchStart={(e) => e.preventDefault()}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Content - clickable to expand */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 text-left hover:opacity-70 transition-opacity"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {scene.title || `Scene ${index + 1}`}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {scene.description || "No description"}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge className={scene.is_completed ? "bg-secondary/80" : "bg-accent/30"}>
                  {scene.is_completed ? "Done" : "In progress"}
                </Badge>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </div>
            </div>
          </button>
        </div>

        {isExpanded && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Duration: {scene.duration_seconds ? `${scene.duration_seconds}s` : "Not set"}
              </p>
              <div className="flex flex-col gap-2">
                <ScriptModal projectId={projectId} scriptContent={scene.script_content} />
                <form action={toggleScene} className="contents">
                  <input type="hidden" name="scene_id" value={scene.id} />
                  <input type="hidden" name="project_id" value={projectId} />
                  <input type="hidden" name="is_completed" value={String(scene.is_completed)} />
                  <Button size="sm" type="submit" className="w-full min-h-11">
                    {scene.is_completed ? "Mark not done" : "Mark done"}
                  </Button>
                </form>
                <form action={deleteScene} className="contents">
                  <input type="hidden" name="scene_id" value={scene.id} />
                  <input type="hidden" name="project_id" value={projectId} />
                  <Button size="sm" type="submit" variant="outline" className="w-full min-h-11">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Desktop: Show all buttons
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="space-y-3 rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent/30 rounded-lg transition-colors"
            aria-label="Drag to reorder scene"
            suppressHydrationWarning
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">
              {scene.title || `Scene ${index + 1}`}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {scene.description || "No description"}
            </p>
          </div>
        </div>
        <Badge className={scene.is_completed ? "bg-secondary/80" : "bg-accent/30"}>
          {scene.is_completed ? "Done" : "In progress"}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <ScriptModal projectId={projectId} scriptContent={scene.script_content} />
        <form action={toggleScene} className="contents">
          <input type="hidden" name="scene_id" value={scene.id} />
          <input type="hidden" name="project_id" value={projectId} />
          <input type="hidden" name="is_completed" value={String(scene.is_completed)} />
          <Button size="sm" type="submit" className="min-h-11">
            {scene.is_completed ? "Mark not done" : "Mark done"}
          </Button>
        </form>
        <form action={deleteScene} className="contents">
          <input type="hidden" name="scene_id" value={scene.id} />
          <input type="hidden" name="project_id" value={projectId} />
          <Button size="sm" type="submit" variant="outline" className="min-h-11">
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <Separator />
      <div className="text-xs text-muted-foreground">
        Duration: {scene.duration_seconds ? `${scene.duration_seconds}s` : "Not set"}
      </div>
    </div>
  )
}

interface SortableSceneListProps {
  scenes: Scene[]
  projectId: string
}

export function SortableSceneList({
  scenes,
  projectId,
}: SortableSceneListProps) {
  const [items, setItems] = useState<Scene[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setItems(scenes)
    setIsClient(true)
  }, [scenes])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    // Optimistic update
    const newItems = arrayMove(items, oldIndex, newIndex)
    setItems(newItems)

    // Send to server
    const formData = new FormData()
    formData.set("scene_id", active.id as string)
    formData.set("project_id", projectId)
    formData.set(
      "direction",
      newIndex > oldIndex ? "down" : "up"
    )

    try {
      await moveScene(formData)
    } catch (error) {
      // Revert on error
      setItems(items)
      console.error("Failed to reorder scene:", error)
    }
  }

  if (!isClient) {
    return (
      <div className="space-y-4">
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            className="space-y-3 rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-1 rounded-lg">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">
                    {scene.title || `Scene ${index + 1}`}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {scene.description || "No description"}
                  </p>
                </div>
              </div>
              <Badge className={scene.is_completed ? "bg-secondary/80" : "bg-accent/30"}>
                {scene.is_completed ? "Done" : "In progress"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {items.map((scene, index) => (
            <SortableSceneItem
              key={scene.id}
              scene={scene}
              index={index}
              totalScenes={items.length}
              projectId={projectId}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
