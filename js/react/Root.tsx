import "../scss/App.scss";
import ShaderView from "./main/ShaderView";

type Props = {
  array: Uint8Array;
};

export default function Root(props: Props) {
  const { array } = props;

  return (
    <div>
      <ShaderView array={array} />
    </div>
  );
}
