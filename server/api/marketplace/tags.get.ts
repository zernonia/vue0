import { asc } from 'drizzle-orm'

/**
 * Get all marketplace tags
 */
export default defineEventHandler(async () => {
  const db = useDB()

  try {
    const allTags = await db
      .select()
      .from(tables.tags)
      .orderBy(asc(tables.tags.type), asc(tables.tags.name))

    // Group by type for easier consumption
    const grouped = allTags.reduce((acc, tag) => {
      if (!acc[tag.type]) {
        acc[tag.type] = []
      }
      acc[tag.type].push(tag)
      return acc
    }, {} as Record<string, typeof allTags>)

    return {
      success: true,
      data: {
        all: allTags,
        grouped,
      },
    }
  }
  catch (error) {
    console.error('Error fetching tags:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch tags',
    })
  }
})
