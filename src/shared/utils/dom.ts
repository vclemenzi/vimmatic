const isContentEditable = (element: Element): boolean => {
  const value = element.getAttribute("contenteditable");
  if (value === null) {
    return false;
  }
  return value.toLowerCase() === "true" || value.toLowerCase() === "";
};

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const rectangleCoordsRect = (coords: string): Rect => {
  const [left, top, right, bottom] = coords.split(",").map((n) => Number(n));
  return { left, top, right, bottom };
};

const circleCoordsRect = (coords: string): Rect => {
  const [x, y, r] = coords.split(",").map((n) => Number(n));
  return {
    left: x - r,
    top: y - r,
    right: x + r,
    bottom: y + r,
  };
};

const polygonCoordsRect = (coords: string): Rect => {
  const params = coords.split(",");
  let minx = Number(params[0]),
    maxx = Number(params[0]),
    miny = Number(params[1]),
    maxy = Number(params[1]);
  const len = Math.floor(params.length / 2);
  for (let i = 2; i < len; i += 2) {
    const x = Number(params[i]),
      y = Number(params[i + 1]);
    if (x < minx) {
      minx = x;
    }
    if (x > maxx) {
      maxx = x;
    }
    if (y < miny) {
      miny = y;
    }
    if (y > maxy) {
      maxy = y;
    }
  }
  return { left: minx, top: miny, right: maxx, bottom: maxy };
};

const viewportRect = (e: Element): Rect => {
  if (e.tagName !== "AREA") {
    return e.getBoundingClientRect();
  }

  const mapElement = e.parentNode as HTMLMapElement;
  const imgElement = document.querySelector(
    `img[usemap="#${mapElement.name}"]`,
  ) as HTMLImageElement;
  const { left: mapLeft, top: mapTop } = imgElement.getBoundingClientRect();
  const coords = e.getAttribute("coords");
  if (!coords) {
    return e.getBoundingClientRect();
  }

  let rect = { left: 0, top: 0, right: 0, bottom: 0 };
  switch (e.getAttribute("shape")) {
    case "rect":
    case "rectangle":
      rect = rectangleCoordsRect(coords);
      break;
    case "circ":
    case "circle":
      rect = circleCoordsRect(coords);
      break;
    case "poly":
    case "polygon":
      rect = polygonCoordsRect(coords);
      break;
  }
  return {
    left: rect.left + mapLeft,
    top: rect.top + mapTop,
    right: rect.right + mapLeft,
    bottom: rect.bottom + mapTop,
  };
};

const isVisible = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  if (style.overflow !== "visible" && (rect.width === 0 || rect.height === 0)) {
    return false;
  }
  if (rect.right < 0 && rect.bottom < 0) {
    return false;
  }
  if (window.innerWidth < rect.left && window.innerHeight < rect.top) {
    return false;
  }
  if (
    element instanceof HTMLInputElement &&
    element.type.toLowerCase() === "hidden"
  ) {
    return false;
  }

  const { display, visibility } = window.getComputedStyle(element);
  if (display === "none" || visibility === "hidden") {
    return false;
  }
  return true;
};

export { isContentEditable, viewportRect, isVisible };
