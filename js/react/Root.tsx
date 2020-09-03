import "../scss/App.scss";

type Props = {
  rustWasm;
};

export default function Root(props: Props) {
  const { rustWasm } = props;

  const NUM_PARTICLES = 10;
  const DIMENSION = 3;

  // Initialize arrays in JS
  const r = new Float32Array(NUM_PARTICLES * DIMENSION);
  const v = new Float32Array(NUM_PARTICLES * DIMENSION);
  const a = new Float32Array(NUM_PARTICLES * DIMENSION);
  const m = new Float32Array(NUM_PARTICLES);

  // Assign the rust simulation's pointers to point to these arrays
  rustWasm.init_simulation(NUM_PARTICLES, r, v, a, m);

  console.log("r", r);

  return (
    <div>
      <h1 className="header">
        Hi I'm a point cloud! Because I'm a point cloud, I think about
        Jojo's bum. Watashi mo, Pointu cloudu mo, jojo's bum ga thinku
        boutu a des.
      </h1>
    </div>
  );
}
