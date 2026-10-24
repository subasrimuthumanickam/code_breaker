

export interface CurrentPlayer {
  id: number;
  username: string;
  name: string;
}

let current: CurrentPlayer | null = null;

export const setCurrentPlayer = (p: CurrentPlayer) => {
  current = p;
};

export const clearCurrentPlayer = () => {
  current = null;
};

export const getCurrentPlayer = (): CurrentPlayer | null => current;

export const getCurrentPlayerId = (): number | null =>
  current ? current.id : null;

/* "/player" -> "/player?playerId=2"  |  "/x?a=1" -> "/x?a=1&playerId=2" */
export const withPlayer = (path: string): string => {
  const id = getCurrentPlayerId();
  if (id == null) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}playerId=${id}`;
};