import { eq, desc } from 'drizzle-orm'

/**
 * Get user's marketplace submissions
 */
export default defineEventHandler(async (event) => {
  // Validate user session
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized. Please login to view submissions.',
    })
  }

  const db = useDB()

  try {
    // Fetch user's submissions with component details
    const userSubmissions = await db
      .select({
        submission: tables.submissions,
        component: tables.marketplaceComponents,
        author: tables.users,
      })
      .from(tables.submissions)
      .leftJoin(tables.marketplaceComponents, eq(tables.submissions.componentId, tables.marketplaceComponents.id))
      .leftJoin(tables.users, eq(tables.marketplaceComponents.authorId, tables.users.id))
      .where(eq(tables.submissions.userId, session.user.id))
      .orderBy(desc(tables.submissions.submittedAt))

    return {
      success: true,
      data: userSubmissions,
    }
  }
  catch (error) {
    console.error('Error fetching submissions:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch submissions',
    })
  }
})
