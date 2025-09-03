import * as BABYLON from 'babylonjs'

import { Player } from './player.js';
import { Ball } from './ball.js';
import { Ground } from './ground.js';
import { GamePlayer, MessageType, Message } from '../../../common/interfaces.js';
import { sendMessageToServer } from '../sockets/clientSocket.js';

/* SECTION:
 *  Classes
 * */

export enum GameMode {
    GAMEMODE_NONE = 0,
    GAMEMODE_PVP,
    GAMEMODE_AI,
    GAMEMODE_COUNT
}

type NetKeyPayload = { kind: "KEY"; action: "UP" | "DOWN"; pressed: boolean; playerId: number };
type NetGameEndPayload = { kind: "GAME_END"; p0Score: number; p1Score: number };

function isNetKeyPayload(x: any): x is NetKeyPayload {
    return (
        x &&
        x.kind === "KEY" &&
        (x.action === "UP" || x.action === "DOWN") &&
        typeof x.pressed === "boolean" &&
        typeof x.playerId === "number"
    );
}

function isNetGameEndPayload(x: any): x is NetGameEndPayload {
    return (
        x &&
        x.kind === "GAME_END" &&
        typeof x.p0Score === "number" &&
        typeof x.p1Score === "number"
    );
}

export class Game {
    /* HTML DOM Elements */
    private m_dialog: HTMLDialogElement;
    private m_canvas: HTMLCanvasElement;

    /* babylonjs elements */
    private m_engine: BABYLON.Engine;
    private m_scene: BABYLON.Scene;

    /* Game objects */
    private m_mode: GameMode;

    private m_player0: Player;
    private m_player1: Player;
    private m_ball: Ball;
    private m_ground: Ground;

    private	m_canvasCreated: boolean = false;
    private	m_engineCreated: boolean = false;
    private	m_sceneCreated: boolean = false;

    /* Match state */
    private	m_gameOver: boolean = false;

    private m_networked: boolean = false;
    private m_localIndex: 0 | 1 = 0;
    private m_gameId?: string;
    private m_started: boolean = false;

    private onLocalKeyBound?: (e: KeyboardEvent) => void;

    public static keys: Record<string, boolean>;

    /* SECTION: Public Methods */

    get	gameOver() { return (this.m_gameOver); }
    get deltaTime() { return (this.m_engine.getDeltaTime() * 0.001); }
    get ball() { return (this.m_ball); }

