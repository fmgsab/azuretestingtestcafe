export function extractPathValue(args: Record<string, unknown>, path: string): unknown {
  const allPaths = path.split('.');
  if (allPaths.length > 1) {
    const currentPath = allPaths.at(0);
    const nextPath = allPaths.slice(1).join('.');
    return currentPath && args[currentPath] ? extractPathValue(args[currentPath] as Record<string, unknown>, nextPath) : '';
  }
  return args[path];
}
