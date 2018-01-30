# Lengthy

### _MicroLibrary for SVG Shape Length in a CSS Var_

Lengthy is a JavaScript microlibrary (1.1kb min, 0.6kb gzipped) to get the length of SVG shapes. The length will automatically be added to the element as a CSS Var to make it easy to do CSS animations of SVG `stroke-dashoffset` for the wonderful line drawing SVG technique and other interesting animations.

* [CSS Animation Demo](https://codepen.io/shshaw/pen/LeKKLd/)
* [JavaScript Animation Demo](https://codepen.io/shshaw/pen/JpowPb?editors=1010)
* [Shape Test](https://codepen.io/shshaw/pen/OQPEab)

---

## Installation

Add Lengthy to a projects with [npm](https://npmjs.org):

```
npm install -s lengthy-svg
```

For easy embedding on platforms like [Codepen](https://codepen.io), use [unpkg](https://unpkg.com)

```html
<script src="https://unpkg.com/lengthy-svg/lengthy-svg.js"></script>
```

--

## Usage

Simply call `Lengthy` on a specific element, list of elements or a selector. The affected elements will receive a CSS var in their `style` and the `lengthy` class added.

_Input_

```html
<svg viewBox="0 0 60 60">
  <circle data-lengthy cx="30" cy="30" r="20" />
</svg>
```

_JavaScript_

```js
Lengthy("[data-lengthy]");
```

_Output_

```html
<svg viewBox="0 0 60 60">
  <circle data-lengthy cx="30" cy="30" r="20" class="lengthy" style="--path-length:124.854;"></circle>
</svg>
```

---

## CSS Animation

For a standard line-drawing animation, this is the CSS required.

It should be a relatively simple setup, but unfortunately, Chrome/Blink has a glitch with the CSS var animation keyframes. Chrome incorrectly treats a unitless `calc()`'d `var()` animation as a "discrete" animation, snapping to each value instead of transitioning between the values.

Firefox and Webkit/Blink all use unprefixed `animation-name`, so to target Webkit/Blink specifically, you'll use `-webkit-animation-name` for the override, then `-moz-animation-name` to override back for Firefox.

[CSS Animation Demo](https://codepen.io/shshaw/pen/LeKKLd/)

```css
.lengthy {
  stroke-dasharray: var(--path-length) var(--path-length);

  animation-duration: 3s;
  animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
  animation-iteration-count: infinite;
  animation-direction: alternate;

  animation-name: stroke-move;
  /* Override keyframes to fix a webkit glitch */
  -webkit-animation-name: webkit-stroke-move;
  /* Override yet again back to the original keyframes since Firefox obeys -webkit properties */
  -moz-animation-name: stroke-move;
}

@keyframes stroke-move {
  0%,
  10% {
    stroke-dashoffset: calc(1 * var(--path-length));
  }
  90%,
  100% {
    stroke-dashoffset: calc(-1 * var(--path-length));
  }
}

/**
 * Webkit does not support animating the stroke-dashoffset value _without_ a unit,
 * so we have to deliver a separate keyframe list via -webkit-animation-name
 */
@keyframes webkit-stroke-move {
  0%,
  10% {
    stroke-dashoffset: calc(1px * var(--path-length));
  }
  90%,
  100% {
    stroke-dashoffset: calc(-1px * var(--path-length));
  }
}
```

--

## JavaScript Animation

Lengthy will return an array containing all the elements affected and their lengths if you want to use a JavaScript animation library like [TweenRex](https://github.com/tweenrex/tweenrex) or use the length data for other purposes.

[JavaScript Animation Demo](https://codepen.io/shshaw/pen/JpowPb?editors=1010)

```js
const targets = Lengthy(".stripe");

const tweens = targets.map(function(target) {
  target.el.style.strokeDasharray = target.length;
  return {
    duration: 3000,
    subscribe: tweenrex.interpolate({
      targets: target.el,
      strokeWidth: [2, 4, 2],
      strokeDashoffset: [target.length, -target.length]
    })
  };
});

const t1 = TweenRex({
  onFinish: function() {
    t1.restart();
  }
});
t1.add(tweens, { stagger: 500 });
t1.restart();
```
