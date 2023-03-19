import { l } from "../script";

function transformRange(value: number): number {
	// [IN]  1 - 118
	// [OUT] 0 - 50

	let scale = (0 - 25) / (1 - 118);
	return scale * value;
}

export class ElementModel {
	atomicNumber: number;
	shells: number;
	MAX_ELECTRONS_PER_RING: number[] = [2, 8, 16, 32, 32, 20, 8];
	electronsPerRing: number[] = [];

	ringGap: number = 20;
	rings: number;

	neutrons: { x: number; y: number; color: string }[] = [];
	protons: { x: number; y: number; color: string }[] = [];

	startingAngle: number = 0;
	ringsAngles: number[] = [0, 0, 0, 0, 0, 0, 0];
	framesPerRevolution: number = 0.1; //
	additionalAnglePerUpdate: number;
	FRAME_RATE: number = 60;

	centerX: number;
	centerY: number;
	boundaryRadius: number;

	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	// time: Date = new Date();
	_innerTime = 0;
	bind;

	protonColors = ["#CF3B29", "#D5343A", "#CB2442"];
	neutronColors = ["#3aa346", "#58bb44", "#78d23d"];

	constructor(atomicNumber: number = 1) {
		this.atomicNumber = atomicNumber;
		this.boundaryRadius = transformRange(this.atomicNumber);

		this._initCanvas();

		this.bind = this.draw.bind(this);

		this._ringsCalculator();
		this._generateProtons();

		window.requestAnimationFrame(this.bind);
	}

	draw() {
		this._innerTime++;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.save();

		this.ctx.translate(this.centerX, this.centerY);

		this._createRings();
		this._populateRings();
		this._rebuildProtons();

		// this.startingAngle += this.additionalAnglePerUpdate;

		this.ctx.restore();
		window.requestAnimationFrame(this.bind);
	}

	changeElement(atomicNumber: number): void {
		this.atomicNumber = atomicNumber;
		this.boundaryRadius = transformRange(this.atomicNumber);

		this.electronsPerRing = [];
		this.protons = [];
		this.neutrons = [];
		this.ringsAngles = [0, 0, 0, 0, 0, 0, 0];

		this._ringsCalculator();
	}

	_ringsCalculator() {
		let rings = 0;

		let i = this.atomicNumber;
		l(i);
		while (i > 0) {
			let maxForCurrentShell = this.MAX_ELECTRONS_PER_RING[rings];

			if (maxForCurrentShell >= i) {
				this.electronsPerRing.push(i);
			} else if (maxForCurrentShell < i) {
				this.electronsPerRing.push(maxForCurrentShell);
			}

			i -= maxForCurrentShell;

			rings += 1;
			if (rings == 8) {
				throw Error("Loop recursion");
			}
		}
		this.rings = rings;
	}

	_initCanvas() {
		this.canvas = $<HTMLCanvasElement>("#atomic-model")[0];

		if (this.canvas) {
			let container = this.canvas.parentElement!;
			this.ctx = this.canvas.getContext("2d")!;

			if (this.ctx) {
				this.canvas.width = container.offsetWidth;
				this.canvas.height = container.offsetHeight;

				this.centerX = this.canvas.width / 2;
				this.centerY = this.canvas.height / 2;
			}

			this.ctx.strokeStyle = "white";
			this.ctx.fillStyle = "white";
		}
	}

	_createRings(): void {
		let startingRadius = 60;

		for (let i = 0; i < this.rings; i++) {
			this.ctx.beginPath();
			this.ctx.arc(0, 0, startingRadius, 0, Math.PI * 2, true);
			this.ctx.stroke();

			startingRadius += this.ringGap;
		}
	}

	_populateRings(): void {
		let currentRingRadius = 60;
		let ringsSpeed = 25;

		for (let ring = 0; ring < this.rings; ring++) {
			let neededForCurrentShell = this.electronsPerRing[ring];
			let anglesBetweenShells = (Math.PI * 2) / neededForCurrentShell;
			let currentAngle = anglesBetweenShells;

			let additionalAnglePerUpdate =
				(Math.PI * 2) / (this.FRAME_RATE * ringsSpeed);

			this.ctx.save();
			this.ctx.rotate(this.ringsAngles[ring]);

			for (
				let electron = 0;
				electron < this.electronsPerRing[ring];
				electron++
			) {
				let centerY = Math.sin(currentAngle) * currentRingRadius;
				let centerX = Math.cos(currentAngle) * currentRingRadius;

				this.ctx.beginPath();
				this.ctx.arc(centerX, centerY, 5, 0, Math.PI * 2, true);
				this.ctx.fill();

				currentAngle += anglesBetweenShells;
			}

			this.ctx.restore();

			this.ringsAngles[ring] += additionalAnglePerUpdate;
			ringsSpeed += -1;

			currentRingRadius += this.ringGap;
		}
	}

	_generateProtons() {
		// l("not equal ... generating protons");
		while (this.protons.length < this.atomicNumber) {
			let randColor = Math.ceil((Math.random() * 10) % 3);

			let { x, y } = this._randomPoint(this.boundaryRadius);

			this.neutrons.push({
				x: x,
				y: y,
				color: this.protonColors[randColor],
			});

			({ x, y } = this._randomPoint(this.boundaryRadius));
			// l(`summoning proton at : ${x} - ${y}`);

			this.protons.push({
				x: x,
				y: y,
				color: this.neutronColors[randColor],
			});
		}
	}

	_rebuildProtons() {
		if (!(this._innerTime % 5)) {
			if (this.atomicNumber == this.protons.length) {
				this.protons.shift();
				this.neutrons.shift();
				// l("equal .... reducing");
			}
		}
		this._generateProtons();

		let i = 0;
		while (i < this.atomicNumber) {
			// l("drawing neucleus");

			let proton = this.protons[i];
			this.ctx.fillStyle = proton.color;
			this.ctx.beginPath();
			this.ctx.arc(proton.x, proton.y, 5, 0, Math.PI * 2, true);
			this.ctx.fill();

			let neutron = this.neutrons[i];
			this.ctx.fillStyle = neutron.color;
			this.ctx.beginPath();
			this.ctx.arc(neutron.x, neutron.y, 5, 0, Math.PI * 2, true);
			this.ctx.fill();

			i++;
			if (i == 100) {
				Error("Recursion error");
			}
		}
	}

	_randomPoint(limit): { x: number; y: number } {
		let theta = Math.random() * Math.PI * 2;
		// let radius = Math.sqrt(limit) * Math.random();
		let radius = limit * Math.random();

		let randomX = Math.cos(theta) * radius;
		let randomY = Math.sin(theta) * radius;

		return { x: randomX, y: randomY };
	}
}
