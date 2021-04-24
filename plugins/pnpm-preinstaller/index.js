module.exports = {
  onPreBuild: async ({ utils: { build, run } }) => {
    try {
      if (process.env.CI)
        await run.command(
          'npx pnpm install -r --store=node_modules/.pnpm-store'
        )
      else await run.command('echo skipping pnpm install')
      await run.command('npm run generate')
    } catch (e) {
      build.failBuild(e.message)
    }
  }
}
