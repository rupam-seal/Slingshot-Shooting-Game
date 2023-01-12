// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 1500,
    height: 800,
    wireframes: false,
  },
});

var ground = Bodies.rectangle(1000, 400, 300, 20, { isStatic: true });

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    render: { visible: false },
  },
});

render.mouse = mouse;

let ball = Matter.Bodies.circle(300, 400, 20);
let sling = Matter.Constraint.create({
  pointA: { x: 300, y: 400 },
  bodyB: ball,
  stiffness: 0.05,
});

let stack = Matter.Composites.stack(900, 10, 4, 4, 0, 0, function (x, y) {
  return Matter.Bodies.polygon(x, y, 8, 30);
});

let firing = false;
Matter.Events.on(mouseConstraint, 'enddrag', function (e) {
  if (e.body === ball) firing = true;
});
Matter.Events.on(engine, 'afterUpdate', function () {
  if (
    firing &&
    Math.abs(ball.position.x - 300) < 20 &&
    Math.abs(ball.position.y - 400) < 20
  ) {
    ball = Matter.Bodies.circle(300, 400, 20);
    Matter.World.add(engine.world, ball);
    sling.bodyB = ball;
    firing = false;
  }
});

// add all of the bodies to the world
Composite.add(engine.world, [stack, ground, ball, sling, mouseConstraint]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