    public setupElements(
        mode: GameMode,
        player1: GamePlayer,
        player2?: GamePlayer,
        opts?: { networked?: boolean; gameId?: string; localIndex?: 0 | 1 }
    ) {
        this.m_gameOver = false;

        // store networking options
        this.m_networked = !!opts?.networked;
        this.m_gameId = opts?.gameId;
        this.m_localIndex = opts?.localIndex ?? 0;

        // dialog/canvas/engine/scene creation
        console.log('[ INFO ] Referencing the modal dialog');
        this.m_dialog = document.getElementById('gameDialog') as HTMLDialogElement;

        if (!this.m_canvasCreated) {
            console.log('[ INFO ] Creating a canvas object');
            this.m_canvas = document.createElement('canvas');
            this.m_canvasCreated = true;
        }
        this.m_dialog.appendChild(this.m_canvas);

        Game.keys = {}; // dictionary for string keys

        if (!this.m_networked) {
            // Non-networked games: set up all keys
            window.addEventListener("keydown", function (e) {
                Game.keys[e.key] = true;
            });
            window.addEventListener("keyup", function (e) {
                Game.keys[e.key] = false;
            });
        } else {
            // Networked games: only handle arrow keys locally for this player's paddle
            window.addEventListener("keydown", (e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    // Map arrow keys to this player's paddle keys
                    const localKey = this.m_localIndex === 0
                        ? (e.key === "ArrowUp" ? "w" : "s")      // Player 0 = purple paddle
                        : e.key;                                  // Player 1 = yellow paddle
                    Game.keys[localKey] = true;
                }
            });
            window.addEventListener("keyup", (e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    // Map arrow keys to this player's paddle keys
                    const localKey = this.m_localIndex === 0
                        ? (e.key === "ArrowUp" ? "w" : "s")      // Player 0 = purple paddle
                        : e.key;                                  // Player 1 = yellow paddle
                    Game.keys[localKey] = false;
                }
            });
        }

        // wire local key events -> network (only for local paddle scheme)
        if (this.m_networked && !this.onLocalKeyBound) {
            this.onLocalKeyBound = (e: KeyboardEvent) => {
                if (this.m_gameOver || !this.m_networked || !this.m_gameId) return;

                // Only handle arrow keys for networked games (both players use arrows)
                const isUp = e.key === "ArrowUp";
                const isDown = e.key === "ArrowDown";
                const pressed = e.type === "keydown";

                if (!isUp && !isDown) return;

                const payload: NetKeyPayload = {
                    kind: "KEY",
                    action: isUp ? "UP" : "DOWN",
                    pressed,
                    playerId: this.m_localIndex  // 0 = purple paddle, 1 = yellow paddle
                };

                // Send the key press to the server
                sendMessageToServer({
                    type: MessageType.MATCH_UPDATE,
                    gameId: this.m_gameId,
                    content: JSON.stringify(payload),
                });
            };

            window.addEventListener("keydown", this.onLocalKeyBound, true);
            window.addEventListener("keyup", this.onLocalKeyBound, true);
        }

        if (!this.m_engineCreated) {
            console.log('[ INFO ] Creating a babylon engine');
            this.m_engine = new BABYLON.Engine(this.m_canvas, true, { preserveDrawingBuffer: true, stencil: true });
            this.m_engineCreated = true;
        }

        if (!this.m_sceneCreated) {
            console.log('[ INFO ] Creating a babylon scene');
            this.m_mode = mode;
            this.m_scene = this.createScene();
            this.m_sceneCreated = true;
        }

        console.log('[ INFO ] Preparing the game');
        this.m_dialog.showModal();

        this.m_canvas.width = this.m_dialog.clientWidth;
        this.m_canvas.height = this.m_dialog.clientHeight;

        if (!this.m_engine.activeRenderLoops.length) {
            this.m_engine.runRenderLoop(() => this.updateRenderLoop());
        }

        console.log('[ INFO ] Game is running...');

        // networked matches wait for MATCH_START; locals start immediately
        if (this.m_networked) {
            console.log('[ INFO ] Networked game - waiting for MATCH_START message...');
            // wait for actuallyStart() when MATCH_START arrives
        } else if (GameMode.GAMEMODE_NONE == mode) {
            setTimeout(() =>
                sendMessageToServer({
                    type: MessageType.MATCH_START,
                    gameId: player1.gameId
                }), 1000);
        } else {
            setTimeout(() => {
                this.m_ball.start();
                this.m_started = true;
            }, 1000);
        }
    }


    public actuallyStart() {
        if (this.m_gameOver || this.m_started) return;
        console.log('[ INFO ] Actually starting networked game - ball should move now');

        this.m_ball.start();
        this.m_started = true;
    }

    public netOnMessage(message: Message) {
        if (!this.m_networked || !this.m_gameId || message.gameId !== this.m_gameId)
            return;
        if (!message.content) return;

        let parsed: unknown;
        try {
            parsed = JSON.parse(message.content);
        } catch {
            return;
        }

        if (isNetKeyPayload(parsed)) {
            const payload = parsed as NetKeyPayload;

            // don't process our own key presses
            if (payload.playerId === this.m_localIndex) return;

            // arrow presses to paddles mapping
            const keyToUpdate = payload.playerId === 0
                ? payload.action === "UP" ? "w" : "s"           // purple paddle (left)
                : payload.action === "UP" ? "ArrowUp" : "ArrowDown";  // yellow paddle (right)

            Game.keys[keyToUpdate] = payload.pressed;

        } else if (isNetGameEndPayload(parsed)) {
            const payload = parsed as NetGameEndPayload;

            // sync scores
            this.m_player0.score = payload.p0Score;
            this.m_player1.score = payload.p1Score;

            // end game
            if (!this.m_gameOver) {
                this.matchOver();
            }
        }
    }

    public dispose() {
        if (this.m_gameOver) return; // idempotent

        console.log('[ INFO ] Disposing babylon scene');
        this.m_scene.dispose();
        this.m_sceneCreated = false;

        console.log('[ INFO ] Disposing babylon engine');
        this.m_engine.stopRenderLoop();
        this.m_engine.dispose();
        this.m_engineCreated = false;

        console.log('[ INFO ] Removing canvas object from dialog');
        this.m_dialog.removeChild(this.m_canvas);
        this.m_canvasCreated = false;

        console.log('[ INFO ] Closing dialog');
        this.m_dialog.close();

        // rm local key listeners if any
        if (this.onLocalKeyBound) {
            window.removeEventListener("keydown", this.onLocalKeyBound, true);
            window.removeEventListener("keyup", this.onLocalKeyBound, true);
            this.onLocalKeyBound = undefined;
        }
        this.m_networked = false;
        this.m_started = false;

        this.m_gameOver = true;
        console.log('[ INFO ] Game is disposed...');
    }

    public score(p0: boolean, p1: boolean) {
        /* Increment the player score. */
        if (p0) { this.m_player0.score++ };
        if (p1) { this.m_player1.score++ };
        console.log('[ INFO ] Current score: p0:' + this.m_player0.score + ' | p1:' + this.m_player1.score);

        /* Check if someone passed the score threshold. If so, the match is over! */
        if (this.m_player0.score >= g_gameScoreTotal ||
            this.m_player1.score >= g_gameScoreTotal
        ) {
            // Send game end event to synchronize match end
            if (this.m_networked && this.m_gameId) {
                const gameEndPayload = {
                    kind: "GAME_END",
                    p0Score: this.m_player0.score,
                    p1Score: this.m_player1.score
                };

                sendMessageToServer({
                    type: MessageType.MATCH_UPDATE,
                    gameId: this.m_gameId,
                    content: JSON.stringify(gameEndPayload),
                });
            }

            this.matchOver();
            return;
        }

        /* Reset round */
        this.m_player0.reset();
        this.m_player1.reset();
        this.m_ball.reset();
    }

    /* SECTION: Private Methods */


    private updateRenderLoop() {
        /* SECTION: Update */
        if (this.gameOver) {
            return;
        }

        /* Update game time */
        g_gameTime += this.deltaTime;

        /* Update game components */
        this.m_ground.update();
        this.m_player0.update();
        this.m_player1.update();
        this.m_ball.update();

        /* SECTION: Render */
        /* Resize the canvas to the size of the dialog */
        this.m_canvas.width = this.m_dialog.clientWidth;
        this.m_canvas.height = this.m_dialog.clientHeight;

        this.m_scene.render()
    }

    // send the match info back to the frontend
    // might need more fields later
    private matchOver() {
        this.m_ball.reset();

        this.m_dialog.dispatchEvent(new CustomEvent("matchOver", {
            detail: {
                g1Score: this.m_player0.score,
                g2Score: this.m_player1.score
            }
        }));

        // show "winner message" or something
        this.dispose();
    }

    private createScene() {
        let scene = new BABYLON.Scene(this.m_engine);

        /* SECTION: Camera Setup */
        let camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 16, 10, new BABYLON.Vector3(0, 0, 0));

        const light = new BABYLON.PointLight("light0", new BABYLON.Vector3(0, 5, 0), scene);
        light.intensity = 2.0;
        light.diffuse = new BABYLON.Color3(0.15, 0, 0.4);
        light.specular = new BABYLON.Color3(0, 0, 0);
        light.intensity = 1;

        /* Set up the game based on the gamemode */
        this.m_ground = new Ground(scene, new BABYLON.Vector2(32.0, 24.0));
        this.m_ball = new Ball(this.m_canvas, scene);
        this.m_player0 = new Player(this.m_canvas, scene, 0.0, 1.0);
        switch (this.m_mode) {
            case (GameMode.GAMEMODE_PVP): {
                this.m_player1 = new Player(this.m_canvas, scene, 1.0, 1.0);
            } break;
            case (GameMode.GAMEMODE_AI): {
                this.m_player1 = new Player(this.m_canvas, scene, 1.0, 2.0);
            } break;
        }
        return (scene);
    }
}

/* SECTION: Global game object */
export var g_gamePlayableArea: BABYLON.Vector2 = new BABYLON.Vector2(7.0, 3.0);
export var g_gameTime: number = 0.0;
export const g_gameScoreTotal: number = /* 10.0; */ 3.0;

export var g_game: Game = new Game();