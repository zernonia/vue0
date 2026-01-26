import { eq } from 'drizzle-orm'
import { z } from 'zod'

/**
 * Submit a component to the marketplace
 */

const submitSchema = z.object({
  componentId: z.string().min(1, 'Component ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  longDescription: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags allowed'),
  license: z.string().default('MIT'),
  repositoryUrl: z.string().url().optional().or(z.literal('')),
})

export default defineEventHandler(async (event) => {
  // Validate user session
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized. Please login to submit components.',
    })
  }

  // Parse and validate request body
  const body = await readBody(event)
  const validationResult = submitSchema.safeParse(body)

  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Validation failed',
      data: validationResult.error.flatten().fieldErrors,
    })
  }

  const data = validationResult.data
  const db = useDB()

  try {
    // 1. Verify the component exists and belongs to the user
    const component = await db
      .select()
      .from(tables.components)
      .where(eq(tables.components.id, data.componentId))
      .get()

    if (!component) {
      throw createError({
        statusCode: 404,
        message: 'Component not found',
      })
    }

    if (component.userId !== session.user.id) {
      throw createError({
        statusCode: 403,
        message: 'You can only submit your own components',
      })
    }

    if (!component.completed || !component.code) {
      throw createError({
        statusCode: 400,
        message: 'Component generation must be completed before submission',
      })
    }

    // 2. Validate component code for security and quality
    const validation = await validateComponent(component.code)

    if (!validation.valid) {
      throw createError({
        statusCode: 400,
        message: 'Component validation failed',
        data: {
          errors: validation.errors,
          warnings: validation.warnings,
          score: validation.score,
        },
      })
    }

    // 3. Extract design tokens for customization
    const designTokens = await extractDesignTokens(component.code)

    // 4. Check if component already submitted to marketplace
    if (component.marketplaceId) {
      const existing = await db
        .select()
        .from(tables.marketplaceComponents)
        .where(eq(tables.marketplaceComponents.id, component.marketplaceId))
        .get()

      if (existing) {
        throw createError({
          statusCode: 400,
          message: 'This component has already been submitted to the marketplace',
          data: { marketplaceId: existing.id },
        })
      }
    }

    // 5. Create marketplace component entry
    const [marketplaceComponent] = await db
      .insert(tables.marketplaceComponents)
      .values({
        title: data.title,
        description: data.description,
        longDescription: data.longDescription || data.description,
        componentId: component.id,
        authorId: session.user.id,
        status: 'pending', // Awaiting review
        category: data.category,
        license: data.license,
        repositoryUrl: data.repositoryUrl || null,
        previewUrl: `/p/${component.slug}`,
        metadata: {
          validation,
          designTokens,
          originalPrompt: component.description,
        },
      })
      .returning()

    // 6. Create submission entry for moderation workflow
    const [submission] = await db
      .insert(tables.submissions)
      .values({
        componentId: marketplaceComponent.id,
        userId: session.user.id,
        status: 'submitted',
      })
      .returning()

    // 7. Link marketplace component to original component
    await db
      .update(tables.components)
      .set({ marketplaceId: marketplaceComponent.id })
      .where(eq(tables.components.id, component.id))

    // 8. Associate tags
    for (const tagId of data.tags) {
      await db.insert(tables.componentTags).values({
        componentId: marketplaceComponent.id,
        tagId,
      })
    }

    // 9. Update component design tokens
    await db
      .update(tables.components)
      .set({ designTokens })
      .where(eq(tables.components.id, component.id))

    return {
      success: true,
      message: 'Component submitted successfully! It will be reviewed shortly.',
      data: {
        marketplaceId: marketplaceComponent.id,
        submissionId: submission.id,
        status: 'pending',
        validationScore: validation.score,
      },
    }
  }
  catch (error) {
    // If it's already a createError, rethrow it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Otherwise, log and throw generic error
    console.error('Error submitting component:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to submit component. Please try again.',
    })
  }
})
