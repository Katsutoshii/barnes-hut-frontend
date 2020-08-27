import "../scss/App.scss";
import ParticleView from "./main/ParticleView";

type Props = {
  xArray: Uint8Array;
  yArray: Uint8Array;
};

export default function Root(props: Props) {
  const { xArray, yArray } = props;

  return (
    <div>
      <ParticleView xArray={xArray} yArray={yArray} />
    </div>
  );
}
