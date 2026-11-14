import React from 'react'

/**
 * Strips all emoji characters from a string
 */
export function removeEmojis(str = '') {
  if (typeof str !== 'string') return ''
  return str
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]/gu, '')
    .trim()
}

/**
 * Parses inline bold markdown: **text** -> <strong>text</strong>
 */
function renderInlineText(text) {
  if (!text) return null
  const clean = removeEmojis(text)
  const parts = clean.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-paperstory-charcoal">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

/**
 * Renders structured markdown descriptions into clean, elegant typography:
 * - ## HEADING -> styled subheadings
 * - - Bullet item -> styled list items
 * - Paragraphs -> styled with proper spacing
 * - Strips emojis and raw markdown symbols
 */
export default function FormattedDescription({ content, className = '' }) {
  if (!content || typeof content !== 'string') return null

  // Remove emojis and filter out any accidental "tracked couriers" lines
  const cleanContent = removeEmojis(content)

  // Split into lines
  const rawLines = cleanContent.split(/\r?\n/)

  const elements = []
  let currentList = []

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-2 space-y-1 pl-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-paperstory-charcoal/85 leading-relaxed">
              <span className="text-paperstory-maroon select-none mt-0.5">•</span>
              <span className="flex-1">{renderInlineText(item)}</span>
            </li>
          ))}
        </ul>
      )
      currentList = []
    }
  }

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i].trim()

    // Skip empty lines (and flush any active list)
    if (!rawLine) {
      flushList()
      continue
    }

    // Skip any leftover courier tracking lines
    if (/tracked\s+couriers?/i.test(rawLine)) {
      continue
    }

    // Heading: ## Heading or # Heading
    if (rawLine.startsWith('#')) {
      flushList()
      const headingText = rawLine.replace(/^#+\s*/, '')
      elements.push(
        <h4
          key={`heading-${elements.length}`}
          className="font-serif text-xs sm:text-[13px] font-bold uppercase tracking-wider text-paperstory-maroon mt-4 mb-2 pb-1 border-b border-paperstory-maroon/15 first:mt-0"
        >
          {headingText}
        </h4>
      )
      continue
    }

    // List item: - item or * item
    if (/^[-*]\s+/.test(rawLine)) {
      const itemText = rawLine.replace(/^[-*]\s+/, '')
      currentList.push(itemText)
      continue
    }

    // Normal paragraph line
    flushList()
    elements.push(
      <p
        key={`para-${elements.length}`}
        className="text-xs sm:text-[13px] text-paperstory-charcoal/80 leading-relaxed mb-2 last:mb-0"
      >
        {renderInlineText(rawLine)}
      </p>
    )
  }

  flushList()

  return <div className={`formatted-description space-y-1.5 ${className}`}>{elements}</div>
}

