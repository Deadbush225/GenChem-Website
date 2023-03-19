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
		// this.additionalAnglePerUpdate = (Math.PI * 2) / (this.FRAME_RATE / this.framesPerRevolution);

		// l(this.additionalAnglePerUpdate);

		this._initCanvas();

		this.bind = this.draw.bind(this);

		// this.draw();
		this._ringsCalculator();
		this._generateProtons();

		window.requestAnimationFrame(this.bind);
		// window.setInterval(this.bind, 50);
		// window.setInterval(this.draw, 50);
	}

	draw() {
		this._innerTime++;
		// l(this);
		// l("draw called");

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.save();

		this.ctx.translate(this.centerX, this.centerY);

		// let rotation = ((2 * Math.PI) / 60) * this.time.getSeconds();
		// l(rotation);
		// this.ctx.rotate(
		// this.startingAngle
		// rotation
		// 2
		// );

		// this.ctx.save();
		// this.ctx.fillStyle = "orange";
		// this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		// this.ctx.restore();

		// l(`${this.centerX} : ${this.centerY}`);

		// this.ctx.translate(0, 0);
		// this.ctx.rotate(2);

		this._createRings();
		this._populateRings();
		this._populateNucleus();

		// this.startingAngle += this.additionalAnglePerUpdate;

		// this.ctx.save();
		// this.ctx.translate(300, 300);

		this.ctx.restore();
		// this.ctx.restore();
		window.requestAnimationFrame(this.bind);
		// this.ctx.translate(0, 0);
	}

	changeElement(atomicNumber: number): void {
		l("warning this function is not recommended to run");

		/*
            You must cancel the previous loop before calling another loop
        */

		this.atomicNumber = atomicNumber;
		this.boundaryRadius = transformRange(this.atomicNumber);

		this.electronsPerRing = [];
		this.protons = [];
		this.neutrons = [];
		this.ringsAngles = [0, 0, 0, 0, 0, 0, 0];

		this._ringsCalculator();
		// this._generateProtons();
		// this.draw();
		// l(this.framesPerRevolution);
		// window.requestAnimationFrame(this.bind);
		// this.ctx.
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

			// console.log(i);

			rings += 1;
			if (rings == 8) {
				throw Error("Loop recursion");
			}
		}
		// l(this.electronsPerRing);
		// return rings;
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

		// console.log(startingRadius);
		// console.log(shells);
		for (let i = 0; i < this.rings; i++) {
			this.ctx.beginPath();
			this.ctx.arc(
				// this.centerX,
				0,
				// this.centerY,
				0,
				startingRadius,
				0,
				Math.PI * 2,
				true
			);
			this.ctx.stroke();

			startingRadius += this.ringGap;
		}
	}

	_populateRings(): void {
		// l(this.electronsPerRing);

		let currentRingRadius = 60;
		let ringsSpeed = 25;

		// l(this.rings);
		for (let ring = 0; ring < this.rings; ring++) {
			// let maxForCurrentShell = this.MAX_ELECTRONS_PER_RING[ring];
			let neededForCurrentShell = this.electronsPerRing[ring];
			let anglesBetweenShells = (Math.PI * 2) / neededForCurrentShell;
			// l(anglesBetweenShells);
			let currentAngle = anglesBetweenShells;

			// rings;

			let additionalAnglePerUpdate =
				(Math.PI * 2) / (this.FRAME_RATE * ringsSpeed);

			// l(additionalAnglePerUpdate);

			// l(currentAngle);
			// l("going on ring");
			// let startingAngle: number = this.ringsAngles[ring];
			this.ctx.save();
			// this.ctx.translate(this.centerX, this.centerY);
			this.ctx.rotate(this.ringsAngles[ring]);
			// l(startingAngle);

			for (
				let electron = 0;
				electron < this.electronsPerRing[ring];
				electron++
			) {
				// let centerY = this.centerY + Math.sin(currentAngle) * currentRingRadius;
				let centerY = Math.sin(currentAngle) * currentRingRadius;
				// let centerX = this.centerX + Math.cos(currentAngle) * currentRingRadius;
				let centerX = Math.cos(currentAngle) * currentRingRadius;

				this.ctx.beginPath();
				this.ctx.arc(centerX, centerY, 5, 0, Math.PI * 2, true);
				this.ctx.fill();

				// l(`creating electron : ${centerX} - ${centerX}`);
				// return;
				currentAngle += anglesBetweenShells;
			}

			this.ctx.restore();

			this.ringsAngles[ring] += additionalAnglePerUpdate;
			ringsSpeed += -1;

			// l(ringsSpeed);
			currentRingRadius += this.ringGap;
		}
		// l(this.ringsAngles);
		// l(this.electronsPerRing);
	}

	_populateNucleus() {
		// 0 - 45 continuous area for the protons and neutrons to spawn
		// convert the atomicNumber to a range from 0 - 45 where the boundary of the nucleus is
		// make them form a circular border
		// this.ctx.save();
		// this.ctx.restore();
		// let centerX = this.centerX + Math.cos(currentAngle) * currentRingRadius;
		// this.ctx.beginPath();
		// this.ctx.arc(centerX, centerY, 5, 0, Math.PI * 2, true);
		// this.ctx.fill();
		this._rebuildProtons(); ////// TURN THIS of to try
		// this._generateProton(boundaryRadius, "green");
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
		// this.ctx.fillStyle = color;
		// l(this.protons.length);

		if (!(this._innerTime % 5)) {
			if (this.atomicNumber == this.protons.length) {
				this.protons.shift();
				this.neutrons.shift();
				// l("equal .... reducing");
			}
		}
		this._generateProtons();
		// let randColor = Math.ceil((Math.random() * 10) % 3);

		// let { x, y } = this._randomPoint(boundaryRadius);

		// this.neutrons.push({
		// 	x: x,
		// 	y: y,
		// 	color: this.protonColors[randColor],
		// });

		// ({ x, y } = this._randomPoint(boundaryRadius));
		// // l(`summoning proton at : ${x} - ${y}`);

		// this.protons.push({
		// 	x: x,
		// 	y: y,
		// 	color: this.neutronColors[randColor],
		// });

		let i = 0;
		while (i < this.atomicNumber) {
			// l("drawing neucleus");
			// for (const i in this.neutronsAndProtons) {
			// for (let proton = 0; proton < this.atomicNumber; proton++) {

			let proton = this.protons[i];
			this.ctx.fillStyle = proton.color;
			this.ctx.beginPath();
			this.ctx.arc(proton.x, proton.y, 5, 0, Math.PI * 2, true);
			this.ctx.fill();
			// l(randColor);

			let neutron = this.neutrons[i];
			this.ctx.fillStyle = neutron.color;
			this.ctx.beginPath();
			this.ctx.arc(neutron.x, neutron.y, 5, 0, Math.PI * 2, true);
			this.ctx.fill();
			// PROTON
			// l(`summoning proton at : ${x} - ${y}`);

			i++;
			if (i == 100) {
				Error("Recursion error");
			}
		}
	}

	_randomPoint(limit): { x: number; y: number } {
		// limit = 15;
		let theta = Math.random() * Math.PI * 2;
		// let radius = Math.sqrt(limit) * Math.random();
		let radius = limit * Math.random();

		let randomX = Math.cos(theta) * radius;
		let randomY = Math.sin(theta) * radius;
		// let randomX =
		// Math.cos(Math.random() * Math.PI * 2) * Math.sqrt(Math.random()) * limit;
		// (Math.random() > 0.5 ? -1 : 1);
		// let randomY =
		// Math.sin(Math.random() * Math.PI * 2) * Math.sqrt(Math.random()) * limit;
		// (Math.random() > 0.5 ? -1 : 1);

		return { x: randomX, y: randomY };
	}
}
