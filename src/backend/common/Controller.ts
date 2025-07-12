import { DatabaseSync } from 'node:sqlite';

export abstract class Controller {
	constructor(protected db: DatabaseSync) {
		this.setup();
	}

	abstract setup(): void;

	
}
