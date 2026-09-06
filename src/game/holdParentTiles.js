const LOADED = 4;

function hasScene(tile) {
  return tile?.internal?.loadingState === LOADED && !!tile.engineData?.scene;
}

function usedThisFrame(tile) {
  const t = tile?.traversal;
  return !!(t && t.used && t.inFrustum);
}

/** True when this tile or its in-view descendants can draw the ground. */
function covers(tile) {
  if (!tile) return false;
  if (hasScene(tile)) return true;

  const internal = tile.internal;
  if (!internal) return false;

  if (!internal.hasContent) {
    const kids = tile.children || [];
    if (!kids.length) return true;
    const needed = kids.filter(usedThisFrame);
    return needed.length ? needed.every(covers) : false;
  }

  if (internal.hasUnrenderableContent || !internal.hasRenderableContent) {
    const kids = tile.children || [];
    if (!kids.length) return false;
    const needed = kids.filter(usedThisFrame);
    return needed.length ? needed.every(covers) : false;
  }

  return false;
}

function replacementsReady(tile) {
  const kids = tile?.children || [];
  if (!kids.length) return true;
  const needed = kids.filter(usedThisFrame);
  if (!needed.length) return true;
  return needed.every(covers);
}

function hideTile(tiles, tile) {
  if (!tiles || !tile) return;
  try {
    tiles.setTileVisible(tile, false);
  } catch {
    const scene = tile.engineData?.scene;
    if (scene?.parent) scene.parent.remove(scene);
  }
}

/**
 * Keep a REPLACE parent drawn until every in-view child has a mesh.
 * Loaded ground may only refine — never drop to sky / white.
 */
export function createHoldParentTilesPlugin() {
  const held = new Set();

  return {
    name: "HOLD_PARENT_TILES_PLUGIN",
    // Before TilesFadePlugin (-2) so a hide is blocked, not faded to empty.
    priority: -3,
    tiles: null,
    held,

    init(tiles) {
      this.tiles = tiles;
      this._onDispose = ({ tile }) => {
        held.delete(tile);
      };
      this._onAfter = () => {
        for (const tile of [...held]) {
          if (!hasScene(tile)) {
            held.delete(tile);
            continue;
          }
          if (replacementsReady(tile)) {
            held.delete(tile);
            hideTile(tiles, tile);
            continue;
          }
          tiles.markTileUsed(tile);
        }
      };
      tiles.addEventListener("dispose-model", this._onDispose);
      tiles.addEventListener("update-after", this._onAfter);
    },

    setTileVisible(tile, visible) {
      if (visible) {
        held.delete(tile);
        return false;
      }
      if (!replacementsReady(tile)) {
        held.add(tile);
        this.tiles?.markTileUsed(tile);
        return true;
      }
      held.delete(tile);
      return false;
    },

    dispose() {
      const tiles = this.tiles;
      if (!tiles) return;
      tiles.removeEventListener("dispose-model", this._onDispose);
      tiles.removeEventListener("update-after", this._onAfter);
      held.clear();
    },
  };
}
