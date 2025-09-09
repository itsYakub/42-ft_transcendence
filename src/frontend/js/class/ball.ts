import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import { Shape } from './shape.js';
import { g_game, g_gamePlayableArea, g_boundCellSize } from './game.js';
import { sendMessageToServer } from '../sockets/clientSocket.js';
import { MessageType } from '../../../common/interfaces.js';

export class Ball extends Shape {
    /* HTML DOM Elements */
    private	m_canvas : HTMLCanvasElement;

    /* Network sync throttling */
    private m_lastSyncTime: number = 0;
    private readonly m_syncInterval: number = 100; // Reduced to 10 updates per second
    private m_forcedSync: boolean = false;

    /* SECTION: Constructor */

    public constructor(canvas : HTMLCanvasElement, scene : BABYLON.Scene) {
        /* Base constructor */
        super(scene, BABYLON.Vector2.Zero(), new BABYLON.Vector3(0.2, 0.2, 0.2), new BABYLON.Color3(0.28, 0.62, 0.84));

        /* Assign the references */
        this.m_canvas = canvas;

        /* Create the ball itself */
        this.m_name = 'ball';
        this.createMesh();
    }

    /* SECTION: Public Methods */

    public start() {
        /* NOTE(joleksia):
         *  This thing should be handled by the server
         *
         *  @agarbacz/@lwillis:
         *   Please, consider this as a server operation somehow.
         *   Preferably it should be handled by some other server-instance and then sent to the clients.
         */

        // In networked games, only the master client (localIndex 0) controls the ball
        if (g_game.networked && g_game.localIndex !== 0) {
            return; // Non-master clients don't start the ball
        }

        do {
            this.vel.x = Math.floor(Math.random() * 3.0 + -1.0);
        } while(this.vel.x == 0.0);
        do {
            this.vel.y = Math.floor(Math.random() * 3.0 + -1.0);
        } while(this.vel.y == 0.0);

        /* Simple position-prediction for the ball */
        this.simulatePosition();

        // Send initial ball state to other client
        if (g_game.networked && g_game.gameId) {
            this.sendBallUpdate(true); // Force send initial state
        }
    }

    public reset() {
        this.pos.x = this.pos.y = 0.0;
        this.vel.x = this.vel.y = 0.0;

        // Send reset state to other client immediately
        if (g_game.networked && g_game.gameId && g_game.localIndex === 0) {
            this.sendBallUpdate(true); // Force send reset state
        }

		/* NOTE(joleksia):
		 *  @agarbacz @lwillis is this timeout necessary???
		 *  If so, it requires some fixes, otherwise it break the ball logic during the match
		 *  (interrupting the UPDATE state)
		 * */
        // setTimeout(() => {
        //	  this.start();
        // }, 1000);
    }

    public update() {
        if (g_game.gameOver) { return; }

        // In networked games, only the master client updates ball physics
        if (g_game.networked && g_game.localIndex !== 0) {
            // Non-master clients only update visual position, physics are synced from network
            super.update();
            return;
        }

        this.playerBounceCheck();
        this.wallBounceCheck();

        /* Update the base 'Shape' class */
        super.update();

        // Send ball position to other client periodically (throttled) or when forced
        if (g_game.networked && g_game.gameId) {
            const now = Date.now();
            if (this.m_forcedSync || (now - this.m_lastSyncTime >= this.m_syncInterval)) {
                this.sendBallUpdate(this.m_forcedSync);
                this.m_lastSyncTime = now;
                this.m_forcedSync = false;
            }
        }
    }

    // New method to sync ball state from network
    public syncFromNetwork(pos: {x: number, y: number}, vel: {x: number, y: number}) {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
        this.vel.x = vel.x;
        this.vel.y = vel.y;
    }

    // Method to send ball updates to other clients
    private sendBallUpdate(force: boolean = false) {
        if (!g_game.networked || !g_game.gameId || g_game.localIndex !== 0) return;

        const ballPayload = {
            kind: "BALL_UPDATE",
            pos: { x: this.pos.x, y: this.pos.y },
            vel: { x: this.vel.x, y: this.vel.y },
            timestamp: Date.now()
        };

        sendMessageToServer({
            type: MessageType.MATCH_UPDATE,
            gameId: g_game.gameId,
            content: JSON.stringify(ballPayload),
        });
    }

    /* NOTE(joleksia):
     *  This function simulates the future ball position after the bounce
     */
    public simulatePosition() : BABYLON.Vector2 {
        let	pos : BABYLON.Vector2 = new BABYLON.Vector2(this.pos.x, this.pos.y);
        let	vel : BABYLON.Vector2 = new BABYLON.Vector2(this.vel.x, this.vel.y);
        /* This is kept here for safety purposes to avoid infinite loops */
        let	sim_cap : number = 128;

        while (sim_cap-- > 0) {
            if (/* Bounce: TOP */    (pos.y - this.siz.y / 2.0) <= (-g_gamePlayableArea.y + g_boundCellSize / 2.0) ||
                /* Bounce: BOTTOM */ (pos.y + this.siz.y / 2.0) >= (g_gamePlayableArea.y - g_boundCellSize / 2.0)
            ) {
                vel.y *= -1.0;
            }
            else if (/* Bounce: LEFT */  (pos.x - this.siz.x / 2.0) <= (-g_gamePlayableArea.x + g_boundCellSize / 2.0) ||
                /* Bounce: RIGHT */ (pos.x + this.siz.x / 2.0) >= (g_gamePlayableArea.x - g_boundCellSize / 2.0)
            ) {
                break;
            }

            pos.x += vel.x;
            pos.y += vel.y;
        }

        return (pos);
    }

