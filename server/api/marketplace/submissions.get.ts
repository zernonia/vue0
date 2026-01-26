import { eq, desc } from 'drizzle-orm'
import { submissions, marketplaceComponents, users } from '~/server/database/schema'

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
        submission: submissions,
        component: marketplaceComponents,
        author: users,
      })
      .from(submissions)
      .leftJoin(marketplaceComponents, eq(submissions.componentId, marketplaceComponents.id))
      .leftJoin(users, eq(marketplaceComponents.authorId, users.id))
      .where(eq(submissions.userId, session.user.id))
      .orderBy(desc(submissions.submittedAt))

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
