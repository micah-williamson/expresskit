declare var process: any;

export default function fatal(err: Error) {
  console.error(err);
  process.exit(1);
}