    /* SECTION: Private Methods */

    private wallBounceCheck() {
        /* NOTE(joleksia):
         *  This should also be a 'lose condition' and should send a 'goal event' (or something like that)
         */
        if (/* Bounce: LEFT */  (this.pos.x - this.siz.x / 2.0) <= (-g_gamePlayableArea.x + g_boundCellSize / 2.0) ||
            /* Bounce: RIGHT */ (this.pos.x + this.siz.x / 2.0) >= (g_gamePlayableArea.x - g_boundCellSize / 2.0)
        ) {
            g_game.score(this.pos.x > 0.0, this.pos.x < 0.0);
            this.m_vel.x *= -1.0;
        }

        if (/* Bounce: TOP */    (this.pos.y - this.siz.y / 2.0) <= (-g_gamePlayableArea.y + g_boundCellSize / 2.0) ||
            /* Bounce: BOTTOM */ (this.pos.y + this.siz.y / 2.0) >= (g_gamePlayableArea.y - g_boundCellSize / 2.0)
        ) {
            this.m_vel.y *= -1.0;

            // Mark for forced sync on next update instead of immediate send
            if (g_game.networked && g_game.gameId && g_game.localIndex === 0) {
                this.m_forcedSync = true;
            }
        }
    }

    private playerBounceCheck() {
        let	p0 = this.m_scene.getMeshByName('player0');
        let	p1 = this.m_scene.getMeshByName('player1');

        /* TODO(joleksia):
         *  Paste the previous implementation of the ball bouncing
         *  SOURCE:
         *	- https://github.com/coldandtired/ft_transcendence/blob/a19c083a77dd46ab9a900f0b97a5211eef3f9922/src/frontend/public/js/game/ball.ts#L68
         */

        let	p0_tl = new BABYLON.Vector4(
            p0.position.x - p0.scaling.x / 2.0, p0.position.z - p0.scaling.z / 2.0,
            p0.scaling.x, p0.scaling.z
        );
        let	p1_tl = new BABYLON.Vector4(
            p1.position.x - p1.scaling.x / 2.0, p1.position.z - p1.scaling.z / 2.0,
            p1.scaling.x, p1.scaling.z
        );
        let	b_tl = new BABYLON.Vector4(
            this.m_box.position.x - this.m_box.scaling.x / 2.0, this.m_box.position.z - this.m_box.scaling.z / 2.0,
            this.m_box.scaling.x, this.m_box.scaling.z
        );

        /* Ball - Player0 (left) bounce */
        if (this.m_box.intersectsMesh(p0) && this.vel.x < 0.0) {
            /* Horizontal bounce (on X axis: left-right) */
            if (Math.abs((b_tl.x) - (p0_tl.x + p0_tl.z)) < p0_tl.z) {
                this.vel.x *= -1.0;
                // Mark for forced sync on next update
                if (g_game.networked && g_game.gameId && g_game.localIndex === 0) {
                    this.m_forcedSync = true;
                }
            }

            /* Vertical bounce (on Y axis: top-down) */
            else if (
                Math.abs((b_tl.y + b_tl.w) - (p0_tl.y)) < p0_tl.w && this.vel.y > 0 ||
                Math.abs((b_tl.y) - (p0_tl.y + p0_tl.w)) < p0_tl.w && this.vel.y < 0
            ) {
                this.vel.y *= -1.0;
                // Mark for forced sync on next update
                if (g_game.networked && g_game.gameId && g_game.localIndex === 0) {
                    this.m_forcedSync = true;
                }
            }
        }

        /* Ball - Player1 (right) bounce */
        if (this.m_box.intersectsMesh(p1) && this.vel.x > 0.0) {
            /* Horizontal bounce (on X axis: left-right) */
            if (Math.abs((b_tl.x + b_tl.z) - (p1_tl.x)) < p1_tl.w) {
                this.vel.x *= -1.0;
                // Mark for forced sync on next update
                if (g_game.networked && g_game.gameId && g_game.localIndex === 0) {
                    this.m_forcedSync = true;
                }
            }

            /* Vertical bounce (on Y axis: top-down) */
            else if (
                Math.abs((b_tl.y + b_tl.w) - (p1_tl.y)) < p1_tl.w && this.vel.y > 0 ||
                Math.abs((b_tl.y) - (p1_tl.y + p1_tl.w)) < p1_tl.w && this.vel.y < 0
            ) {
                this.vel.y *= -1.0;
                // Mark for forced sync on next update
                if (g_game.networked && g_game.gameId && g_game.localIndex === 0) {
                    this.m_forcedSync = true;
                }
            }
        }
    }
}
