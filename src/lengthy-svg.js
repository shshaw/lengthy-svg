function Lengthy(els) {
  return $(els).map(function(el, i) {
    var length = getLength(el);
    el.classList.add("lengthy");
    el.style.setProperty("--path-length", length);
    return {
      el: el,
      length: length
    };
  });
}

function getValue(a) {
  a = a || 0;
  return a.value !== undefined ? a.value : a.baseVal ? getValue(a.baseVal) : a;
}

function distance(x1, y1, x2, y2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

// Ramanujan ellipse circumference approximation
// Thanks to https://twitter.com/jhnsnc
function ellipseLength(rx, ry) {
  return Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
}

function getLength(el) {
  if (!el) {
    return false;
  }
  // <path> or any SVG element in SVG2 supporting browsers
  if (el.getTotalLength) {
    return el.getTotalLength();
  }
  // <use>
  if (el instanceof SVGUseElement) {
    return getLength(document.querySelector(getValue(el.href)));
  }

  // <rect>, rounded <rect>, and <ellipse>
  if (el.width || el.height || el.rx || el.ry) {
    var w = getValue(el.width);
    var h = getValue(el.height);
    var rx = getValue(el.rx);
    var ry = getValue(el.ry);

    if (w || h) {
      rx = Math.min(rx, w / 2);
      ry = Math.min(ry, h / 2);
      return (
        (w + h - 2 * (rx + ry)) * 2 + (rx || ry ? ellipseLength(rx, ry) : 0)
      );
    } else {
      return ellipseLength(rx, ry);
    }
  }
  // <line>
  if (el.x1) {
    return distance(
      getValue(el.x1),
      getValue(el.y1),
      getValue(el.x2),
      getValue(el.y2)
    );
  }
  // <circle>
  if (el.r) {
    return 2 * Math.PI * getValue(el.r);
  }
  // <polyline> and <polygon>
  if (el.points) {
    var p = el.getAttribute("points").split(/[\s,]+/);
    var d = 0,
      i = 0,
      l = p.length - 2;
    for (; i < l; i += 2) {
      d += distance(p[i], p[i + 1], p[i + 2], p[i + 3]);
    }
    if (el instanceof SVGPolygonElement) {
      d += distance(p[i], p[i + 1], p[0], p[1]);
    }
    return d;
  }
  return false;
}

Lengthy.getLength = getLength;

function $(els, parent) {
  return Array.prototype.slice.call(
    els.nodeName
      ? [els]
      : els[0].nodeName ? els : document.querySelectorAll(els),
    0
  );
}
Lengthy.$ = $;

export default Lengthy;
