const qs = document.querySelector.bind(document);
const easingHeart = mojs.easing.path(
  "M0,100C2.9,86.7,33.6-7.3,46-7.3s15.2,22.7,26,22.7S89,0,100,0"
);

const el = {
  container: qs(".mo-container"),

  i: qs(".lttr--I"),
  l: qs(".lttr--L"),
  o: qs(".lttr--O"),
  v: qs(".lttr--V"),
  e: qs(".lttr--E"),
  y: qs(".lttr--Y"),
  o2: qs(".lttr--O2"),
  u: qs(".lttr--U"),

  m: qs(".lttr--M"),
  i2: qs(".lttr--I2"),
  a: qs(".lttr--A"),
  u2: qs(".lttr--U2"),

  lineLeft: qs(".line--left"),
  lineRight: qs(".line--rght"),

  colTxt: "#763c8c",
  colHeart: "#8b1e3f",

  blup: qs(".blup"),
  blop: qs(".blop"),
  sound: qs(".sound"),
};

class Heart extends mojs.CustomShape {
  getShape() {
    return '<path d="M50,88.9C25.5,78.2,0.5,54.4,3.8,31.1S41.3,1.8,50,29.9c8.7-28.2,42.8-22.2,46.2,1.2S74.5,78.2,50,88.9z"/>';
  }
  getLength() {
    return 200;
  }
}

mojs.addShape("heart", Heart);

const crtBoom = (delay = 0, x = 0, rd = 46) => {
  const parent = el.container;
  const crcl = new mojs.Shape({
    shape: "circle",
    fill: "none",
    stroke: el.colTxt,
    strokeWidth: { 5: 0 },
    radius: { [rd]: [rd + 20] },
    easing: "quint.out",
    duration: 500 / 3,
    parent,
    delay,
    x,
  });

  const brst = new mojs.Burst({
    radius: { [rd + 15]: 110 },
    angle: "rand(60, 180)",
    count: 3,
    timeline: { delay },
    parent,
    x,
    children: {
      radius: [5, 3, 7],
      fill: el.colTxt,
      scale: { 1: 0, easing: "quad.in" },
      pathScale: [0.8, null],
      degreeShift: ["rand(13, 60)", null],
      duration: 1000 / 3,
      easing: "quint.out",
    },
  });

  return [crcl, brst];
};

const crtLoveTl = () => {
  const move = 1000;
  const boom = 200;
  const easing = "sin.inOut";
  const easingBoom = "sin.in";
  const easingOut = "sin.out";
  const opts = { duration: move, easing, opacity: 1 };
  const delta = 150;

  const letters = [
    el.i, el.l, el.o, el.v, el.e, el.y, el.o2, el.u,
    el.m, el.i2, el.a, el.u2
  ];

  return new mojs.Timeline().add([
    new mojs.Tween({
      duration: move,
      onStart: () => {
        letters.forEach((el) => {
          el.style.opacity = 1;
          el.style =
            "transform: translate(0px, 0px) rotate(0deg) scale(1, 1); opacity: 1;";
        });
      },
      onComplete: () => el.blop.play(),
    }),

    new mojs.Tween({
      duration: move * 4 + boom * 3,
      onComplete: () => el.blup.play(),
    }),

    new mojs.Tween({
      duration: 50,
      delay: 5700,
      onUpdate: (progress) => {
        letters.forEach((el) => {
          el.style = `transform: scale(1); opacity: ${1 * progress};`;
        });
      },
      onComplete: () => {
        letters.forEach((el) => {
          el.style.opacity = 1;
          el.style = "transform: scale(1); opacity: 1;";
        });
      },
    }),

    // Animaciones de letras (ajustadas para espacio y secuencia)
    ...[
      [el.i, 0],
      [el.l, 30],
      [el.o, 60],
      [el.v, 90],
      [el.e, 120],
      [el.y, 150],
      [el.o2, 180],
      [el.u, 210],
      [el.m, 240],
      [el.i2, 270],
      [el.a, 300],
      [el.u2, 330],
    ].map(([letter, xOffset], idx) =>
      new mojs.Html({
        ...opts,
        el: letter,
        x: { 0: xOffset - 180 },
        delay: idx * 80,
      })
    ),

    new mojs.Shape({
      parent: el.container,
      shape: "heart",
      delay: move,
      fill: el.colHeart,
      x: 0,
      scale: { 0: 0.95, easing: easingHeart },
      duration: 500,
    })
      .then({
        x: { to: 0 },
        scale: { to: 0.45 },
        easing,
        duration: move * 2,
      })
      .then({
        duration: boom,
        scale: { to: 0 },
        easing: easingOut,
      }),

    ...crtBoom(move, 0, 46),
    ...crtBoom(move * 2 + boom, 30, 34),
    ...crtBoom(move * 3 + boom * 2 - delta, -30, 34),
    ...crtBoom(move * 3 + boom * 2, 60, 34),
  ]);
};

const loveTl = crtLoveTl().play();
setInterval(() => {
  loveTl.replay();
}, 6000);

const volume = 0.2;
el.blup.volume = volume;
el.blop.volume = volume;

const toggleSound = () => {
  let on = true;
  return () => {
    if (on) {
      el.blup.volume = 0.0;
      el.blop.volume = 0.0;
      el.sound.classList.add("sound--off");
    } else {
      el.blup.volume = volume;
      el.blop.volume = volume;
      el.sound.classList.remove("sound--off");
    }
    on = !on;
  };
};
el.sound.addEventListener("click", toggleSound());
