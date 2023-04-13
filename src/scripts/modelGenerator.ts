import { l, bodyStyles } from "../script";
import $ from "jquery";

function transformRange(value: number): number {
	// [IN]  1 - 118
	// [OUT] 0 - 50

	let scale = (0 - 25) / (1 - 118);
	return scale * value;
}

// function ptInCircle(pt, r) {
// 	const lhs = Math.pow(pt[0], 2) + Math.pow(pt[1], 2);
// 	const rhs = Math.pow(r, 2);

// 	return lhs < rhs ? -1 : lhs === rhs ? 0 : 1;
// }

function a(a: any) {
	return a;
}

export class ElementModel {
	atomicNumber: number;
	shells: number;
	MAX_ELECTRONS_PER_RING: number[] = [2, 8, 16, 32, 32, 20, 8];
	electronsPerRing: number[] = [];

	ringGap: number;
	rings: number;

	neutrons: { x: number; y: number; Rx: number; Ry: number; color: string }[] =
		[];
	protons: { x: number; y: number; Rx: number; Ry: number; color: string }[] =
		[];
	// protons: { x: number; y: number; color: string }[] = [];

	startingAngle: number = 0;
	ringsAngles: number[] = [0, 0, 0, 0, 0, 0, 0];
	framesPerRevolution: number = 0.1; //
	additionalAnglePerUpdate: number;
	FRAME_RATE: number = 60;

	centerX: number;
	centerY: number;
	boundaryRadius: number;

	radius: number;

	_canvas!: HTMLCanvasElement;
	_ctx!: CanvasRenderingContext2D;

	_penColor!: string;

	hover: number = 0; // 1 - electron, 2 - proton, 3 - neutron

	// time: Date = new Date();
	_innerTime = 0;
	bind;

	neutronColors = ["#CF3B29", "#D5343A", "#CB2442"];
	protonColors = ["#3aa346", "#58bb44", "#78d23d"];

	constructor(atomicNumber: number = 1) {
		this.atomicNumber = atomicNumber;
		this.boundaryRadius = transformRange(this.atomicNumber);

		this.shells = 0;
		this.ringGap = 0;
		this.rings = 0;

		this.additionalAnglePerUpdate = 0;
		this.centerX = 0;
		this.centerY = 0;

		this.radius = 0;

		this._initCanvas();

		this.bind = this.draw.bind(this);

		this._ringsCalculator();
		this._generateProtons();

		window.requestAnimationFrame(this.bind);
	}

	_initCanvas() {
		this._canvas = $<HTMLCanvasElement>("#atomic-model")[0];

		if (this._canvas) {
			let container = this._canvas.parentElement!;
			this._ctx = this._canvas.getContext("2d")!;

			if (this._ctx) {
				this._canvas.width = container.clientWidth;
				this._canvas.height = container.clientWidth;

				// l(this.canvas.width);
				this.ringGap = this._canvas.width * 0.045;
				// l(this.canvas.height);

				this.centerX = this._canvas.width / 2;
				this.centerY = this._canvas.height / 2;

				// this.ringGap =
			}

			this.updatePenColors();
		}
	}

