declare module '#auth-utils' {
  interface UserSession {
    // define the type here
    id: number
    email: string
    name: string
    avatar_url: string
  }
}
export {}

export default oauth.githubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
    try {
      await useDB().insert(tables.users).values({
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
      })
    }
    catch (err) {
      console.log('err', err)
    }

    // @ts-expect-error package type issue
    await setUserSession(event, { user })
    return sendRedirect(event, '/')
  },
})
