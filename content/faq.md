## What is vue0?

[vue0](https://www.vue0.dev) is a generative AI by ChatGPT. It generates copy-and-paste friendly Vue code based on shadcn-vue and Tailwind CSS that people can use in their projects.

It is an Open Source alternative to the popular [v0](https://v0.dev). It is heavily inspired by the following projects:

1. [v0](https://v0.dev)
2. [openv0](https://github.com/raidendotai/openv0/)

Instead of a Software-as-a-Service (SaaS), this project requires user to use their own OpenAI API Key (with access to ChatGPT4).

## How does vue0 work?

vue0 uses Multi-pass approach by [openv0](https://github.com/raidendotai/openv0/) to generate code based on simple text prompts.
You can check out how it works [here](https://github.com/raidendotai/openv0/?tab=readme-ov-file#how-it-works).

In layman's terms,
1. User enter prompt.
2. Get more explicit description, and which components to use from ChatGPT4.
3. Get usage examples of components.
4. Construct detail prompt with usage, and strict system command.
5. Generate code all in 1 Vue SFC.

## Will my generations be used for training?

In future yes. I plan to publicly share the generated code from ChatGPT, and with the help from community we can look into fine-tuning a model, and drop the Multi-pass approach.

## Can I use output from vue0 for commercial uses?

Yes of course! You are the owner of the OpenAI API Key, you can definitely use the code generated via vue0.

## What is the Tech-stack for vue0?

1. [Nuxt3 - Framework](https://nuxt.com/)
2. [Shadcn-vue - UI](https://shadcn-vue.com/)
3. [Radix-vue - UI](https://radix-vue.com/)
4. [Drizzle - DB ORM](https://orm.drizzle.team/)
5. [Turso - DB](https://turso.tech/)
5. [Zod - Validation](https://zod.dev/)
