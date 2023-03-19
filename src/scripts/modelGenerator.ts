import { l, bodyStyles } from "../script";

function transformRange(value: number): number {
	// [IN]  1 - 118
	// [OUT] 0 - 50

	let scale = (0 - 25) / (1 - 118);
	return scale * value;
}

function ptInCircle(pt, r) {
	const lhs = Math.pow(pt[0], 2) + Math.pow(pt[1], 2);
	const rhs = Math.pow(r, 2);

	return lhs < rhs ? -1 : lhs === rhs ? 0 : 1;
}

function a(a) {
	return a;
}
function b(a) {
	return a;
}
function c(a) {
	return a;
}
function d(a) {
	return a;
}
function e(a) {
	return a;
}
function f(a) {
	return a;
}
function g(a) {
	return a;
}
function h(a) {
	return a;
}
function i(a) {
	return a;
}

export class ElementModel {
	atomicNumber: number;
	shells: number;
	MAX_ELECTRONS_PER_RING: number[] = [2, 8, 16, 32, 32, 20, 8];
	electronsPerRing: number[] = [];

	ringGap: number = 20;
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

	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	penColor: string;

	// time: Date = new Date();
	_innerTime = 0;
	bind;

	neutronColors = ["#CF3B29", "#D5343A", "#CB2442"];
	protonColors = ["#3aa346", "#58bb44", "#78d23d"];

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

			this.updatePenColors();
		}
	}

	updatePenColors() {
		this.penColor = bodyStyles.getPropertyValue("--opposite");
		this.ctx.fillStyle = this.penColor;
		this.ctx.strokeStyle = this.penColor;
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

		let _noise = transformRange(10);
		// let randX = 0;
		// let randY = 0;

		let i = 0;
		let rhs = (this.boundaryRadius ** 2); // to compensate

        let xSign = 0;
        let xNoise = 0;
        let xNegNoise = 0;
        
        let ySign = 0;
        let yNoise = 0;
        let yNegNoise = 0
        
        // let negative

        while (i < this.atomicNumber) {
			// l("drawing neucleus");

			let proton = this.protons[i];

            xSign = Math.sign(proton.x)
            xNoise = _noise * (xSign)
            xNegNoise = _noise * (~xSign + 1)
            
			proton.x +=
				((proton.x + xNoise) ** 2) + (proton.y ** 2) <= rhs
					? Math.random() > 0.5
						? _noise
						: -_noise
					: ((proton.x + xNegNoise) ** 2) + (proton.y ** 2) <= rhs
					? xNegNoise
					: xNegNoise;

            ySign = Math.sign(proton.y)
            yNoise = _noise * (ySign)
            yNegNoise = _noise * (~ySign + 1)

			proton.y +=
				((proton.y + yNoise) ** 2) + (proton.x ** 2) <= rhs
					? Math.random() > 0.5
						? _noise
						: -_noise
					: ((proton.y + yNegNoise) ** 2) + (proton.x ** 2) <= rhs
					? yNegNoise// experimental, if doesn't work just use the normal negNoise
					: yNegNoise//a(noise); 

			this.ctx.fillStyle = proton.color;
			this.ctx.beginPath();
			this.ctx.arc(proton.x, proton.y, 5, 0, Math.PI * 2, true);
			this.ctx.fill();

			let neutron = this.neutrons[i];

            xSign = Math.sign(neutron.x)
            xNoise = _noise * (xSign)
            xNegNoise = _noise * (~xSign + 1)
            
			neutron.x +=
				((neutron.x + xNoise) ** 2) + (neutron.y ** 2) <= rhs
					? Math.random() > 0.5
						? _noise
						: -_noise
					: ((neutron.x + xNegNoise) ** 2) + (neutron.y ** 2) <= rhs
					? xNegNoise
					: xNegNoise;

            ySign = Math.sign(neutron.y)
            yNoise = _noise * (ySign)
            yNegNoise = _noise * (~ySign + 1)

			neutron.y +=
				((neutron.y + yNoise) ** 2) + (neutron.x ** 2) <= rhs
					? Math.random() > 0.5
						? _noise
						: -_noise
					: ((neutron.y + yNegNoise) ** 2) + (neutron.x ** 2) <= rhs
					? yNegNoise// experimental, if doesn't work just use the normal negNoise
					: yNegNoise//a(noise); 

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
