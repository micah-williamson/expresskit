declare var process;

export default function fatal(err: Error) {
  console.error(err);
  process.exit(1);
}