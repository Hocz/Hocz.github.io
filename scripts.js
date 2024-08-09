// Adding event listeners for interactive effects on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.style.setProperty('--x', `${x}px`);
        this.style.setProperty('--y', `${y}px`);
    });

    link.addEventListener('mouseleave', function() {
        this.style.setProperty('--x', `50%`);
        this.style.setProperty('--y', `50%`);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const staticCoin = document.getElementById('staticCoin');
    const header = document.querySelector('header');
    const canvasContainer = document.createElement('div'); // Create a container for the canvas

    // Append canvasContainer to header
    header.appendChild(canvasContainer);
    canvasContainer.style.position = 'absolute';
    canvasContainer.style.top = '0';
    canvasContainer.style.left = '0';
    canvasContainer.style.width = '100%';
    canvasContainer.style.height = '100%';
    canvasContainer.style.pointerEvents = 'none'; // Prevent interference with other elements

    // Matter.js module aliases
    const { Engine, Render, Runner, Bodies, Composite, Events, World, Body } = Matter;

    // Create an engine
    const engine = Engine.create();
    const world = engine.world;

    // Create a renderer
    const render = Render.create({
        element: canvasContainer,
        engine: engine,
        options: {
            width: header.offsetWidth,
            height: header.offsetHeight,
            wireframes: false,
            background: 'transparent'
        }
    });

    Render.run(render);

    // Create a runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Create the ground and walls
    const ground = Bodies.rectangle(render.options.width / 2, render.options.height + 10, render.options.width, 10, {
        isStatic: true,
        render: {
            visible: true // Make ground invisible
        },
        collisionFilter: {
            category: 0x0001,
            mask: 0x0002 // Only collide with coins
        }
    });

    const leftWall = Bodies.rectangle(0, render.options.height / 2, 10, render.options.height, {
        isStatic: true,
        render: {
            visible: false // Make left wall invisible
        }
    });

    const rightWall = Bodies.rectangle(render.options.width, render.options.height / 2, 10, render.options.height, {
        isStatic: true,
        render: {
            visible: false // Make right wall invisible
        }
    });

    Composite.add(world, [ground, leftWall, rightWall]);

    // Function to create a spinning coin
    function createSpinningCoin(x, y) {
        // Define collision categories
        const coinCategory = 0x0002;
        const groundCategory = 0x0001;

        // Create a coin body
        const coin = Bodies.circle(x, y, 25, {
            render: {
                sprite: {
                    texture: 'Images/Coins/coin1.png',
                    xScale: 0.5,
                    yScale: 0.5
                }
            },
            restitution: 1, // Increased restitution for more bounce
            friction: 0.1, // Reduce friction for more bouncy effect
            collisionFilter: {
                category: coinCategory,
                mask: groundCategory // Coin should only collide with the ground
            }
        });

        Composite.add(world, coin);

        // Update the coin sprite to simulate spinning
        let frame = 1;
        const frameUpdateInterval = 200; // Time between frame updates in milliseconds
        let lastFrameUpdate = 0;

        Events.on(engine, 'beforeUpdate', (event) => {
            const now = event.timestamp;
            if (now - lastFrameUpdate > frameUpdateInterval) {
                frame = (frame % 6) + 1;
                coin.render.sprite.texture = `Images/Coins/coin${frame}.png`;
                lastFrameUpdate = now;
            }
        });

        // Add random rotational speed
        Body.setAngularVelocity(coin, Math.random() * 0.2);

        // Fade out the coin after a while
        setTimeout(() => {
            World.remove(world, coin);
        }, 5000);

        return coin;
    }

    // Handle coin click
    staticCoin.addEventListener('click', () => {
        // Get the coin position
        const rect = staticCoin.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        const x = rect.left + window.scrollX + 25; // Adjusted for coin center
        const y = rect.top + window.scrollY - headerRect.top + 25; // Adjusted for coin center and header offset

        // Create a spinning coin at the click position
        createSpinningCoin(x, y);
    });

    // Resize canvas when the window is resized
    window.addEventListener('resize', () => {
        render.options.width = header.offsetWidth;
        render.options.height = header.offsetHeight;
        Render.setSize(render, render.options.width, render.options.height);
        Engine.update(engine);
    });
});



