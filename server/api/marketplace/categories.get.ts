import { asc } from 'drizzle-orm'
import { categories } from '~/server/database/schema'

/**
 * Get all marketplace categories
 */
export default defineEventHandler(async () => {
  const db = useDB()

  try {
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.order))

    return {
      success: true,
      data: allCategories,
    }
  }
  catch (error) {
    console.error('Error fetching categories:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch categories',
    })
  }
})
