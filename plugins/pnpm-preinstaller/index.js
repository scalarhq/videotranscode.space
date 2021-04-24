module.exports = {
  onPreBuild: async ({ utils: { build, run } }) => {
    try {
      if (process.env.CI) {
        await run.command(
          'npx pnpm install -r --store=node_modules/.pnpm-store'
        )
      } else {
        await run.command('echo Skipping pnpm install')
      }
    } catch (e) {
      build.failBuild(e.message)
    }
  }
}
