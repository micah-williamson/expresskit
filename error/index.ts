declare var process: any;

export function fatal(err: Error) {
  console.error(err);
  process.exit(1);
}