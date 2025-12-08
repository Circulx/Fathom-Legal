import Image from '@tiptap/extension-image'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { useCallback, useEffect, useRef, useState } from 'react'

const ResizableImageComponent = ({ node, updateAttributes, selected }: any) => {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const startX = useRef(0)
  const startY = useRef(0)
  const startWidth = useRef(0)
  const startHeight = useRef(0)

  const handleMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)
    startX.current = e.clientX
    startY.current = e.clientY
    
    const img = imageRef.current
    if (img) {
      startWidth.current = img.offsetWidth
      startHeight.current = img.offsetHeight
    }
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeHandle) return

    const deltaX = e.clientX - startX.current
    const deltaY = e.clientY - startY.current

    let newWidth = startWidth.current
    let newHeight = startHeight.current

    switch (resizeHandle) {
      case 'se': // Southeast (bottom-right)
        newWidth = Math.max(50, startWidth.current + deltaX)
        newHeight = Math.max(50, startHeight.current + deltaY)
        break
      case 'sw': // Southwest (bottom-left)
        newWidth = Math.max(50, startWidth.current - deltaX)
        newHeight = Math.max(50, startHeight.current + deltaY)
        break
      case 'ne': // Northeast (top-right)
        newWidth = Math.max(50, startWidth.current + deltaX)
        newHeight = Math.max(50, startHeight.current - deltaY)
        break
      case 'nw': // Northwest (top-left)
        newWidth = Math.max(50, startWidth.current - deltaX)
        newHeight = Math.max(50, startHeight.current - deltaY)
        break
      case 'e': // East (right)
        newWidth = Math.max(50, startWidth.current + deltaX)
        break
      case 'w': // West (left)
        newWidth = Math.max(50, startWidth.current - deltaX)
        break
      case 's': // South (bottom)
        newHeight = Math.max(50, startHeight.current + deltaY)
        break
      case 'n': // North (top)
        newHeight = Math.max(50, startHeight.current - deltaY)
        break
    }

    updateAttributes({
      width: newWidth,
      height: newHeight,
    })
  }, [isResizing, resizeHandle, updateAttributes])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    setResizeHandle(null)
  }, [])

  // Add global mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  const width = node.attrs.width || 'auto'
  const height = node.attrs.height || 'auto'
  const src = node.attrs.src
  const alt = node.attrs.alt || ''

  const handleStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: '#000000',
    border: '1px solid white',
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    cursor: 'pointer',
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  }

  const cornerHandleStyle: React.CSSProperties = {
    ...handleStyle,
    cursor: 'nwse-resize',
  }

  const edgeHandleStyle: React.CSSProperties = {
    ...handleStyle,
    cursor: 'ns-resize',
  }

  const horizontalHandleStyle: React.CSSProperties = {
    ...handleStyle,
    cursor: 'ew-resize',
  }

  return (
    <NodeViewWrapper 
      className="react-component relative inline-block" 
      style={{ 
        display: 'inline-block', 
        position: 'relative',
        outline: selected ? '1px dashed #000000' : 'none',
        outlineOffset: selected ? '4px' : '0',
      }}
    >
      {selected && (
        <>
          {/* Border outline */}
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '-4px',
              right: '-4px',
              bottom: '-4px',
              border: '1px dashed #000000',
              pointerEvents: 'none',
              zIndex: 999,
            }}
          />
          
          {/* Corner handles */}
          <div
            style={{ ...cornerHandleStyle, top: '-8px', left: '-8px', cursor: 'nwse-resize' }}
            onMouseDown={(e) => handleMouseDown(e, 'nw')}
          />
          <div
            style={{ ...cornerHandleStyle, top: '-8px', right: '-8px', cursor: 'nesw-resize' }}
            onMouseDown={(e) => handleMouseDown(e, 'ne')}
          />
          <div
            style={{ ...cornerHandleStyle, bottom: '-8px', left: '-8px', cursor: 'nesw-resize' }}
            onMouseDown={(e) => handleMouseDown(e, 'sw')}
          />
          <div
            style={{ ...cornerHandleStyle, bottom: '-8px', right: '-8px', cursor: 'nwse-resize' }}
            onMouseDown={(e) => handleMouseDown(e, 'se')}
          />
          
          {/* Edge handles */}
          <div
            style={{ ...horizontalHandleStyle, top: '50%', left: '-8px', transform: 'translateY(-50%)' }}
            onMouseDown={(e) => handleMouseDown(e, 'w')}
          />
          <div
            style={{ ...horizontalHandleStyle, top: '50%', right: '-8px', transform: 'translateY(-50%)' }}
            onMouseDown={(e) => handleMouseDown(e, 'e')}
          />
          <div
            style={{ ...edgeHandleStyle, left: '50%', top: '-8px', transform: 'translateX(-50%)' }}
            onMouseDown={(e) => handleMouseDown(e, 'n')}
          />
          <div
            style={{ ...edgeHandleStyle, left: '50%', bottom: '-8px', transform: 'translateX(-50%)' }}
            onMouseDown={(e) => handleMouseDown(e, 's')}
          />
        </>
      )}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{
          width: width === 'auto' ? 'auto' : `${width}px`,
          height: height === 'auto' ? 'auto' : `${height}px`,
          maxWidth: '100%',
          display: 'block',
        }}
        draggable={false}
      />
    </NodeViewWrapper>
  )
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => {
          const width = element.getAttribute('width')
          return width ? parseInt(width) : null
        },
        renderHTML: attributes => {
          if (!attributes.width) {
            return {}
          }
          return {
            width: attributes.width,
          }
        },
      },
      height: {
        default: null,
        parseHTML: element => {
          const height = element.getAttribute('height')
          return height ? parseInt(height) : null
        },
        renderHTML: attributes => {
          if (!attributes.height) {
            return {}
          }
          return {
            height: attributes.height,
          }
        },
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent)
  },
})

