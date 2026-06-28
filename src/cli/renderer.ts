import chalk from "chalk"

export const renderer = {
  plan: (text: string) =>
    console.log(chalk.yellow(`\n[PLAN] ${text}`)),

  action: (fn: string, input: string) =>
    console.log(chalk.blue(`[ACTION] ${fn}(${input})`)),

  observation: (text: string) =>
    console.log(chalk.dim(`[OBSERVATION] ${text}`)),

  output: (text: string) =>
    console.log(chalk.green.bold(`\n[AGENT] ${text}\n`)),

  error: (text: string) =>
    console.log(chalk.red(`[ERROR] ${text}`)),
}