	draw() {
		this._innerTime++;

		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._ctx.save();

		this._ctx.translate(this.centerX, this.centerY);

		this._createRings();
		this._populateRings();
		this._rebuildProtons();

		// this.startingAngle += this.additionalAnglePerUpdate;

		this._ctx.restore();
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

	updatePenColors() {
		this._penColor = bodyStyles.getPropertyValue("--opposite");
		this._ctx.fillStyle = this._penColor;
		this._ctx.strokeStyle = this._penColor;
	}

	_createRings(): void {
		let startingRadius = 60;

		for (let i = 0; i < this.rings; i++) {
			this._ctx.beginPath();
			this._ctx.arc(0, 0, startingRadius, 0, Math.PI * 2, true);
			this._ctx.stroke();

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

			this._ctx.save();
			this._ctx.rotate(this.ringsAngles[ring]);

			for (
				let electron = 0;
				electron < this.electronsPerRing[ring];
				electron++
			) {
				let centerY = Math.sin(currentAngle) * currentRingRadius;
				let centerX = Math.cos(currentAngle) * currentRingRadius;

				if (this.hover == 1) {
					// l("Hovered is on");
					this._ctx.save();

					// this.ctx.fillStyle = neutron.color;
					this._ctx.filter = "blur(10)";
					this._ctx.filter = "opacity(0.5)";
					// this.ctx.filter = "brightness(1.2)";

					this._ctx.beginPath();
					this._ctx.arc(centerX, centerY, 10, 0, Math.PI * 2, true);
					this._ctx.fill();

					this._ctx.restore();
				}

				this._ctx.beginPath();
				this._ctx.arc(centerX, centerY, 5, 0, Math.PI * 2, true);
				this._ctx.fill();

				currentAngle += anglesBetweenShells;
			}

			this._ctx.restore();

			this.ringsAngles[ring] += additionalAnglePerUpdate;
			ringsSpeed += -1;

			currentRingRadius += this.ringGap;
		}
	}

	_generateProtons() {
		// l("not equal ... generating protons");
		while (this.protons.length < this.atomicNumber) {
			let randColor = Math.floor(Math.random() * 3);

			if (randColor == 3) {
				throw Error("out of range");
			}

			let { x, y } = this._randomPoint(this.boundaryRadius);

			this.neutrons.push({
				x: x,
				y: y,
				Rx: 0,
				Ry: 0,
				color: this.protonColors[randColor],
			});

			({ x, y } = this._randomPoint(this.boundaryRadius));
			// l(`summoning proton at : ${x} - ${y}`);

			this.protons.push({
				x: x,
				y: y,
				Rx: 0,
				Ry: 0,
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

		let _noise = transformRange(8);
		// let randX = 0;
		// let randY = 0;

		let i = 0;
		let rhs = this.boundaryRadius ** 2; // to compensate

		let xSign = 0;
		let xNoise = 0;
		let xNegNoise = 0;

		let ySign = 0;
		let yNoise = 0;
		let yNegNoise = 0;

		// let negative

		while (i < this.atomicNumber) {
			// l("drawing neucleus");

			let proton = this.protons[i];

			xSign = Math.sign(proton.x);
			xNoise = _noise * xSign;
			xNegNoise = _noise * (~xSign + 1);

			proton.x +=
				(proton.x + xNoise) ** 2 + proton.y ** 2 <= rhs
					? Math.random() > 0.5
						? _noise
						: -_noise
					: (proton.x + xNegNoise) ** 2 + proton.y ** 2 <= rhs
					? xNegNoise
					: xNegNoise;

			ySign = Math.sign(proton.y);
			yNoise = _noise * ySign;
			yNegNoise = _noise * (~ySign + 1);

			proton.y +=
				(proton.y + yNoise) ** 2 + proton.x ** 2 <= rhs
					? Math.random() > 0.5
						? _noise
						: -_noise
					: (proton.y + yNegNoise) ** 2 + proton.x ** 2 <= rhs
					? yNegNoise // experimental, if doesn't work just use the normal negNoise
					: yNegNoise; //a(noise);

			this._ctx.fillStyle = proton.color;
			this._ctx.beginPath();
			this._ctx.arc(proton.x, proton.y, 5, 0, Math.PI * 2, true);
			this._ctx.fill();

			let neutron = this.neutrons[i];

			xSign = Math.sign(neutron.x);
			xNoise = _noise * xSign;
			xNegNoise = _noise * (~xSign + 1);

			neutron.x +=
				(neutron.x + xNoise) ** 2 + neutron.y ** 2 <= rhs
					? Math.random() > 0.5
						? _noise
						: -_noise
					: (neutron.x + xNegNoise) ** 2 + neutron.y ** 2 <= rhs
					? xNegNoise
					: xNegNoise;

			ySign = Math.sign(neutron.y);
			yNoise = _noise * ySign;
			yNegNoise = _noise * (~ySign + 1);

			neutron.y +=
				(neutron.y + yNoise) ** 2 + neutron.x ** 2 <= rhs
					? Math.random() > 0.5
						? _noise
						: -_noise
					: (neutron.y + yNegNoise) ** 2 + neutron.x ** 2 <= rhs
					? yNegNoise // experimental, if doesn't work just use the normal negNoise
					: yNegNoise; //a(noise);

			this._ctx.fillStyle = neutron.color;
			this._ctx.beginPath();
			this._ctx.arc(neutron.x, neutron.y, 5, 0, Math.PI * 2, true);
			this._ctx.fill();

			// l(this.hover);
			if (this.hover == 2) {
				// l("Hovered is on");
				this._ctx.save();

				this._ctx.fillStyle = proton.color;
				this._ctx.filter = "blur(10)";
				this._ctx.filter = "opacity(0.5)";
				// this.ctx.filter = "brightness(1.2)";
				this._ctx.beginPath();
				this._ctx.arc(proton.x, proton.y, 13, 0, Math.PI * 2, true);
				this._ctx.fill();

				this._ctx.restore();
			}
			if (this.hover == 3) {
				// l("Hovered is on");
				this._ctx.save();

				this._ctx.fillStyle = neutron.color;
				this._ctx.filter = "blur(10)";
				this._ctx.filter = "opacity(0.5)";
				// this.ctx.filter = "brightness(1.2)";

				this._ctx.beginPath();
				this._ctx.arc(neutron.x, neutron.y, 13, 0, Math.PI * 2, true);
				this._ctx.fill();

				this._ctx.restore();
			}

			i++;
			if (i == 100) {
				Error("Recursion error");
			}
		}
	}

	_randomPoint(limit: number): { x: number; y: number } {
		let theta = Math.random() * Math.PI * 2;
		// let radius = Math.sqrt(limit) * Math.random();
		let radius = limit * Math.random();

		let randomX = Math.cos(theta) * radius;
		let randomY = Math.sin(theta) * radius;

		return { x: randomX, y: randomY };
	}
}
